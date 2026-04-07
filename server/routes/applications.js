const express = require('express');
const authMiddleware = require('../middleware/auth');
const Application = require('../models/Application');
const router = express.Router();

// GET all applications for current user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user.id })
      .populate('internshipId')
      .sort({ appliedAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch applications' });
  }
});

// POST — mark as applied
router.post('/:internshipId', authMiddleware, async (req, res) => {
  try {
    const existing = await Application.findOne({
      userId: req.user.id,
      internshipId: req.params.internshipId
    });
    if (existing) return res.status(409).json({ message: 'Already applied' });

    const application = await Application.create({
      userId: req.user.id,
      internshipId: req.params.internshipId,
      status: 'Applied'
    });
    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ message: 'Failed to save application' });
  }
});

// PATCH — update status
router.patch('/:internshipId', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findOneAndUpdate(
      { userId: req.user.id, internshipId: req.params.internshipId },
      { status },
      { new: true }
    );
    if (!application) return res.status(404).json({ message: 'Application not found' });
    res.json(application);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update status' });
  }
});

// DELETE — remove application
router.delete('/:internshipId', authMiddleware, async (req, res) => {
  try {
    await Application.findOneAndDelete({
      userId: req.user.id,
      internshipId: req.params.internshipId
    });
    res.json({ message: 'Application removed' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove application' });
  }
});

// GET — check if applied
router.get('/check/:internshipId', authMiddleware, async (req, res) => {
  try {
    const existing = await Application.findOne({
      userId: req.user.id,
      internshipId: req.params.internshipId
    });
    res.json({ applied: !!existing, status: existing?.status || null });
  } catch (err) {
    res.status(500).json({ message: 'Failed to check application' });
  }
});

module.exports = router;