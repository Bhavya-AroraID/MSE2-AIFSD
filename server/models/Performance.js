const mongoose = require('mongoose');

const PerformanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  reviewPeriod: {
    type: String, // e.g., 'Q1 2026'
    required: true
  },
  kpiScore: {
    type: Number, // 1 to 10
    required: true
  },
  technicalSkillsScore: {
    type: Number,
    required: true
  },
  softSkillsScore: {
    type: Number,
    required: true
  },
  comments: {
    type: String
  },
  aiRecommendation: {
    type: String,
    default: null
  },
  aiGeneratedAt: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('Performance', PerformanceSchema);
