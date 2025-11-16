// server.js
require('dotenv').config();
const express = require('express');
const { sequelize, Track } = require('./database/setup');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Basic test route
app.get('/', (req, res) => {
  res.json({ message: "Music Library API is running" });
});

/**
 * GET /api/tracks
 */
app.get('/api/tracks', async (req, res) => {
  try {
    const tracks = await Track.findAll();
    res.json(tracks);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching tracks' });
  }
});

/**
 * GET /api/tracks/:id
 */
app.get('/api/tracks/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const track = await Track.findByPk(id);
    if (!track) return res.status(404).json({ error: `Track ${id} not found` });
    res.json(track);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching track' });
  }
});

/**
 * POST /api/tracks
 */
app.post('/api/tracks', async (req, res) => {
  const { songTitle, artistName, albumName, genre, duration, releaseYear } = req.body;

  const missing = [];
  if (!songTitle) missing.push("songTitle");
  if (!artistName) missing.push("artistName");
  if (!albumName) missing.push("albumName");
  if (!genre) missing.push("genre");

  if (missing.length > 0) {
    return res.status(400).json({
      error: "Missing required fields",
      missing,
    });
  }

  try {
    const newTrack = await Track.create({
      songTitle, artistName, albumName, genre,
      duration: duration ?? null,
      releaseYear: releaseYear ?? null,
    });
    res.status(201).json(newTrack);
  } catch (err) {
    res.status(500).json({ error: "Error creating track" });
  }
});

/**
 * PUT /api/tracks/:id
 */
app.put('/api/tracks/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);

  try {
    const track = await Track.findByPk(id);
    if (!track) return res.status(404).json({ error: `Track ${id} not found` });

    await track.update(req.body);
    res.json(track);
  } catch (err) {
    res.status(500).json({ error: "Error updating track" });
  }
});

/**
 * DELETE /api/tracks/:id
 */
app.delete('/api/tracks/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);

  try {
    const track = await Track.findByPk(id);
    if (!track) return res.status(404).json({ error: `Track ${id} not found` });

    await track.destroy();
    res.json({ message: `Track ${id} deleted` });
  } catch (err) {
    res.status(500).json({ error: "Error deleting track" });
  }
});

async function startServer() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
}

startServer();
