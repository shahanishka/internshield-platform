const express = require('express');
const authMiddleware = require('../middleware/auth');
const Bookmark = require('../models/Bookmark');
const Internship = require('../models/Internship');
const router = express.Router();

// GET all bookmarks for current user
router.get('/', authMiddleware, async (req, res) => {
  try {
    console.log('Bookmarks requested by user:', req.user.id);
    const bookmarks = await Bookmark.find({ userId: req.user.id })
      .populate('internshipId')
      .sort({ createdAt: -1 });
    console.log('Bookmarks found:', bookmarks.length);
    res.json(bookmarks);
  } catch (err) {
    console.error('Bookmarks error:', err.message);
    res.status(500).json({ message: 'Failed to fetch bookmarks' });
  }
});

// POST — add bookmark
router.post('/:internshipId', authMiddleware, async (req, res) => {
  const existing = await Bookmark.findOne({
    userId: req.user.id,
    internshipId: req.params.internshipId
  });
  if (existing) return res.status(409).json({ message: 'Already bookmarked' });

  const bookmark = await Bookmark.create({
    userId: req.user.id,
    internshipId: req.params.internshipId
  });
  res.status(201).json(bookmark);
});

// DELETE — remove bookmark
router.delete('/:internshipId', authMiddleware, async (req, res) => {
  await Bookmark.findOneAndDelete({
    userId: req.user.id,
    internshipId: req.params.internshipId
  });
  res.json({ message: 'Bookmark removed' });
});

// GET — check if a single internship is bookmarked
router.get('/check/:internshipId', authMiddleware, async (req, res) => {
  const exists = await Bookmark.findOne({
    userId: req.user.id,
    internshipId: req.params.internshipId
  });
  res.json({ bookmarked: !!exists });
});

module.exports = router;