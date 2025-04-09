const fs = require('fs');
const path = require('path');

function generateGamesConfig() {
    try {
        // 1. 扫描games目录
        const gamesDir = path.join(__dirname, '../games');
        const imagesDir = path.join(__dirname, '../images/games');
        
        if (!fs.existsSync(gamesDir)) {
            console.error('Games directory not found!');
            return;
        }

        const gameFiles = fs.readdirSync(gamesDir)
            .filter(file => file.endsWith('.html'))
            .filter(file => file !== 'game-template.html'); // 排除模板文件

        // 2. 生成配置
        const gamesConfig = {};
        gameFiles.forEach((file) => {
            try {
                const gameId = file.replace('.html', '');
                const filePath = path.join(gamesDir, file);
                const content = fs.readFileSync(filePath, 'utf-8');

                // 检查缩略图是否存在
                const thumbnailPath = path.join(imagesDir, `${gameId}.jpg`);
                const thumbnailExists = fs.existsSync(thumbnailPath);

                // 创建游戏配置
                gamesConfig[gameId] = {
                    title: extractTitle(content) || gameId,
                    description: extractDescription(content) || `Play ${gameId} online`,
                    iframeUrl: extractIframeUrl(content) || '#',
                    thumbnail: thumbnailExists ? `/images/games/${gameId}.jpg` : '/images/games/default-thumbnail.jpg'
                };

                console.log(`Successfully processed ${gameId}`);
                if (!thumbnailExists) {
                    console.warn(`Warning: Thumbnail not found for ${gameId}, using default thumbnail`);
                }

            } catch (err) {
                console.error(`Error processing ${file}:`, err.message);
            }
        });

        // 3. 生成配置文件
        const configContent = `const GAMES = ${JSON.stringify(gamesConfig, null, 2)};`;
        const configPath = path.join(__dirname, 'games-config.js');
        
        fs.writeFileSync(configPath, configContent);
        console.log('Successfully generated games-config.js');
        console.log('Games found:', Object.keys(gamesConfig).join(', '));

    } catch (err) {
        console.error('Fatal error:', err.message);
    }
}

// 提取信息的辅助函数
function extractTitle(content) {
    try {
        const match = content.match(/<title>(.*?)<\/title>/);
        return match ? match[1].replace(' - Online Games', '').trim() : '';
    } catch {
        return '';
    }
}

function extractDescription(content) {
    try {
        const match = content.match(/<meta name="description" content="(.*?)">/);
        return match ? match[1].trim() : '';
    } catch {
        return '';
    }
}

function extractIframeUrl(content) {
    try {
        const match = content.match(/<iframe.*?src="(.*?)"/);
        return match ? match[1].trim() : '';
    } catch {
        return '';
    }
}

// 运行生成器
generateGamesConfig(); 