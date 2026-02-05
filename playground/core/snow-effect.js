/**
 * core/snow-effect.js
 * A dedicated class for handling the canvas snow effect in the Playground.
 */

class SnowEffect {
    constructor(autoStart = false) {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.active = false;
        this.particles = [];
        this.animationFrame = null;
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        if (this.canvas) {
            this.initParticles();
            if (autoStart) this.start();
        }
    }

    initParticles() {
        this.particles = [];
        const particleCount = 50; // Moderate count for performance
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                r: Math.random() * 3 + 1, // Radius
                d: Math.random() * 10 + 20 // Density (fall speed factor)
            });
        }
    }

    start() {
        if (!this.canvas || this.active) return;
        this.active = true;
        this.loop();
    }

    stop() {
        this.active = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.width, this.height);
        }
    }

    loop() {
        if (!this.active) return;

        // Clear
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Draw and Update
        this.ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        this.ctx.beginPath();

        let angle = 0; // Wiggle factor

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];

            // Draw
            this.ctx.moveTo(p.x, p.y);
            this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);

            // Update
            // Fall down
            p.y += Math.cos(angle + p.d) + 1 + p.r / 2;
            // Wiggle left/right
            p.x += Math.sin(angle) * 2;

            // Reset if out of bounds
            if (p.x > this.width + 5 || p.x < -5 || p.y > this.height) {
                if (i % 3 > 0) { // 66% enter from top
                    this.particles[i] = { x: Math.random() * this.width, y: -10, r: p.r, d: p.d };
                } else {
                    // Enter from sides
                    if (Math.sin(angle) > 0) {
                        this.particles[i] = { x: -5, y: Math.random() * this.height, r: p.r, d: p.d };
                    } else {
                        this.particles[i] = { x: this.width + 5, y: Math.random() * this.height, r: p.r, d: p.d };
                    }
                }
            }
        }

        this.ctx.fill();
        this.animationFrame = requestAnimationFrame(() => this.loop());
    }
}
