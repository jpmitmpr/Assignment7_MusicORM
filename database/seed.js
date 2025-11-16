// database/seed.js
require('dotenv').config();
const { sequelize, Track } = require('./setup');

const sampleTracks = [
  {
    songTitle: 'Blue Skies',
    artistName: 'Alicia Rose',
    albumName: 'Morning Light',
    genre: 'Pop',
    duration: 215,
    releaseYear: 2019,
  },
  {
    songTitle: 'Midnight Drive',
    artistName: 'The Highwaymen',
    albumName: 'Open Road',
    genre: 'Rock',
    duration: 248,
    releaseYear: 2017,
  },
  {
    songTitle: 'Ocean Whisper',
    artistName: 'Luna Sea',
    albumName: 'Tides',
    genre: 'Ambient',
    duration: 190,
    releaseYear: 2021,
  },
];

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Connection OK. Seeding sample tracks...');
    // bulkCreate will insert multiple rows. { validate: true } runs model validation.
    await Track.bulkCreate(sampleTracks, { validate: true });
    console.log('Seeding complete.');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await sequelize.close();
  }
}

if (require.main === module) {
  seed();
}

module.exports = { seed };
