document.addEventListener('DOMContentLoaded', function() {
    // Game frame responsive handling
    const gameFrame = document.querySelector('.game-frame');
    if (gameFrame) {
        function adjustGameFrame() {
            const width = gameFrame.offsetWidth;
            const aspectRatio = 16/9;
            gameFrame.style.height = `${width / aspectRatio}px`;
        }

        // Initialize and handle resize
        adjustGameFrame();
        window.addEventListener('resize', adjustGameFrame);
    }
}); 