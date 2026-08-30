const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  rules: {
    type: String,
    default: ''
  },
  maxMembers: {
    type: Number,
    default: 100
  },
  needsApproval: {
    type: Boolean,
    default: false
  },
  moderator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Board', boardSchema);