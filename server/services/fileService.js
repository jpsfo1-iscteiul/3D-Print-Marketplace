// server/services/fileService.js (simplified)
const path = require('path');
const fs = require('fs');

// Base storage directory
const STORAGE_DIR = path.join(__dirname, '../../storage');

// Ensure storage directory exists
if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR, { recursive: true });
}

/**
 * Saves a design file to the storage location
 * @param {Object} file - The uploaded file object from multer
 * @returns {Object} - Information about the stored file
 */
exports.saveDesignFile = (file) => {
  try {
    // Generate a unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}_${file.originalname}`;
    const targetPath = path.join(STORAGE_DIR, filename);
    
    // Move the file from temporary upload location to permanent storage
    fs.renameSync(file.path, targetPath);
    
    return {
      originalName: file.originalname,
      filename,
      path: targetPath,
      relativePath: `/storage/${filename}`,
      size: file.size
    };
  } catch (error) {
    console.error('Error saving file:', error);
    throw new Error('Failed to save design file');
  }
};

/**
 * Retrieves a design file by its filename
 * @param {string} filename - The name of the file to retrieve
 * @returns {Object} - Information about the file
 */
exports.getDesignFile = (filename) => {
  const filePath = path.join(STORAGE_DIR, filename);
  
  if (!fs.existsSync(filePath)) {
    throw new Error('File not found');
  }
  
  const stats = fs.statSync(filePath);
  
  return {
    filename,
    path: filePath,
    relativePath: `/storage/${filename}`,
    size: stats.size
  };
};
