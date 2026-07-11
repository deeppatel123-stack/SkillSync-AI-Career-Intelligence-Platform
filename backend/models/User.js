const mongoose = require('mongoose');

/**
 * User schema – students, colleges, companies, and superadmin.
 * Student profiles include skills, certifications, projects, internships, etc.
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['student', 'college', 'company', 'superadmin'],
      required: true,
    },
    organization: { type: String, trim: true, default: '' },
    phone: { type: String, trim: true, default: '' },
    bio: { type: String, default: '' },
    location: { type: String, default: '' },
    website: { type: String, default: '' },
    isActive: { type: Boolean, default: true },

    // Student-specific profile fields
    // Personal
    profilePhoto: { type: String, default: '' },
    dateOfBirth: { type: String, default: '' },
    gender: { type: String, default: '' },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    country: { type: String, default: '' },

    // Education
    collegeName: { type: String, default: '' },
    degree: { type: String, default: '' },
    branch: { type: String, default: '' },
    semester: { type: String, default: '' },
    passingYear: { type: String, default: '' },
    cgpa: { type: String, default: '' },

    // Skills and certifications (arrays)
    skills: { type: [String], default: [] },
    certifications: { type: [String], default: [] },

    // Projects (array of objects)
    projects: [{
      title: { type: String, default: '' },
      technologies: { type: String, default: '' },
      githubLink: { type: String, default: '' },
      liveLink: { type: String, default: '' },
    }],

    // Internships (array of objects)
    internships: [{
      company: { type: String, default: '' },
      role: { type: String, default: '' },
      duration: { type: String, default: '' },
      mode: { type: String, default: '' },
      description: { type: String, default: '' },
    }],

    // Languages
    languages: { type: [String], default: [] },

    // Resume
    resume: { type: String, default: '' },

    // Social links
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    portfolio: { type: String, default: '' },
  },
  { timestamps: true }
);

// Hide password when converting document to JSON
userSchema.methods.toPublicJSON = function () {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    role: this.role,
    organization: this.organization,
    phone: this.phone,
    bio: this.bio,
    location: this.location,
    website: this.website,
    // Student profile fields
    profilePhoto: this.profilePhoto,
    dateOfBirth: this.dateOfBirth,
    gender: this.gender,
    address: this.address,
    city: this.city,
    state: this.state,
    country: this.country,
    collegeName: this.collegeName,
    degree: this.degree,
    branch: this.branch,
    semester: this.semester,
    passingYear: this.passingYear,
    cgpa: this.cgpa,
    skills: this.skills,
    certifications: this.certifications,
    projects: this.projects,
    internships: this.internships,
    languages: this.languages,
    resume: this.resume,
    github: this.github,
    linkedin: this.linkedin,
    portfolio: this.portfolio,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('User', userSchema);
