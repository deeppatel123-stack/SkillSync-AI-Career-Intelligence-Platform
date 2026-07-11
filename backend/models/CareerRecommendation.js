const mongoose = require('mongoose');

/**
 * Career recommendation schema – stores career recommendations for students.
 */
const careerRecommendationSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  topRecommendation: {
    type: String,
    required: true,
  },
  recommendations: [{
    career: String,
    matchPercentage: Number,
  }],
  confidence: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('CareerRecommendation', careerRecommendationSchema);
