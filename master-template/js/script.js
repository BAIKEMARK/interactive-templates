/**
 * script.js - Core Interaction Logic
 * STRICTLY PORTED from lion-dance-static/js/script.js
 * Retains exact logic for Accordion Toggle, Mobile Sheet, and Visual Updates.
 */

function selectModule(index, forceOpen = false) {
    const modules = document.querySelectorAll('.module-item');

    // Check if the clicked module is already active
    const clickedModule = document.querySelector(`.module-item[data-id="${index}"]`);
    const isAlreadyActive = clickedModule && clickedModule.classList.contains('active');

    // Toggle: If already active and not forced open, close it
    if (isAlreadyActive && !forceOpen) {
        // Close the active module
        const contentWrapper = clickedModule.querySelector('.module-content-wrapper');
        const iconCircle = clickedModule.querySelector('.icon-circle');
        const title = clickedModule.querySelector('.module-title');
        const expandIcon = clickedModule.querySelector('.expand-icon');

        clickedModule.classList.remove('active');
        clickedModule.onclick = () => selectModule(index);

        iconCircle.classList.remove('active-bg');
        iconCircle.classList.add('inactive-bg');
        title.classList.remove('active-text');
        title.classList.add('inactive-text');
        expandIcon.classList.remove('hidden');

        contentWrapper.style.height = '0';
        contentWrapper.style.opacity = '0';

        // Update visual to default state (or keep current - optional)
        updateVisual(-1);
        return;
    }

    // Normal behavior: activate the clicked module
    modules.forEach(module => {
        const id = parseInt(module.getAttribute('data-id'));
        const contentWrapper = module.querySelector('.module-content-wrapper');
        const iconCircle = module.querySelector('.icon-circle');
        const title = module.querySelector('.module-title');
        const expandIcon = module.querySelector('.expand-icon');

        if (id === index) {
            // Activate
            module.classList.add('active');
            module.onclick = () => selectModule(id); // Allow toggle

            // Icon styles
            iconCircle.classList.remove('inactive-bg');
            iconCircle.classList.add('active-bg');

            // Text styles
            title.classList.remove('inactive-text');
            title.classList.add('active-text');

            // Expand icon
            expandIcon.classList.add('hidden');

            // Open content
            const contentHeight = contentWrapper.querySelector('.module-content').offsetHeight;
            contentWrapper.style.height = contentHeight + 'px';
            contentWrapper.style.opacity = '1';

        } else {
            // Deactivate
            module.classList.remove('active');
            module.onclick = () => selectModule(id);

            // Icon styles
            iconCircle.classList.remove('active-bg');
            iconCircle.classList.add('inactive-bg');

            // Text styles
            title.classList.remove('active-text');
            title.classList.add('inactive-text');

            // Expand icon
            expandIcon.classList.remove('hidden');

            // Close content
            contentWrapper.style.height = '0';
            contentWrapper.style.opacity = '0';
        }
    });

    // Update Right Side Visuals
    updateVisual(index);
}

function updateVisual(index) {
    const gameWrapper = document.getElementById('gameWrapper');
    const galleryWrapper = document.getElementById('galleryWrapper');
    const rulesWrapper = document.getElementById('rulesWrapper');

    // Helper to hide all
    const hideAll = () => {
        if (gameWrapper) gameWrapper.style.display = 'none';
        if (galleryWrapper) galleryWrapper.style.display = 'none';
        if (rulesWrapper) rulesWrapper.style.display = 'none';
    };

    hideAll();

    switch (index) {
        case 0: // Simulator / Game (Main)
            if (gameWrapper) gameWrapper.style.display = 'block';

            // Trigger resize just in case to ensure canvas renders correctly
            // if (typeof window.resizeGame === 'function') {
            //     requestAnimationFrame(() => window.resizeGame());
            // }
            if (typeof window.resumeGame === 'function') {
                // window.resumeGame();
            }
            break;

        case 1: // Gallery
            if (galleryWrapper) galleryWrapper.style.display = 'flex';

            if (typeof window.pauseGame === 'function') window.pauseGame();

            // Mobile UX: Auto-expand logic removed for Modal Pattern
            break;
            break;

        case 2: // Rules
            if (rulesWrapper) {
                // For Rules, we usually want flex to center content, OR block if scrolling
                rulesWrapper.style.display = 'flex';
            }
            if (typeof window.pauseGame === 'function') window.pauseGame();
            break;

        default: // Fallback (-1 or other)
            break;
    }
}

// ========== Mobile Sheet Interactions ==========

function initMobileInteractions() {
    const container = document.getElementById('visualContainer');
    const closeBtn = document.getElementById('toggleSizeBtn'); // This is now the close button

    if (!container) return;

    // Open Modal (From Inline Buttons)
    document.querySelectorAll('.js-open-modal').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();

            // Determine context based on button class
            if (btn.classList.contains('btn-game')) {
                if (typeof updateVisual === 'function') updateVisual(0);
                if (typeof window.resumeGame === 'function') window.resumeGame();
            } else if (btn.classList.contains('btn-gallery')) {
                if (typeof updateVisual === 'function') updateVisual(1);
            } else if (btn.classList.contains('btn-rules')) {
                if (typeof updateVisual === 'function') updateVisual(2);
            }

            container.classList.add('active');
        });
    });

    // Close Modal
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            container.classList.remove('active');

            // PAUSE GAME / VIDEO on Close to save resources
            const pauseEvent = new KeyboardEvent('keydown', { code: 'KeyP' });
            window.dispatchEvent(pauseEvent); // Trigger game pause if running

            if (typeof window.pauseGame === 'function') window.pauseGame();

            // Also pause any videos if present
            const videos = document.querySelectorAll('video');
            videos.forEach(v => v.pause());
        });
    }
}

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    // Determine stats height to set initial open state correctly
    const activeModule = document.querySelector('.module-item.active');
    if (activeModule) {
        const wrapper = activeModule.querySelector('.module-content-wrapper');
        const content = wrapper.querySelector('.module-content');
        wrapper.style.height = content.offsetHeight + 'px';
    }

    // Initialize View (Default to 0)
    // If you want it closed by default, pass -1 or don't call updateVisual(0)
    updateVisual(0);

    // Initialize Mobile Interactions
    initMobileInteractions();

    // Resize observer to handle dynamic content height changes
    window.addEventListener('resize', () => {
        const active = document.querySelector('.module-item.active');
        if (active) {
            const wrapper = active.querySelector('.module-content-wrapper');
            const content = wrapper.querySelector('.module-content');
            wrapper.style.height = content.offsetHeight + 'px';
        }
    });
});
