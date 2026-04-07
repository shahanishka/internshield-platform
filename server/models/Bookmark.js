const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  internshipId: { type: mongoose.Schema.Types.ObjectId, ref: 'Internship', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Bookmark', bookmarkSchema);