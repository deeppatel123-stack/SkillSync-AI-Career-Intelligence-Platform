const mongoose = require('mongoose');

/**
 * Opportunity schema – internships, jobs, hackathons, events.
 */
const opportunitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['hackathon', 'internship', 'job', 'event'],
      required: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline is required'],
    },
    location: { type: String, default: '' },
    requirements: { type: String, default: '' },
    benefits: { type: String, default: '' },
    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
    },
    reviewStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

opportunitySchema.methods.toPublicJSON = function () {
  return {
    id: this._id.toString(),
    title: this.title,
    type: this.type,
    description: this.description,
    deadline: this.deadline.toISOString().split('T')[0],
    location: this.location,
    requirements: this.requirements,
    benefits: this.benefits,
    organizerId: this.organizerId.toString(),
    status: this.status,
    reviewStatus: this.reviewStatus,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('Opportunity', opportunitySchema);
