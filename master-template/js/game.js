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

    // 绑定暂停遮罩点击恢复事件
    const pauseOverlay = document.getElementById('pauseOverlay');
    if (pauseOverlay) {
        const resumeGame = (e) => {
            e.stopPropagation();
            togglePause();
        };
        pauseOverlay.addEventListener('click', resumeGame);
        pauseOverlay.addEventListener('touchstart', (e) => {
            if (e.cancelable) e.preventDefault();
            resumeGame(e);
        }, { passive: false });
    }

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

    // --- History UI Logic ---
    const recordBtn = document.getElementById('recordBtn');
    const historyOverlay = document.getElementById('historyOverlay');
    const historyCloseBtn = document.getElementById('historyCloseBtn');
    const historyList = document.getElementById('historyList');

    if (recordBtn && historyOverlay && historyCloseBtn && historyList) {
        // 模拟本地存储 Key
        const STORAGE_KEY = 'master_template_history';

        function updateHistoryList() {
            try {
                const history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
                historyList.innerHTML = '';

                if (history.length === 0) {
                    historyList.innerHTML = '<div class="history-item" style="justify-content:center; color:#9ca3af;">暂无记录</div>';
                    return;
                }

                history.forEach((item, index) => {
                    const div = document.createElement('div');
                    div.className = `history-item ${item.isRecord ? 'is-record' : ''}`;
                    div.innerHTML = `
                        <span class="history-rank">${index + 1}</span>
                        <span class="history-date">${item.date || '--/--'}</span>
                        <span class="history-score">${item.score || 0}</span>
                    `;
                    historyList.appendChild(div);
                });
            } catch (e) {
                console.error(e);
            }
        }

        recordBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!isPaused && isPlaying) togglePause(); // Auto pause if playing
            updateHistoryList();
            historyOverlay.classList.remove('hidden');
        });

        const closeHistory = (e) => {
            if (e) e.stopPropagation();
            historyOverlay.classList.add('hidden');
        };

        historyCloseBtn.addEventListener('click', closeHistory);

        // Click outside to close can conflict with game reset, so we verify target
        historyOverlay.addEventListener('click', (e) => {
            if (e.target === historyOverlay) {
                e.stopPropagation();
                closeHistory();
            }
        });

        // Touch handling
        recordBtn.addEventListener('touchstart', (e) => {
            e.stopPropagation(); // prevent game input
        }, { passive: false });

        historyOverlay.addEventListener('touchstart', (e) => {
            e.stopPropagation();
        }, { passive: false });
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

    // ... (Existing input binding code) ...

    // 鼠标/触摸 (示例)
    canvas.addEventListener('mousedown', () => {
        // Handle input
    });
}

/**
 * =========================================
 * 🎮 游戏开发接口 (Game UI API)
 * 供 AI 或开发者直接调用以更新界面
 * =========================================
 */
window.GameUI = {
    /**
     * 更新游戏内分数显示
     * @param {number|string} value - 分数值
     */
    updateScore: (value) => {
        const el = document.getElementById('scoreDisplay');
        if (el) el.innerText = value;
    },

    /**
     * 更新速度/副指标显示
     * @param {number|string} value - 显示内容
     */
    updateSpeed: (value) => {
        const el = document.getElementById('speedDisplay');
        if (el) el.innerText = value;
    },

    /**
     * 更新风格/状态显示
     * @param {string} text - 显示文本
     */
    updateStyle: (text) => {
        const el = document.getElementById('styleDisplay');
        if (el) el.innerText = text;
    },

    /**
     * 更新左侧面板的核心指标
     * @param {number|string} value - 数值
     * @param {string} [unit] - 单位 (可选)
     */
    updateLeftStat1: (value, unit) => {
        const valEl = document.getElementById('val-stat1');
        if (valEl) valEl.innerText = value;

        if (unit) {
            const unitEl = document.querySelector('#card-stat1 .unit');
            if (unitEl) unitEl.innerText = unit;
        }
    },

    /**
     * 更新左侧面板的当前状态
     * @param {string} text - 状态文本 (如: "运行中", "已暂停")
     */
    updateLeftStatus: (text) => {
        const el = document.getElementById('val-status');
        if (el) el.innerText = text;
    },

    /**
     * 保存游戏记录
     * @param {number} score - 分数
     */
    saveRecord: (score) => {
        try {
            const STORAGE_KEY = 'master_template_history';
            const history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

            const newRecord = {
                score: score,
                date: new Date().toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
                isRecord: false
            };

            // 简单的排序逻辑 (高分在前)
            history.push(newRecord);
            history.sort((a, b) => b.score - a.score);

            // 标记最高分
            if (history.length > 0 && history[0] === newRecord) {
                newRecord.isRecord = true;
            }

            // 只保留前10条
            const top10 = history.slice(0, 10);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(top10));

            console.log('Record saved:', newRecord);
        } catch (e) {
            console.error('Save record failed:', e);
        }
    }
};
