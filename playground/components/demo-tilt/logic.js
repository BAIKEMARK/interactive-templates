/**
 * Component: 3D Tilt Logic
 */
(function () {
    function render(container) {
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

    function renderLightbox(container) {
        container.innerHTML = `
            <div style="cursor:grab; overflow:hidden; width:100%; height:100%; display:flex; align-items:center; justify-content:center;" id="lbContainer">
                <img src="assets/rules/fis-rules.png" id="lbImage" style="max-height:90%; max-width:90%; transition:transform 0.1s;">
            </div>
        `;
    }

    // Register
    document.addEventListener('DOMContentLoaded', () => {
        if (window.DemoRegistry) {
            window.DemoRegistry['tilt'] = render;
            window.DemoRegistry['lightbox'] = renderLightbox;
        }
    });

})();
