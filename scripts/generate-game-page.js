const fs = require('fs');
const path = require('path');

// Import games configuration
const GAMES = require('./games-config.js').GAMES;

class GamePageGenerator {
    static generateGamePage(gameId) {
        const game = GAMES[gameId];
        if (!game) {
            throw new Error(`Game ${gameId} not found in configuration`);
        }

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${game.title} | Online Games</title>
    <meta name="description" content="${game.description}">
    <link rel="stylesheet" href="/styles/main.css">
</head>
<body>
    <header>
        <div class="container">
            <h1>${game.title}</h1>
            <p>${game.description}</p>
        </div>
    </header>

    <main>
        <!-- Game Container -->
        <div class="game-container">
            <iframe 
                src="${game.iframeUrl}"
                class="game-frame"
                frameborder="0"
                allowfullscreen
                title="${game.title}">
            </iframe>
        </div>

        <!-- Game Information -->
        <section class="section">
            <h2>How to Play</h2>
            <div class="how-to-play">
                ${game.howToPlay || 'Instructions coming soon...'}
            </div>
        </section>

        <!-- FAQ Section -->
        <section class="section">
            <div class="faq">
                <div class="faq-header">
                    <h2>Frequently Asked Questions</h2>
                </div>
                ${this.generateFAQSection(game.faqs)}
            </div>
        </section>

        <!-- Other Games Section -->
        <section class="other-games-section">
            <h2 class="section-title">Play Other Games</h2>
            <div class="game-icons" id="otherGames">
                <!-- Other games will be populated by JavaScript -->
            </div>
        </section>
    </main>

    <footer>
        <p>© 2024 Online Games. All rights reserved.</p>
    </footer>

    <script src="/scripts/games-config.js"></script>
    <script src="/scripts/main.js"></script>
    <script src="/scripts/game-recommendations.js"></script>
</body>
</html>`;
    }

    static generateFAQSection(faqs) {
        if (!faqs || !Array.isArray(faqs) || faqs.length === 0) {
            return '<p>No FAQs available yet.</p>';
        }

        return faqs.map(faq => `
            <div class="faq-item">
                <h3>${faq.question}</h3>
                <p>${faq.answer}</p>
            </div>
        `).join('\n');
    }
}

function generateGamePage(gameId) {
    // Ensure games directory exists
    const gamesDir = path.join(__dirname, '../games');
    if (!fs.existsSync(gamesDir)) {
        fs.mkdirSync(gamesDir);
    }

    // Generate game page
    const htmlContent = GamePageGenerator.generateGamePage(gameId);
    const filePath = path.join(gamesDir, `${gameId}.html`);
    
    fs.writeFileSync(filePath, htmlContent);
    console.log(`Generated game page: ${filePath}`);
}

module.exports = { generateGamePage };

// Usage example:
// node generate-game-page.js snake-io
const gameId = process.argv[2];
if (gameId) {
    generateGamePage(gameId);
} else {
    console.log('Please provide a game ID');
} 