// database/setup.js
require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const storagePath = process.env.DB_STORAGE || path.join(__dirname, 'music_library.db');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: storagePath,
  logging: false, // set true if you want SQL printed to console
});

// Define Track model
const Track = sequelize.define('Track', {
  trackId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  songTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  artistName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  albumName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  genre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  duration: {
    // duration in seconds
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  releaseYear: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'tracks',
  timestamps: false, // no createdAt/updatedAt columns unless you want them
});

// Function to create DB and tables (used by the CLI step)
async function createDatabaseAndTables() {
  try {
    await sequelize.authenticate();
    console.log('Connection established.');
    await sequelize.sync({ force: false }); // force: true will drop tables first
    console.log('All models were synchronized successfully.');
  } catch (err) {
    console.error('Unable to create DB/tables:', err);
  } finally {
    // Don't close here if used by server — but for manual setup script we WILL close
    await sequelize.close();
  }
}

// If this file is run directly (node database/setup.js), create DB/tables and exit
if (require.main === module) {
  (async () => {
    await createDatabaseAndTables();
  })();
}

module.exports = { sequelize, Track, createDatabaseAndTables };
