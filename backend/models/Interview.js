const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  opportunityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Opportunity' },
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application' },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String, required: true },
  studentName: { type: String, required: true },
  jobTitle: { type: String, required: true },
  scheduledAt: { type: Date, required: [true, 'Interview date & time is required'] },
  interviewType: { type: String, enum: ['technical', 'hr', 'screening', 'final'], default: 'technical' },
  meetingLink: { type: String, default: '' },
  interviewerName: { type: String, default: 'Recruitment Team' },
  notes: { type: String, default: '' },
  status: { type: String, enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'], default: 'scheduled' },
}, { timestamps: true });

interviewSchema.methods.toPublicJSON = function () {
  return {
    id: this._id.toString(),
    opportunityId: this.opportunityId ? this.opportunityId.toString() : null,
    applicationId: this.applicationId ? this.applicationId.toString() : null,
    studentId: this.studentId.toString(),
    companyId: this.companyId.toString(),
    companyName: this.companyName,
    studentName: this.studentName,
    jobTitle: this.jobTitle,
    scheduledAt: this.scheduledAt,
    interviewType: this.interviewType,
    meetingLink: this.meetingLink,
    interviewerName: this.interviewerName,
    notes: this.notes,
    status: this.status,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('Interview', interviewSchema);
