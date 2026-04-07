const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  internshipId: { type: mongoose.Schema.Types.ObjectId, ref: 'Internship', required: true },
  status:       { type: String, enum: ['Applied', 'In Review', 'Selected', 'Rejected'], default: 'Applied' },
  appliedAt:    { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);