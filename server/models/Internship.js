const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
  company:          { type: String, required: true },
  role:             { type: String, required: true },
  domain:           { type: String, required: true },
  location:         { type: String, required: true },
  workMode:         { type: String, required: true },
  stipend:          { type: Number, required: true },
  deadline:         { type: String, required: true },
  description:      { type: String, required: true },
  responsibilities: [String],
  requirements:     [String],
  applyEmail:       { type: String, required: true },
  website:          { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Internship', internshipSchema);