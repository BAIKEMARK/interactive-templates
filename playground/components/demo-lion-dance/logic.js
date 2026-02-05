/**
 * Component: Lion Dance Comic Logic
 * Registers itself to Core
 */
(function () {

    function render(container) {
        container.innerHTML = `
            <div class="comic-wrapper" id="comicWrapper" style="position:relative; width:100%; height:100%; max-width:1200px; display:flex; justify-content:center; align-items:center;">
                 <div class="comic-container" style="position:relative; width:100%; height:100%;">
                    
                    <video id="comicVideo" src="assets/rules/lion-customs-comic.mp4" loop muted playsinline style="width:100%; height:100%; object-fit:contain; position:absolute;"></video>
                    <video id="comicVideoAlt" src="assets/rules/lion-customs-comic-1.mp4" loop muted playsinline style="width:100%; height:100%; object-fit:contain; position:absolute; opacity:0; transition:opacity 0.5s;"></video>

                    <div id="comicImageMask" style="position:absolute; inset:0; background: url('assets/rules/lion-customs-comic.png') center/contain no-repeat; transition: clip-path 0.5s cubic-bezier(0.4, 0, 0.2, 1); pointer-events:none;"></div>

                    <!-- Hotspots -->
                    <div class="comic-hotspots" style="position:absolute; inset:0;">
                        <div class="comic-hotspot" onclick="Playground.Comic.togglePanel(0)" style="position:absolute; top:5%; left:5%; width:90%; height:28%; cursor:pointer;">
                            <div class="hotspot-dot" style="top:50%; left:50%;"></div>
                        </div>
                        <div class="comic-hotspot" onclick="Playground.Comic.togglePanel(1)" style="position:absolute; top:36%; left:5%; width:90%; height:28%; cursor:pointer;">
                             <div class="hotspot-dot" style="top:50%; left:50%;"></div>
                        </div>
                        <div class="comic-hotspot" onclick="Playground.Comic.togglePanel(2)" style="position:absolute; top:69%; left:5%; width:90%; height:28%; cursor:pointer;">
                             <div class="hotspot-dot" style="top:50%; left:50%;"></div>
                        </div>
                    </div>
                 </div>
            </div>
        `;

        const video = document.getElementById('comicVideo');
        if (video) video.play().catch(e => console.log(e));
    }

    // Public Logic exposed for onclick handlers
    const PublicLogic = {
        togglePanel: function (index) {
            if (window.event) window.event.stopPropagation();

            const video = document.getElementById('comicVideo');
            const videoAlt = document.getElementById('comicVideoAlt');
            const mask = document.getElementById('comicImageMask');

            // Logic state
            if (!this._activePanel) this._activePanel = -1;

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

            if (this._activePanel === index) {
                this._activePanel = -1;
                mask.style.clipPath = 'none';
            } else {
                this._activePanel = index;
                const clips = [
                    'polygon(0% 33.33%, 100% 33.33%, 100% 100%, 0% 100%)',
                    'polygon(0% 0%, 100% 0%, 100% 33.33%, 0% 33.33%, 0% 66.66%, 100% 66.66%, 100% 100%, 0% 100%)',
                    'polygon(0% 0%, 100% 0%, 100% 66.66%, 0% 66.66%)'
                ];
                mask.style.clipPath = clips[index];
            }
        }
    };

    // Namespace
    window.Playground = window.Playground || {};
    window.Playground.Comic = PublicLogic;

    // Register to DemoRegistry
    if (window.DemoRegistry) {
        window.DemoRegistry['comic'] = render;
    } else {
        // Retry if core loaded later? usually core loads first. 
        // Or wait for DOMContentLoaded.
        document.addEventListener('DOMContentLoaded', () => {
            if (window.DemoRegistry) window.DemoRegistry['comic'] = render;
        });
    }

})();
