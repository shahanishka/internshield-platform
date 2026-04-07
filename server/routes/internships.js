const express = require('express');
const Internship = require('../models/Internship');
const router = express.Router();

router.get('/', async (req, res) => {
  const internships = await Internship.find().sort({ createdAt: -1 });
  res.json(internships);
});

router.get('/:id', async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) return res.status(404).json({ message: 'Internship not found' });
    res.json(internship);
  } catch {
    res.status(404).json({ message: 'Internship not found' });
  }
});

module.exports = router;