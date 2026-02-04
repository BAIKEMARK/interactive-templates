/**
 * Ambient Snow Effect
 * Creates a subtle, full-screen snowfall overlay.
 * Very sparse, clean, and performant.
 */

class SnowEffect {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.isActive = true;

        // Configuration
        this.config = {
            count: 50,
            speed: 0.8,         // Faster fall
            wind: 0.5,          // More movement to catch the eye
            sizeRange: [4, 7],  // Much larger to be visible
            opacity: 0.9        // High opacity
        };

        this.init();
    }

    init() {
        // Setup Canvas
        this.canvas.id = 'snow-overlay';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none'; // Click-through
        this.canvas.style.zIndex = '9999'; // On top of everything
        document.body.appendChild(this.canvas);

        // Events
        window.addEventListener('resize', () => this.resize());

        // Initial setup
        this.resize();
        this.createParticles();
        this.loop();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        // Initial random spread
        for (let i = 0; i < this.config.count; i++) {
            this.particles.push(this.resetParticle(true));
        }
    }

    resetParticle(randomY = false) {
        return {
            x: Math.random() * this.canvas.width,
            y: randomY ? Math.random() * this.canvas.height : -10,
            size: Math.random() * (this.config.sizeRange[1] - this.config.sizeRange[0]) + this.config.sizeRange[0],
            speed: Math.random() * this.config.speed + 0.2,
            opacity: Math.random() * this.config.opacity + 0.1,
            oscillate: Math.random() * Math.PI * 2, // For wavy fall
            oscillateSpeed: Math.random() * 0.02 + 0.01
        };
    }

    update() {
        for (let i = 0; i < this.particles.length; i++) {
            let p = this.particles[i];

            // Move
            p.y += p.speed;
            p.oscillate += p.oscillateSpeed;
            p.x += Math.sin(p.oscillate) * this.config.wind;

            // Reset if out of bounds
            if (p.y > this.canvas.height) {
                this.particles[i] = this.resetParticle();
            }
            if (p.x > this.canvas.width) {
                p.x = 0;
            } else if (p.x < 0) {
                p.x = this.canvas.width;
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = '#ffffff';
        this.ctx.shadowColor = 'rgba(71, 85, 105, 0.3)'; // Stronger, darker-blue shadow
        this.ctx.shadowBlur = 6;

        for (let p of this.particles) {
            this.ctx.globalAlpha = p.opacity;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    loop() {
        if (this.isActive) {
            this.update();
            this.draw();
            requestAnimationFrame(() => this.loop());
        }
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    new SnowEffect();
});
