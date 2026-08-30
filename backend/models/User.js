const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  nickname: {
    type: String,
    default: 'New Member'
  },
  avatar: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['member', 'moderator', 'admin'],
    default: 'member'
  },
  moderatedBoards: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Board'
  }],
  status: {
    type: String,
    enum: ['active', 'banned'],
    default: 'active'
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);