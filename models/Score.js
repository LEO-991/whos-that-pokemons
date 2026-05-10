const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  score: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Score', scoreSchema);
