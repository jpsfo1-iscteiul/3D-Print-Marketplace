// server/app.js - Simplified version
const express = require('express');
const path = require('path');
const cors = require('cors');
const designRoutes = require('./routes/designRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the storage directory
app.use('/storage', express.static(path.join(__dirname, '../storage')));

// Routes
app.use('/api/designs', designRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
