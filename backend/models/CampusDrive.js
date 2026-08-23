const mongoose = require('mongoose');

const campusDriveSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Drive title is required'], trim: true },
  type: { type: String, enum: ['placement', 'internship', 'company_visit', 'drive'], default: 'placement' },
  companyName: { type: String, required: [true, 'Company name is required'], trim: true },
  role: { type: String, required: [true, 'Role is required'], trim: true },
  department: { type: String, default: 'All Departments' },
  minCgpa: { type: Number, default: 0 },
  requiredSkills: { type: [String], default: [] },
  driveDate: { type: Date, required: [true, 'Drive date is required'] },
  deadline: { type: Date, required: [true, 'Deadline is required'] },
  mode: { type: String, enum: ['on-campus', 'online', 'hybrid'], default: 'on-campus' },
  venue: { type: String, default: '' },
  selectionProcess: { type: String, default: 'Aptitude Test -> Technical Interview -> HR Round' },
  collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  organizerName: { type: String, default: '' },
  status: { type: String, enum: ['upcoming', 'active', 'completed'], default: 'upcoming' },
  registeredStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

campusDriveSchema.methods.toPublicJSON = function () {
  return {
    id: this._id.toString(),
    title: this.title,
    type: this.type,
    companyName: this.companyName,
    role: this.role,
    department: this.department,
    minCgpa: this.minCgpa,
    requiredSkills: this.requiredSkills,
    driveDate: this.driveDate ? this.driveDate.toISOString().split('T')[0] : '',
    deadline: this.deadline ? this.deadline.toISOString().split('T')[0] : '',
    mode: this.mode,
    venue: this.venue,
    selectionProcess: this.selectionProcess,
    collegeId: this.collegeId.toString(),
    organizerName: this.organizerName,
    status: this.status,
    registeredStudentsCount: (this.registeredStudents || []).length,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('CampusDrive', campusDriveSchema);
