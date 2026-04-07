const mongoose = require('mongoose');

const detectionSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  textPreview: { type: String },
  verdict:     { type: String, required: true },
  level:       { type: String, required: true },
  score:       { type: Number, required: true },
  redFlags:    [{ message: String, tip: String }],
  checkedAt:   { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Detection', detectionSchema);