
/**
 * playground.js - V5 (Optimized & Fixed)
 */

document.addEventListener('DOMContentLoaded', () => {
    initFilters();
    initSnow();
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
                    card.offsetHeight;
                    card.style.animation = 'fadeInPage 0.5s ease-out';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

/* ============================
   2. Clipboard Logic
   ============================ */
window.copyCode = function (btn, type) {
    let value = '';

    // Mode 1: Direct Value
    if (btn.hasAttribute('data-value')) {
        value = btn.getAttribute('data-value');
    }
    // Mode 2: Target ID (For long code blocks)
    else if (btn.hasAttribute('data-target-id')) {
        const targetId = btn.getAttribute('data-target-id');
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
            // Trim indentation for cleaner copy
            value = targetEl.innerHTML.replace(/^\s*\n/g, '').replace(/\s*$/, '');
            // Optional: formatting logic could go here
        }
    }

    if (!value) return;

    if (window.event) window.event.stopPropagation();

    navigator.clipboard.writeText(value).then(() => {
        showToast(type === 'id' ? 'ID 已复制!' : '源码已复制!');
    }).catch(err => console.error('Copy failed', err));
}

function showToast(msg) {
    const toast = document.getElementById('toastNotification');
    const toastMsg = document.getElementById('toastMessage');
    if (toast && toastMsg) {
        toastMsg.innerText = msg;
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 2000);
    }
}

/* ============================
   3. Global Effects
   ============================ */
let snowEffect = null;
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
   4. Modal Logic (Fixed & Optimized)
   ============================ */

window.openDemoModal = function (type) {
    if (window.event) window.event.stopPropagation(); // prevent card click bubbling

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

    if (type === 'comic') {
        renderComicDemo(content);
    } else if (type === 'tilt') {
        renderTiltDemo(content);
    } else if (type === 'lightbox') {
        renderLightboxDemo(content);
    }
}

// FIX: Expose openLightbox for HTML onclick="openLightbox()"
window.openLightbox = function () {
    window.openDemoModal('lightbox');
}

window.closeDemoModal = function () {
    const container = document.getElementById('modalContainer');
    if (container) container.innerHTML = '';
    // Stop any requestAnimationFrames or video sounds if needed
}

// Logic for Comic
function renderComicDemo(container) {
    container.innerHTML = `
        <div class="comic-wrapper" id="comicWrapper" style="position:relative; width:100%; height:100%; max-width:1200px; display:flex; justify-content:center; align-items:center;">
             <div class="comic-container" style="position:relative; width:100%; height:100%;">
                
                <video id="comicVideo" src="assets/rules/lion-customs-comic.mp4" loop muted playsinline style="width:100%; height:100%; object-fit:contain; position:absolute;"></video>
                <video id="comicVideoAlt" src="assets/rules/lion-customs-comic-1.mp4" loop muted playsinline style="width:100%; height:100%; object-fit:contain; position:absolute; opacity:0; transition:opacity 0.5s;"></video>

                <div id="comicImageMask" style="position:absolute; inset:0; background: url('assets/rules/lion-customs-comic.png') center/contain no-repeat; transition: clip-path 0.5s cubic-bezier(0.4, 0, 0.2, 1); pointer-events:none;"></div>

                <!-- Hotspots with Visuals -->
                <div class="comic-hotspots" style="position:absolute; inset:0;">
                    <div class="comic-hotspot" onclick="togglePanel(0)" style="position:absolute; top:5%; left:5%; width:90%; height:28%; cursor:pointer;">
                        <div class="hotspot-dot" style="top:50%; left:50%;"></div>
                    </div>
                    <div class="comic-hotspot" onclick="togglePanel(1)" style="position:absolute; top:36%; left:5%; width:90%; height:28%; cursor:pointer;">
                         <div class="hotspot-dot" style="top:50%; left:50%;"></div>
                    </div>
                    <div class="comic-hotspot" onclick="togglePanel(2)" style="position:absolute; top:69%; left:5%; width:90%; height:28%; cursor:pointer;">
                         <div class="hotspot-dot" style="top:50%; left:50%;"></div>
                    </div>
                </div>
             </div>
        </div>
    `;

    const video = document.getElementById('comicVideo');
    const videoAlt = document.getElementById('comicVideoAlt');
    const mask = document.getElementById('comicImageMask');
    let activePanel = -1;

    if (video) video.play().catch(e => console.log(e));

    window.togglePanel = function (index) {
        if (window.event) window.event.stopPropagation();

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
            activePanel = -1;
            mask.style.clipPath = 'none';
        } else {
            activePanel = index;
            const clips = [
                'polygon(0% 33.33%, 100% 33.33%, 100% 100%, 0% 100%)',
                'polygon(0% 0%, 100% 0%, 100% 33.33%, 0% 33.33%, 0% 66.66%, 100% 66.66%, 100% 100%, 0% 100%)',
                'polygon(0% 0%, 100% 0%, 100% 66.66%, 0% 66.66%)'
            ];
            mask.style.clipPath = clips[index];
        }
    }
}

// Logic for Tilt (Optimized with requestAnimationFrame)
function renderTiltDemo(container) {
    container.innerHTML = `
        <div class="tilt-stage" id="tiltStageModal" style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; perspective:1000px;">
            <img id="tiltImageModal" src="assets/gallery/snowboard.png" style="max-height:80%; max-width:80%; transition:transform 0.1s cubic-bezier(0.2, 0.8, 0.2, 1); transform-style:preserve-3d;">
        </div>
    `;
    const stage = document.getElementById('tiltStageModal');
    const img = document.getElementById('tiltImageModal');

    let ticking = false;

    stage.addEventListener('mousemove', (e) => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const rect = stage.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                img.style.transform = `rotateY(${x * 30}deg) rotateX(${-y * 30}deg) scale(1.05)`;
                ticking = false;
            });
            ticking = true;
        }
    });
    stage.addEventListener('mouseleave', () => {
        img.style.transform = 'none';
    });
}

function renderLightboxDemo(container) {
    container.innerHTML = `
        <div style="cursor:grab; overflow:hidden; width:100%; height:100%; display:flex; align-items:center; justify-content:center;" id="lbContainer">
            <img src="assets/rules/fis-rules.png" id="lbImage" style="max-height:90%; max-width:90%; transition:transform 0.1s;">
        </div>
    `;
}
