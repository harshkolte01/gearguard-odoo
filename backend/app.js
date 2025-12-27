const express = require('express');

const app = express();

// Middleware
app.use(express.json());

// Home endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to GearGuard API' });
});

module.exports = app;

