const mongoose = require('mongoose');

/**
 * Analytics schema – stores/snapshots analytics data.
 */
const analyticsSchema = new mongoose.Schema({
  // Type of analytics data
  type: {
    type: String,
    enum: ['skill_distribution', 'placement_report', 'company_report',
           'student_statistics', 'overall_stats'],
    required: true,
  },
  // The analytics data
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  // When this analytics was generated
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Analytics', analyticsSchema);
