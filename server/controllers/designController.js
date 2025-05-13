const { saveDesignFile, getDesignFile } = require('../services/fileService');
const { registerNFT, getDesignDetails, listDesignForSale, executeTransaction } = require('../services/blockchainService'); //  Added executeTransaction

/**
 * Registers a new design and creates an NFT on Polygon
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.registerDesign = async (req, res) => {
  try {
    const { name, description, creatorName } = req.body;
    const file = req.file; // From multer middleware

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!name || !description || !creatorName) {
      return res.status(400).json({ error: 'Missing required metadata' });
    }

    // Save file to storage
    const fileInfo = await saveDesignFile(file);

    // Prepare the transaction data for the frontend
    const txData = await registerNFT(fileInfo.relativePath, {
      name,
      description,
      creatorName,
    });

    // Return the transaction data to the client
    res.status(200).json({
      success: true,
      txData, //  Send transaction data instead of transactionHash/tokenId
      fileUrl: fileInfo.relativePath,
    });
  } catch (err) {
    console.error('Error registering design:', err);
    res.status(500).json({ error: 'Failed to register design', message: err.message });
  }
};

/**
 * Gets details of a design by its token ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getDesign = async (req, res) => {
  try {
    const { tokenId } = req.params;

    // Get design details from blockchain
    const designDetails = await getDesignDetails(tokenId);

    res.status(200).json(designDetails);
  } catch (err) {
    console.error('Error getting design:', err);
    res.status(500).json({ error: 'Failed to get design details', message: err.message });
  }
};

/**
 * Lists a design for sale
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.listDesignForSale = async (req, res) => {
  try {
    const { tokenId } = req.params;
    const { price } = req.body;

    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      return res.status(400).json({ error: 'Invalid price' });
    }

    // Prepare the transaction data for the frontend
    const txData = await listDesignForSale(tokenId, parseFloat(price));

    res.status(200).json({
      success: true,
      tokenId,
      price,
      txData, //  Send transaction data
    });
  } catch (err) {
    console.error('Error listing design for sale:', err);
    res.status(500).json({ error: 'Failed to list design for sale', message: err.message });
  }
};
