/**
 * core/firework-effect.js
 * Traditional "Festival Style" Firework Effect.
 * Rocket launch -> Explosion.
 */

class FireworkEffect {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.rockets = [];
        this.particles = [];
        this.animationFrame = null;
        this.active = false;

        this.handleClick = this.handleClick.bind(this);
        this.resize = this.resize.bind(this);
    }

    start() {
        if (this.active) return;
        this.active = true;
        this.rockets = [];
        this.particles = [];

        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'fireworkCanvas';
            this.canvas.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:9999;';
            document.body.appendChild(this.canvas);
            this.ctx = this.canvas.getContext('2d');
            window.addEventListener('resize', this.resize);
            this.resize();
        } else {
            this.canvas.style.display = 'block';
        }

        document.addEventListener('mousedown', this.handleClick);
        this.loop();
    }

    stop() {
        this.active = false;
        if (this.canvas) {
            this.canvas.style.display = 'none';
        }
        document.removeEventListener('mousedown', this.handleClick);
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
    }

    resize() {
        if (this.canvas) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
    }

    handleClick(e) {
        // Prevent explosion when clicking UI elements
        if (e.target.closest('.ui-card') ||
            e.target.closest('.playground-header') ||
            e.target.closest('button') ||
            e.target.closest('input') ||
            e.target.closest('a')) {
            return;
        }

        // Spawn a rocket from bottom center (or random bottom x) to target
        const targetX = e.clientX;
        const targetY = e.clientY;
        const startX = targetX; // Shoot straight up for simplicity and accuracy
        const startY = this.canvas.height;

        // Red spectrum: 340-360 (purple-red) and 0-20 (orange-red)
        const hue = Math.random() > 0.5 ? Math.random() * 30 : 330 + Math.random() * 30;

        this.rockets.push({
            x: startX,
            y: startY,
            tx: targetX,
            ty: targetY,
            vx: (targetX - startX) / 40, // Should be 0 if straight up
            vy: (targetY - startY) / 40, // Reach in 40 frames
            hue: hue,
            trail: [] // For tail effect
        });
    }

    createExplosion(x, y, hue) {
        const count = 60; // More particles
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 3 + 2; // Burst speed
            // Add some "heart" or circle shape logic if desired, but random is standard
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                hue: hue,
                brightness: Math.random() * 50 + 50,
                alpha: 1,
                decay: Math.random() * 0.015 + 0.01,
                gravity: 0.05 // Slight gravity
            });
        }
    }

    loop() {
        if (!this.active) return;

        // Trail effect
        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; // Slow fade for nice trails
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.globalCompositeOperation = 'lighter';

        // Update Rockets
        for (let i = this.rockets.length - 1; i >= 0; i--) {
            const r = this.rockets[i];

            // Draw Trail
            this.ctx.beginPath();
            this.ctx.moveTo(r.x, r.y);
            r.x += r.vx;
            r.y += r.vy;
            this.ctx.lineTo(r.x, r.y);
            this.ctx.strokeStyle = `hsl(${r.hue}, 100%, 50%)`;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            // Check arrival (simple distance check or just Y check if moving up)
            // Since we set constant velocity for fixed frames, we can check proximity
            const dist = Math.hypot(r.x - r.tx, r.y - r.ty);
            if (dist < 10 || r.y < r.ty) { // Reached target
                this.createExplosion(r.x, r.y, r.hue);
                this.rockets.splice(i, 1);
            }
        }

        // Update Particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity; // Gravity
            p.vx *= 0.95; // Air resistance
            p.vy *= 0.95;
            p.alpha -= p.decay;

            if (p.alpha <= 0) {
                this.particles.splice(i, 1);
                continue;
            }

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
            this.ctx.fillStyle = `hsla(${p.hue}, 100%, ${p.brightness}%, ${p.alpha})`;
            this.ctx.fill();
        }

        this.animationFrame = requestAnimationFrame(() => this.loop());
    }
}
