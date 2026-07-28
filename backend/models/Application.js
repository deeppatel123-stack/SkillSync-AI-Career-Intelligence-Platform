const mongoose = require('mongoose');

const applicantDetailsSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  university: { type: String, default: '' },
  course: { type: String, default: '' },
  year: { type: String, default: '' },
  resume: { type: String, default: '' },
  coverLetter: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  skills: { type: [String], default: [] },
  projects: { type: [mongoose.Schema.Types.Mixed], default: [] },
  internships: { type: [mongoose.Schema.Types.Mixed], default: [] },
  certifications: { type: [mongoose.Schema.Types.Mixed], default: [] },
  bio: { type: String, default: '' },
  github: { type: String, default: '' },
  portfolio: { type: String, default: '' },
  languages: { type: [String], default: [] },
  cgpa: { type: String, default: '' },
}, { _id: false });

const applicationSchema = new mongoose.Schema({
  opportunityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Opportunity', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['applied', 'pending', 'reviewed', 'accepted', 'rejected'], default: 'applied' },
  appliedAt: { type: Date, default: Date.now },
  applicantDetails: { type: applicantDetailsSchema, required: true },
}, { timestamps: true });

applicationSchema.index({ opportunityId: 1, studentId: 1 }, { unique: true });

applicationSchema.methods.toPublicJSON = function () {
  return {
    id: this._id.toString(), opportunityId: this.opportunityId.toString(),
    studentId: this.studentId.toString(), status: this.status,
    appliedAt: this.appliedAt.toISOString().split('T')[0],
    applicantDetails: this.applicantDetails,
  };
};

module.exports = mongoose.model('Application', applicationSchema);
