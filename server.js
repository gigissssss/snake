const express = require('express');
const fs = require('fs');
const path = require('path');
const { generateGamePage } = require('./scripts/generate-game-page.js');

const app = express();

// Middleware
app.use(express.json());
app.use(express.static('.'));

// Request validation middleware
const validateGameData = (req, res, next) => {
    const { gameId, title, iframeUrl, description } = req.body;
    
    if (!gameId || !title || !iframeUrl || !description) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields: gameId, title, iframeUrl, description'
        });
    }
    
    // Validate gameId format
    if (!/^[a-z0-9-]+$/.test(gameId)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid gameId format. Use only lowercase letters, numbers, and hyphens'
        });
    }
    
    next();
};

// API endpoint to add a new game
app.post('/api/games', validateGameData, async (req, res) => {
    try {
        const gameData = req.body;
        
        // Read current games configuration
        const gamesConfigPath = path.join(__dirname, 'scripts', 'games-config.js');
        let gamesConfig = require('./scripts/games-config.js');
        
        // Check if game already exists
        if (gamesConfig.GAMES[gameData.gameId]) {
            return res.status(409).json({
                success: false,
                message: 'Game with this ID already exists'
            });
        }
        
        // Add new game to configuration
        gamesConfig.GAMES[gameData.gameId] = {
            title: gameData.title,
            iframeUrl: gameData.iframeUrl,
            description: gameData.description,
            thumbnail: gameData.thumbnail || '/images/games/default-thumbnail.jpg',
            howToPlay: gameData.howToPlay || '',
            faqs: gameData.faqs || []
        };
        
        // Save updated configuration
        const configContent = `const GAMES = ${JSON.stringify(gamesConfig.GAMES, null, 4)};\n\n// Export for Node.js\nif (typeof module !== 'undefined' && module.exports) {\n    module.exports = { GAMES };\n}`;
        fs.writeFileSync(gamesConfigPath, configContent);
        
        // Generate game page
        await generateGamePage(gameData.gameId);
        
        res.json({ success: true, message: 'Game added successfully' });
    } catch (error) {
        next(error);
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 