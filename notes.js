const express = require('express');
const Note = require('./Note');

const router = express.Router();

// Get all notes for a user
router.get('/:userId', async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.params.userId });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Create note
router.post('/create', async (req, res) => {
  try {
    const { userId, title, content, folder, tags } = req.body;
    const note = new Note({ userId, title, content, folder, tags });
    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update note
router.put('/:id', async (req, res) => {
  try {
    const { title, content, folder, tags } = req.body;
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content, folder, tags, updatedAt: Date.now() },
      { new: true }
    );
    res.json(note);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete note
router.delete('/:id', async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;