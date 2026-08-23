const mongoose = require('mongoose');

const collegeEventSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Event title is required'], trim: true },
  type: { type: String, enum: ['career_fair', 'workshop', 'seminar', 'prep_session', 'hackathon'], default: 'workshop' },
  description: { type: String, required: [true, 'Description is required'] },
  eventDate: { type: Date, required: [true, 'Event date is required'] },
  time: { type: String, default: '10:00 AM' },
  location: { type: String, default: 'Auditorium / Online' },
  collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetDepartment: { type: String, default: 'All' },
  registrationLink: { type: String, default: '' },
  speakers: { type: [String], default: [] },
}, { timestamps: true });

collegeEventSchema.methods.toPublicJSON = function () {
  return {
    id: this._id.toString(),
    title: this.title,
    type: this.type,
    description: this.description,
    eventDate: this.eventDate ? this.eventDate.toISOString().split('T')[0] : '',
    time: this.time,
    location: this.location,
    collegeId: this.collegeId.toString(),
    targetDepartment: this.targetDepartment,
    registrationLink: this.registrationLink,
    speakers: this.speakers,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('CollegeEvent', collegeEventSchema);
