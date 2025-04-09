document.addEventListener('DOMContentLoaded', function() {
    const gameIcons = document.querySelector('.game-icons');
    const currentGameId = window.location.pathname.split('/').pop().replace('.html', '');
    
    // Get 4 random games excluding the current game
    const availableGames = Object.entries(GAMES).filter(([id]) => id !== currentGameId);
    const randomGames = availableGames.sort(() => 0.5 - Math.random()).slice(0, 4);
    
    // Generate game icons
    randomGames.forEach(([gameId, game]) => {
        const gameIcon = document.createElement('a');
        gameIcon.href = `/games/${gameId}.html`;
        gameIcon.className = 'game-icon';
        gameIcon.setAttribute('data-game', gameId);
        
        gameIcon.innerHTML = `
            <div class="icon-container">
                <img src="${game.thumbnail}" alt="${game.title}">
            </div>
            <div class="name">${game.title}</div>
            
        `;
        
        gameIcons.appendChild(gameIcon);
    });
}); 