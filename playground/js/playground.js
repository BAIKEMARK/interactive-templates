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
    const container = document.getElementById('gameContainer');
    if (container) container.style.backgroundColor = color;
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
function hideAllOverlays() {
    ['inactiveOverlay', 'pauseOverlay', 'historyOverlay'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });
}
window.hideAllOverlays = hideAllOverlays;

// --- Advanced Effects Logic ---

// 1. Comic Viewer Logic
window.initComicViewer = function () {
    const comicWrapper = document.getElementById('comicWrapper');
    if (!comicWrapper) return;

    const imageMask = document.getElementById('comicImageMask');
    const video = document.getElementById('comicVideo');
    const videoAlt = document.getElementById('comicVideoAlt');
    const hotspots = document.querySelectorAll('.comic-hotspot');

    if (!imageMask || !video || hotspots.length === 0) return;

    let activePanel = -1;

    // Start video when module is visible (handled by selectModule potentially, or Observer)
    // For playground, we just ensure it plays when clicked or interacted
    video.play().catch(() => { });

    hotspots.forEach((hotspot, index) => {
        // Remove existing listeners to avoid duplicates if called multiple times
        // Note: anonymous functions can't be removed easily, but for playground simple init is okay.
        // Better: check if initialized.
        hotspot.onclick = (e) => {
            e.stopPropagation();
            togglePanel(index);
        };
    });

    function togglePanel(index) {
        if (index === 1 && videoAlt) {
            videoAlt.style.opacity = '1';
            videoAlt.currentTime = 0;
            videoAlt.play().catch(() => { });
            video.pause();
        } else if (videoAlt) {
            videoAlt.style.opacity = '0';
            videoAlt.pause();
            if (video.paused) video.play().catch(() => { });
        }

        if (activePanel === index) {
            closePanel();
            return;
        }

        activePanel = index;

        // Clip Paths for 3-panel comic (approximate based on loose layout, can be tuned)
        const clipPaths = [
            'polygon(0% 33.33%, 100% 33.33%, 100% 100%, 0% 100%)',
            'polygon(0% 0%, 100% 0%, 100% 33.33%, 0% 33.33%, 0% 66.66%, 100% 66.66%, 100% 100%, 0% 100%)',
            'polygon(0% 0%, 100% 0%, 100% 66.66%, 0% 66.66%)'
        ];

        imageMask.style.clipPath = clipPaths[index];
    }

    function closePanel() {
        activePanel = -1;
        imageMask.style.clipPath = 'none';
        if (videoAlt) {
            videoAlt.style.opacity = '0';
            videoAlt.pause();
        }
        if (video.paused) video.play().catch(() => { });
    }
}

// 2. Lightbox Logic
window.openLightbox = function () {
    let lightbox = document.getElementById('lightboxOverlay');
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.id = 'lightboxOverlay';
        lightbox.className = 'lightbox-overlay';
        lightbox.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(255,255,255,0.98); z-index: 10000; display: flex; align-items: center; justify-content: center; opacity: 0; pointer-events: none; transition: opacity 0.3s;";

        lightbox.innerHTML = `
            <div class="lightbox-content" style="width:100%; height:100%; position:relative; display:flex; align-items:center; justify-content:center;">
                <button class="lightbox-close" onclick="closeLightbox()" style="position:absolute; top:20px; right:20px; z-index:10001; background:none; border:none; cursor:pointer; padding:10px;">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
                <div id="lightboxImageContainer" style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; cursor:grab;">
                    <img id="lightboxImage" src="assets/rules/fis-rules.png" style="max-width:90%; max-height:90%; object-fit:contain; transition: transform 0.1s linear;">
                </div>
            </div>
        `;
        document.body.appendChild(lightbox);

        // Add class for visible state
        const style = document.createElement('style');
        style.innerHTML = `.lightbox-overlay.visible { opacity: 1 !important; pointer-events: auto !important; }`;
        document.head.appendChild(style);

        setTimeout(() => initLightboxInteractions(), 100);
    }

    setTimeout(() => lightbox.classList.add('visible'), 10);
    if (window.resetLightboxState) window.resetLightboxState();
}

window.closeLightbox = function () {
    const lightbox = document.getElementById('lightboxOverlay');
    if (lightbox) lightbox.classList.remove('visible');
}

function initLightboxInteractions() {
    const container = document.getElementById('lightboxImageContainer');
    const img = document.getElementById('lightboxImage');
    if (!container || !img) return;

    let scale = 1, pointX = 0, pointY = 0, startX = 0, startY = 0, panning = false;

    window.resetLightboxState = () => { scale = 1; pointX = 0; pointY = 0; updateTransform(); };

    function updateTransform() {
        img.style.transform = `translate(${pointX}px, ${pointY}px) scale(${scale})`;
    }

    container.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.2 : 0.2;
        scale = Math.min(Math.max(0.5, scale + delta), 4);
        updateTransform();
    }, { passive: false });

    // Panning logic
    img.addEventListener('mousedown', (e) => {
        e.preventDefault();
        panning = true;
        startX = e.clientX - pointX;
        startY = e.clientY - pointY;
        container.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
        if (!panning) return;
        e.preventDefault();
        pointX = e.clientX - startX;
        pointY = e.clientY - startY;
        updateTransform();
    });

    window.addEventListener('mouseup', () => {
        if (panning) {
            panning = false;
            container.style.cursor = 'grab';
        }
    });
}


// 3. 3D Tilt Logic
window.initTiltEffect = function () {
    const stage = document.getElementById('tiltStage');
    const image = document.getElementById('tiltImage');

    if (!stage || !image) return;

    stage.addEventListener('mousemove', (e) => {
        const rect = stage.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -12;
        const rotateY = ((x - centerX) / centerX) * 12;

        image.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });

    stage.addEventListener('mouseleave', () => {
        image.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale(1)`;
    });
}

// Init when content loads
document.addEventListener('DOMContentLoaded', () => {
    // Optional: auto-init if needed
});
