
/**
 * core/app.js - Playground Core Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    initFilters();
    initSnow();
    initFirework();
});

/* ============================
   1. Filtering System
   ============================ */
function initFilters() {
    const btns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.ui-card');

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            cards.forEach(card => {
                const category = card.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = 'none';
                    card.offsetHeight; // trigger reflow
                    card.style.animation = 'fadeInPage 0.5s ease-out';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

/* ============================
   2. Clipboard Logic (Generic)
   ============================ */
window.copyCode = function (btn, type) {
    let value = '';

    // Mode 1: Direct Value
    if (btn.hasAttribute('data-value')) {
        value = btn.getAttribute('data-value');
    }
    // Mode 2: Target ID (For Real Code Templates)
    else if (btn.hasAttribute('data-target-id')) {
        const targetId = btn.getAttribute('data-target-id');
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
            // Trim indentation
            value = targetEl.innerHTML.replace(/^\s*\n/g, '').replace(/\s*$/, '');
        }
    }

    if (!value) return;
    if (window.event) window.event.stopPropagation();

    navigator.clipboard.writeText(value).then(() => {
        showToast(type === 'id' ? 'ID 已复制!' : '源码已复制!');
    }).catch(err => console.error('Copy failed', err));
}

window.showToast = function (msg) {
    const toast = document.getElementById('toastNotification');
    const toastMsg = document.getElementById('toastMessage');
    if (toast && toastMsg) {
        toastMsg.innerText = msg;
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 2000);
    }
}

/* ============================
   3. Global Effects Manager
   ============================ */
let snowEffect = null;
let fireworkEffect = null; // New

function initSnow() {
    if (typeof SnowEffect !== 'undefined') {
        const canvas = document.getElementById('gameCanvas');
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            window.addEventListener('resize', () => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            });
            snowEffect = new SnowEffect(false);
        }
    }
}

function initFirework() {
    if (typeof FireworkEffect !== 'undefined') {
        fireworkEffect = new FireworkEffect();
    }
}

window.toggleSnow = function (enable) {
    if (window.event) window.event.stopPropagation();

    if (!snowEffect) return;
    const container = document.getElementById('gameContainer');
    if (enable) {
        container.style.visibility = 'visible';
        snowEffect.start();
        showToast('下雪特效开启');
    } else {
        container.style.visibility = 'hidden';
        snowEffect.stop();
        showToast('下雪特效关闭');
    }
}

window.toggleFirework = function (enable) {
    if (window.event) window.event.stopPropagation();

    if (!fireworkEffect) return;
    if (enable) {
        fireworkEffect.start();
        showToast('点击任意处放烟花!');
    } else {
        fireworkEffect.stop();
        showToast('烟花特效关闭');
    }
}

window.changeBgColor = function (color) {
    if (window.event) window.event.stopPropagation();

    document.body.style.backgroundColor = color;
    const header = document.querySelector('.playground-header');
    if (color === '#1a1a1a') {
        document.body.style.color = 'white';
        if (header) header.style.background = 'rgba(0,0,0,0.8)';
    } else {
        document.body.style.color = '#111827';
        if (header) header.style.background = 'rgba(255,255,255,0.8)';
    }
}

/* ============================
   4. Modal System (Delegate)
   ============================ */
// Stores registered open functions
window.DemoRegistry = {};

window.openDemoModal = function (type) {
    if (window.event) window.event.stopPropagation();

    const container = document.getElementById('modalContainer');
    if (!container) return;

    container.innerHTML = '';

    const modal = document.createElement('div');
    modal.className = 'demo-modal visible';

    modal.innerHTML = `
        <button class="modal-close-btn" onclick="closeDemoModal()">×</button>
        <div class="modal-content" id="modalContent"></div>
    `;

    container.appendChild(modal);
    const content = modal.querySelector('#modalContent');

    // Delegate to registered component logic
    if (window.DemoRegistry[type]) {
        window.DemoRegistry[type](content);
    } else {
        console.warn(`No handler registered for demo type: ${type}`);
    }
}

window.closeDemoModal = function () {
    const container = document.getElementById('modalContainer');
    if (container) container.innerHTML = '';
    // Optional: emit event 'modalClosed'
}

// Convenience wrapper
window.openLightbox = function () {
    window.openDemoModal('lightbox');
}
