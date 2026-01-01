// 俄罗斯方块游戏 - 核心逻辑
// ==================================================

// 游戏常量
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const PREVIEW_SIZE = 4;

// 方块类型
const TETROMINO_TYPES = {
    I: 'I',
    O: 'O',
    T: 'T',
    S: 'S',
    Z: 'Z',
    J: 'J',
    L: 'L'
};

// 方块颜色
const TETROMINO_COLORS = {
    [TETROMINO_TYPES.I]: '#00f5ff', // 青色
    [TETROMINO_TYPES.O]: '#ffff00', // 黄色
    [TETROMINO_TYPES.T]: '#800080', // 紫色
    [TETROMINO_TYPES.S]: '#00ff00', // 绿色
    [TETROMINO_TYPES.Z]: '#ff0000', // 红色
    [TETROMINO_TYPES.J]: '#0000ff', // 蓝色
    [TETROMINO_TYPES.L]: '#ffa500'  // 橙色
};

// 方块形状定义（4个旋转状态）
const TETROMINO_SHAPES = {
    [TETROMINO_TYPES.I]: [
        [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
        [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]],
        [[0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0]],
        [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]]
    ],
    [TETROMINO_TYPES.O]: [
        [[0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
        [[0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
        [[0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
        [[0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
    ],
    [TETROMINO_TYPES.T]: [
        [[0, 1, 0, 0], [1, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
        [[0, 1, 0, 0], [0, 1, 1, 0], [0, 1, 0, 0], [0, 0, 0, 0]],
        [[0, 0, 0, 0], [1, 1, 1, 0], [0, 1, 0, 0], [0, 0, 0, 0]],
        [[0, 1, 0, 0], [1, 1, 0, 0], [0, 1, 0, 0], [0, 0, 0, 0]]
    ],
    [TETROMINO_TYPES.S]: [
        [[0, 1, 1, 0], [1, 1, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
        [[0, 1, 0, 0], [0, 1, 1, 0], [0, 0, 1, 0], [0, 0, 0, 0]],
        [[0, 0, 0, 0], [0, 1, 1, 0], [1, 1, 0, 0], [0, 0, 0, 0]],
        [[1, 0, 0, 0], [1, 1, 0, 0], [0, 1, 0, 0], [0, 0, 0, 0]]
    ],
    [TETROMINO_TYPES.Z]: [
        [[1, 1, 0, 0], [0, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
        [[0, 0, 1, 0], [0, 1, 1, 0], [0, 1, 0, 0], [0, 0, 0, 0]],
        [[0, 0, 0, 0], [1, 1, 0, 0], [0, 1, 1, 0], [0, 0, 0, 0]],
        [[0, 1, 0, 0], [1, 1, 0, 0], [1, 0, 0, 0], [0, 0, 0, 0]]
    ],
    [TETROMINO_TYPES.J]: [
        [[1, 0, 0, 0], [1, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
        [[0, 1, 1, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 0, 0, 0]],
        [[0, 0, 0, 0], [1, 1, 1, 0], [0, 0, 1, 0], [0, 0, 0, 0]],
        [[0, 1, 0, 0], [0, 1, 0, 0], [1, 1, 0, 0], [0, 0, 0, 0]]
    ],
    [TETROMINO_TYPES.L]: [
        [[0, 0, 1, 0], [1, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
        [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 1, 0], [0, 0, 0, 0]],
        [[0, 0, 0, 0], [1, 1, 1, 0], [1, 0, 0, 0], [0, 0, 0, 0]],
        [[1, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 0, 0, 0]]
    ]
};

// 分数系统
const SCORE_VALUES = {
    SINGLE: 40,
    DOUBLE: 100,
    TRIPLE: 300,
    TETRIS: 1200
};

// 等级速度表 (毫秒)
const LEVEL_SPEEDS = [
    800, 720, 630, 550, 470, 380, 300, 220, 130, 100,
    80, 80, 80, 70, 70, 70, 50, 50, 50, 30
];

// 游戏状态
let gameState = {
    board: [], // 10x20游戏板，0表示空，字符串表示方块颜色
    currentPiece: null, // 当前下落的方块 {type, rotation, x, y, color}
    nextPiece: null, // 下一个方块
    score: 0,
    level: 1,
    lines: 0,
    pieces: 0,
    gameOver: false,
    paused: false,
    dropTime: 0,
    dropInterval: LEVEL_SPEEDS[0],
    startTime: 0,
    gameTime: 0
};

// 初始化游戏板
function initBoard() {
    // 创建10x20的游戏板，所有位置初始为空（0）
    gameState.board = Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0));

    // 重置游戏状态
    gameState.currentPiece = null;
    gameState.nextPiece = null;
    gameState.score = 0;
    gameState.level = 1;
    gameState.lines = 0;
    gameState.pieces = 0;
    gameState.gameOver = false;
    gameState.paused = false;
    gameState.dropTime = 0;
    gameState.dropInterval = LEVEL_SPEEDS[0];
    gameState.startTime = Date.now();
    gameState.gameTime = 0;

    // 生成第一个方块
    generateNewPiece();
    generateNextPiece();
}


// ==================================================
// 方块操作函数
// ==================================================

// 获取所有方块类型
function getAllPieceTypes() {
    return Object.values(TETROMINO_TYPES);
}

// ==================================================
// 方块操作函数
// ==================================================

// 获取所有方块类型
function getAllPieceTypes() {
    return Object.values(TETROMINO_TYPES);
}

// 随机生成方块类型
function getRandomPieceType() {
    const types = getAllPieceTypes();
    return types[Math.floor(Math.random() * types.length)];
}

// 生成新方块
function generateNewPiece() {
    if (gameState.nextPiece) {
        gameState.currentPiece = gameState.nextPiece;
    } else {
        const type = getRandomPieceType();
        gameState.currentPiece = {
            type: type,
            rotation: 0,
            x: Math.floor(BOARD_WIDTH / 2) - 2, // 居中放置
            y: 0,
            color: TETROMINO_COLORS[type]
        };
    }
}

// 生成下一个方块
function generateNextPiece() {
    const type = getRandomPieceType();
    gameState.nextPiece = {
        type: type,
        rotation: 0,
        x: 0,
        y: 0,
        color: TETROMINO_COLORS[type]
    };
}

// 获取当前方块的形状
function getCurrentPieceShape() {
    if (!gameState.currentPiece) return null;
    return TETROMINO_SHAPES[gameState.currentPiece.type][gameState.currentPiece.rotation];
}

// 获取指定方块的形状
function getPieceShape(piece) {
    return TETROMINO_SHAPES[piece.type][piece.rotation];
}

// 旋转方块
function rotatePiece(piece, direction = 1) {
    const newPiece = { ...piece };
    newPiece.rotation = (newPiece.rotation + direction + 4) % 4;
    return newPiece;
}

// 检查方块是否可以放置在指定位置
function isValidPosition(piece, board = gameState.board) {
    const shape = getPieceShape(piece);

    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            if (shape[y][x]) {
                const newX = piece.x + x;
                const newY = piece.y + y;

                // 检查边界
                if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
                    return false;
                }

                // 检查是否与已有方块重叠（只检查在游戏板内的位置）
                if (newY >= 0 && board[newY][newX] !== 0) {
                    return false;
                }
            }
        }
    }

    return true;
}

// 将当前方块放置到游戏板上
function placePiece() {
    if (!gameState.currentPiece) return;

    const shape = getCurrentPieceShape();

    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            if (shape[y][x]) {
                const boardX = gameState.currentPiece.x + x;
                const boardY = gameState.currentPiece.y + y;

                if (boardY >= 0) {
                    gameState.board[boardY][boardX] = gameState.currentPiece.color;
                }
            }
        }
    }

    gameState.pieces++;
}

// 移动方块
function movePiece(dx, dy) {
    if (!gameState.currentPiece) return false;

    const newPiece = {
        ...gameState.currentPiece,
        x: gameState.currentPiece.x + dx,
        y: gameState.currentPiece.y + dy
    };

    if (isValidPosition(newPiece)) {
        gameState.currentPiece = newPiece;
            return true;
    }

    return false;
}

// 旋转当前方块
function rotateCurrentPiece() {
    if (!gameState.currentPiece) return false;

    const rotatedPiece = rotatePiece(gameState.currentPiece);

    // 尝试直接旋转
    if (isValidPosition(rotatedPiece)) {
        gameState.currentPiece = rotatedPiece;
        return true;
    }

    // 尝试墙踢（Wall Kick）- 向左或向右移动一格后旋转
    const wallKickOffsets = [-1, 1, -2, 2];

    for (const offset of wallKickOffsets) {
        const kickedPiece = {
            ...rotatedPiece,
            x: rotatedPiece.x + offset
        };

        if (isValidPosition(kickedPiece)) {
            gameState.currentPiece = kickedPiece;
    return true;
}
    }

    return false;
}

// 硬降（直接到底）
function hardDrop() {
    if (!gameState.currentPiece) return 0;

    let dropDistance = 0;
    while (movePiece(0, 1)) {
        dropDistance++;
    }


    return dropDistance;
}

// 检查并消除完整的行
function clearLines() {
    let linesCleared = 0;
    const newBoard = [];

    // 从底部开始检查每一行
    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
        const isLineFull = gameState.board[y].every(cell => cell !== 0);

        if (!isLineFull) {
            newBoard.unshift(gameState.board[y]);
                } else {
            linesCleared++;
        }
    }

    // 在顶部添加空行
    while (newBoard.length < BOARD_HEIGHT) {
        newBoard.unshift(Array(BOARD_WIDTH).fill(0));
    }

    gameState.board = newBoard;

    if (linesCleared > 0) {
        // 计算分数
        let scoreBonus = 0;
        switch (linesCleared) {
            case 1:
                scoreBonus = SCORE_VALUES.SINGLE;
                break;
            case 2:
                scoreBonus = SCORE_VALUES.DOUBLE;
                break;
            case 3:
                scoreBonus = SCORE_VALUES.TRIPLE;
                break;
            case 4:
                scoreBonus = SCORE_VALUES.TETRIS;
                break;
        }

        gameState.score += scoreBonus * gameState.level;
        gameState.lines += linesCleared;

        // 升级逻辑
        gameState.level = Math.floor(gameState.lines / 10) + 1;
        gameState.dropInterval = LEVEL_SPEEDS[Math.min(gameState.level - 1, LEVEL_SPEEDS.length - 1)];
    }

    return linesCleared;
}

// 检查游戏是否结束
function checkGameOver() {
    // 检查顶部是否有方块
    for (let x = 0; x < BOARD_WIDTH; x++) {
        if (gameState.board[0][x] !== 0) {
            gameState.gameOver = true;
            return true;
        }
    }
    return false;
}

// 游戏循环
function gameLoop(currentTime = 0) {
    if (gameState.gameOver || gameState.paused) return;

    const deltaTime = currentTime - gameState.dropTime;

    if (deltaTime > gameState.dropInterval) {
        // 方块下落
        if (!movePiece(0, 1)) {
            // 无法继续下落，放置方块
            placePiece();
            clearLines();

            if (checkGameOver()) {
                showGameOver();
                return;
            }

            // 生成新方块
            generateNewPiece();
            generateNextPiece();
        }

        gameState.dropTime = currentTime;
    }

    // 更新游戏时间
    gameState.gameTime = Math.floor((Date.now() - gameState.startTime) / 1000);

    renderBoard();
    requestAnimationFrame(gameLoop);
}

// 暂停/继续游戏
function togglePause() {
    gameState.paused = !gameState.paused;

    if (gameState.paused) {
        showPause();
            } else {
        hidePause();
        gameLoop();
    }
}

// ==================================================
// UI交互
// ==================================================

// 渲染游戏板
function renderBoard() {
    const tetrisBoard = document.getElementById('tetrisBoard');
    if (!tetrisBoard) return;

    // 清空游戏板
    tetrisBoard.innerHTML = '';

    // 渲染游戏板网格
    for (let y = 0; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
            const cell = document.createElement('div');
            cell.className = 'board-cell';

            // 设置已放置的方块颜色
            if (gameState.board[y][x] !== 0) {
                cell.style.backgroundColor = gameState.board[y][x];
                cell.classList.add('filled');
            }

            tetrisBoard.appendChild(cell);
        }
    }

    // 渲染当前下落的方块
    if (gameState.currentPiece) {
        const shape = getCurrentPieceShape();

        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                if (shape[y][x]) {
                    const boardX = gameState.currentPiece.x + x;
                    const boardY = gameState.currentPiece.y + y;

                    // 只渲染在游戏板内的部分
                    if (boardX >= 0 && boardX < BOARD_WIDTH && boardY >= 0 && boardY < BOARD_HEIGHT) {
                        const cellIndex = boardY * BOARD_WIDTH + boardX;
                        const cell = tetrisBoard.children[cellIndex];

                        if (cell) {
                            cell.style.backgroundColor = gameState.currentPiece.color;
                            cell.classList.add('current-piece');
                        }
                    }
                }
            }
        }
    }

    // 更新UI显示
    updateUI();

    // 渲染下一个方块预览
    renderNextPiece();
}

// 渲染下一个方块预览
function renderNextPiece() {
    const nextPiecePreview = document.getElementById('nextPiecePreview');
    if (!nextPiecePreview || !gameState.nextPiece) return;

    nextPiecePreview.innerHTML = '';

    const shape = getPieceShape(gameState.nextPiece);

    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            const cell = document.createElement('div');
            cell.className = 'preview-cell';

            if (shape[y][x]) {
                cell.style.backgroundColor = gameState.nextPiece.color;
                cell.classList.add('filled');
            }

            nextPiecePreview.appendChild(cell);
        }
    }
}

// 选择棋子


// 更新UI显示
function updateUI() {
    updateScore();
    updateStats();
}

// 更新分数显示
function updateScore() {
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
        scoreElement.textContent = gameState.score.toLocaleString();
    }
}

// 更新统计信息
function updateStats() {
    const levelElement = document.getElementById('level');
    const linesElement = document.getElementById('lines');
    const piecesElement = document.getElementById('pieces');
    const timeElement = document.getElementById('time');

    if (levelElement) levelElement.textContent = gameState.level;
    if (linesElement) linesElement.textContent = gameState.lines;
    if (piecesElement) piecesElement.textContent = gameState.pieces;

    if (timeElement) {
        const minutes = Math.floor(gameState.gameTime / 60);
        const seconds = gameState.gameTime % 60;
        timeElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}


// 显示游戏结束
function showGameOver() {
    const gameOverOverlay = document.getElementById('gameOverOverlay');
    const finalScore = document.getElementById('finalScore');
    const finalLevel = document.getElementById('finalLevel');
    const finalLines = document.getElementById('finalLines');
    const finalTime = document.getElementById('finalTime');

    if (finalScore) finalScore.textContent = gameState.score.toLocaleString();
    if (finalLevel) finalLevel.textContent = gameState.level;
    if (finalLines) finalLines.textContent = gameState.lines;

    const minutes = Math.floor(gameState.gameTime / 60);
    const seconds = gameState.gameTime % 60;
    if (finalTime) finalTime.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    if (gameOverOverlay) {
        gameOverOverlay.classList.add('show');
    }
}

// 显示暂停
function showPause() {
    const pauseOverlay = document.getElementById('pauseOverlay');
    if (pauseOverlay) {
        pauseOverlay.classList.add('show');
    }
}

// 隐藏暂停
function hidePause() {
    const pauseOverlay = document.getElementById('pauseOverlay');
    if (pauseOverlay) {
        pauseOverlay.classList.remove('show');
    }
}

// 新游戏
function newGame() {
    initBoard();
    renderBoard();

    // 隐藏所有弹窗
    document.getElementById('gameOverOverlay').classList.remove('show');
    document.getElementById('pauseOverlay').classList.remove('show');

    // 开始游戏循环
    gameState.startTime = Date.now();
    requestAnimationFrame(gameLoop);
}


// 键盘控制
document.addEventListener('keydown', (e) => {
    if (gameState.gameOver) return;

    switch (e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            movePiece(-1, 0);
    renderBoard();
            break;
        case 'ArrowRight':
            e.preventDefault();
            movePiece(1, 0);
            renderBoard();
            break;
        case 'ArrowDown':
            e.preventDefault();
            movePiece(0, 1);
            renderBoard();
            break;
        case 'ArrowUp':
        case 'z':
        case 'Z':
            e.preventDefault();
            rotateCurrentPiece();
            renderBoard();
            break;
        case ' ': // 空格键 - 硬降
            e.preventDefault();
            hardDrop();
            renderBoard();
            break;
        case 'p':
        case 'P':
            e.preventDefault();
            togglePause();
            break;
    }
});

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initBoard();
    renderBoard();

    // 绑定按钮事件
    document.getElementById('newGameBtn')?.addEventListener('click', newGame);
    document.getElementById('pauseBtn')?.addEventListener('click', togglePause);
    document.getElementById('restartBtn')?.addEventListener('click', newGame);
    document.getElementById('resumeBtn')?.addEventListener('click', () => {
        togglePause();
    });

    // 开始游戏循环
    requestAnimationFrame(gameLoop);
});
