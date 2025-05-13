// server/routes/designRoutes.js - Simplified version
const express = require('express');
const multer = require('multer');
const { registerDesign, getDesign, listDesignForSale } = require('../controllers/designController');
const router = express.Router();

// Configure multer for file uploads
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Routes
router.post('/register', upload.single('designFile'), registerDesign);
router.get('/:tokenId', getDesign);
router.post('/:tokenId/list', listDesignForSale);

module.exports = router;
