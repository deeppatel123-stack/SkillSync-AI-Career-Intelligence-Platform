const mongoose = require('mongoose');

/**
 * Prediction schema – stores ML predictions for students.
 */
const predictionSchema = new mongoose.Schema({
  // The student this prediction belongs to
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Type of prediction
  type: {
    type: String,
    enum: ['placement', 'career'],
    required: true,
  },
  // The prediction result data (stored as JSON)
  result: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  // Input data used for the prediction
  inputData: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  // When this prediction was made
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for quick lookups
predictionSchema.index({ studentId: 1, type: -1 });

module.exports = mongoose.model('Prediction', predictionSchema);
