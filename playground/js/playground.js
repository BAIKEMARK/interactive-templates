/**
 * playground.js - 操场逻辑
 * 用于演示特效、弹窗等
 */

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let snowEffect = null;

// 背景色配置
let currentBgColor = '#f3f4f6';

document.addEventListener('DOMContentLoaded', () => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 初始化背景
    drawBackground(currentBgColor);

    // 初始化 SnowEffect (from snow-effect.js)
    // 传入 false 不自动开始
    if (typeof SnowEffect !== 'undefined') {
        snowEffect = new SnowEffect(false);
    }
});

function resizeCanvas() {
    const parent = canvas.parentElement;
    if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        drawBackground(currentBgColor);
    }
}

function changeBgColor(color) {
    currentBgColor = color;
    drawBackground(color);
}

function drawBackground(color) {
    // 简单填充背景色
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// ---- Global Playground Functions ----

// 切换下雪通过调用 SnowEffect 实例的 start/stop
window.toggleSnow = function (enable) {
    if (!snowEffect) return;
    if (enable) {
        snowEffect.start();
    } else {
        snowEffect.stop();
        // 停止特效后，可能需要重绘一下背景以清除残留粒子(虽然 SnowEffect 自身 hidden 了 canvas, 但如果是画在同一个canvas上则需要)
        // 这里的 SnowEffect 是独立的 overlay canvas，所以 hide 足够了。
        // 但如果我们的 playground 逻辑里有其他 canvas 内容，不受影响。
    }
}

// 切换背景颜色
window.changeBgColor = changeBgColor;

// 显示弹窗
window.showOverlay = function (id) {
    hideAllOverlays();
    const el = document.getElementById(id);
    if (el) el.classList.remove('hidden');
}

// 隐藏所有弹窗
window.hideAllOverlays = function () {
    ['inactiveOverlay', 'pauseOverlay', 'historyOverlay'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });
}
