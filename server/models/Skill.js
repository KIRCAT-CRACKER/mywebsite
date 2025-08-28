const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  level: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  category: {
    type: String,
    required: true,
    enum: ['technical', 'security', 'tools', 'programming', 'networking'],
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Skill', skillSchema);