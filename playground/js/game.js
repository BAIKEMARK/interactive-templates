/**
 * game.js - 游戏逻辑脚手架
 * 包含游戏循环、Canvas 绘制、输入处理等基础结构。
 */

// 画布与上下文
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 游戏状态
let isPlaying = false;
let isPaused = false;
let lastTime = 0;

// 示例游戏对象
const player = {
    x: 100,
    y: 300,
    width: 50,
    height: 50,
    color: '#FF6B6B'
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initGame();
});

/**
 * 游戏初始化
 */
function initGame() {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 绑定输入事件
    bindInputEvents();

    // 绑定界面按钮
    const inactiveOverlay = document.getElementById('inactiveOverlay');
    if (inactiveOverlay) {
        inactiveOverlay.addEventListener('click', startGame);
    }

    const pauseBtn = document.getElementById('visualPauseBtn');
    if (pauseBtn) {
        pauseBtn.addEventListener('click', togglePause);
    }

    // 初始绘制
    draw();
}

/**
 * 调整 Canvas 尺寸
 */
function resizeCanvas() {
    const parent = canvas.parentElement;
    if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
    }
    // 重绘一帧确保不白屏
    draw();
}

/**
 * 开始游戏
 */
function startGame() {
    if (isPlaying) return;

    document.getElementById('inactiveOverlay').classList.add('hidden');
    isPlaying = true;
    isPaused = false;
    lastTime = performance.now();

    requestAnimationFrame(gameLoop);
}

/**
 * 切换暂停
 */
function togglePause(e) {
    if (e) e.stopPropagation(); // 防止点击冒泡
    if (!isPlaying) return;

    isPaused = !isPaused;
    const pauseOverlay = document.getElementById('pauseOverlay');

    if (isPaused) {
        pauseOverlay.classList.remove('hidden');
    } else {
        pauseOverlay.classList.add('hidden');
        lastTime = performance.now();
        requestAnimationFrame(gameLoop);
    }
}

// 暴露全局暂停方法供外部调用
window.pauseGame = function () {
    if (isPlaying && !isPaused) {
        togglePause();
    }
};

/**
 * 主循环
 */
function gameLoop(timestamp) {
    if (!isPlaying || isPaused) return;

    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    update(deltaTime);
    draw();

    requestAnimationFrame(gameLoop);
}

/**
 * 更新逻辑 (物理、位置等)
 */
function update(deltaTime) {
    // TODO: 在这里写你的游戏逻辑
    // player.x += 0.1 * deltaTime;
}

/**
 * 绘制逻辑
 */
function draw() {
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制简单的背景
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制玩家 (示例)
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

/**
 * 绑定输入
 */
function bindInputEvents() {
    // 键盘
    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            if (!isPlaying) startGame();
            else if (isPaused) togglePause();
            // else: 游戏逻辑 Jumping...
        }
    });

    // 鼠标/触摸 (示例)
    canvas.addEventListener('mousedown', () => {
        // Handle input
    });
}
