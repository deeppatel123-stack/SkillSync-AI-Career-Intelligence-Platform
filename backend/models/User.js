const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'], trim: true },
  email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true },
  password: { type: String, required: [true, 'Password is required'], minlength: 6 },
  role: { type: String, enum: ['student', 'college', 'company', 'superadmin'], required: true },
  organization: { type: String, trim: true, default: '' },
  phone: { type: String, trim: true, default: '' },
  bio: { type: String, default: '' },
  location: { type: String, default: '' },
  website: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  profilePhoto: { type: String, default: '' },
  dateOfBirth: { type: String, default: '' },
  gender: { type: String, default: '' },
  address: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  country: { type: String, default: '' },
  collegeName: { type: String, default: '' },
  degree: { type: String, default: '' },
  branch: { type: String, default: '' },
  semester: { type: String, default: '' },
  passingYear: { type: String, default: '' },
  cgpa: { type: String, default: '' },
  skills: { type: [String], default: [] },
  certifications: { type: [String], default: [] },
  projects: [{ title: String, technologies: String, githubLink: String, liveLink: String }],
  internships: [{ company: String, role: String, duration: String, mode: String, description: String }],
  languages: { type: [String], default: [] },
  savedOpportunities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Opportunity', default: [] }],
  resume: { type: String, default: '' },
  github: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  portfolio: { type: String, default: '' },
}, { timestamps: true });

userSchema.methods.toPublicJSON = function () {
  return {
    id: this._id.toString(), name: this.name, email: this.email, role: this.role,
    organization: this.organization, phone: this.phone, bio: this.bio,
    location: this.location, website: this.website, profilePhoto: this.profilePhoto,
    dateOfBirth: this.dateOfBirth, gender: this.gender, address: this.address,
    city: this.city, state: this.state, country: this.country, collegeName: this.collegeName,
    degree: this.degree, branch: this.branch, semester: this.semester,
    passingYear: this.passingYear, cgpa: this.cgpa, skills: this.skills,
    certifications: this.certifications, projects: this.projects,
    internships: this.internships, languages: this.languages, resume: this.resume,
    github: this.github, linkedin: this.linkedin, portfolio: this.portfolio,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('User', userSchema);
