
/**
 * Experiment Page Logic - Scale with Confidence Wave
 * Animation: Multi-sine wave flow
 * Theme: Wave logic adapts to modes, but focused on Night mode
 */

const canvas = document.getElementById('visualizerCanvas');
const ctx = canvas.getContext('2d');
const pauseBtn = document.getElementById('pauseBtn');
const modeBtns = document.querySelectorAll('.mode-btn');

let isPaused = false;
let currentMode = 'night'; // Changed default to night in logic too
let animationId;
let width, height;
let time = 0;

// Configuration based on mode
// We define curve properties here.
const config = {
    dawn: {
        colors: ['rgba(255, 100, 100, 0.5)', 'rgba(255, 150, 50, 0.3)'],
        amplitude: 50,
        frequency: 0.005
    },
    day: {
        colors: ['rgba(99, 91, 255, 0.4)', 'rgba(60, 200, 220, 0.3)'],
        amplitude: 40,
        frequency: 0.003
    },
    dusk: {
        colors: ['rgba(255, 80, 80, 0.5)', 'rgba(100, 50, 150, 0.4)'],
        amplitude: 60,
        frequency: 0.004
    },
    night: {
        // The Scale with Confidence look: Purple/Pink gradients
        // We'll create a gradient stroke in the draw loop
        amplitude: 80,
        frequency: 0.002
    }
};

/**
 * Wave Class
 * Represents a single flowing line
 */
class Wave {
    constructor(index, total) {
        this.index = index;
        this.total = total;
        this.phase = Math.random() * Math.PI * 2;
        this.speed = 0.005 + Math.random() * 0.005;
        this.yOffset = 0;
    }

    draw(t) {
        const modeConfig = config[currentMode];
        const centerY = height / 1.5; // Lower half

        ctx.beginPath();

        // Start point (left)
        ctx.moveTo(0, centerY);

        // Draw curve to the right
        for (let x = 0; x <= width; x += 10) {
            // Complex Sine combining multiple frequencies
            // The further right (x), the more the wave "opens up" (amplitude increases)
            const spread = (x / width); // 0 to 1
            const waveY = Math.sin(x * modeConfig.frequency + this.phase + t) * (modeConfig.amplitude * spread * 2)
                + Math.cos(x * modeConfig.frequency * 0.5 + t * 0.5) * (20 * spread);

            // Add some noise/offset based on index to separate lines
            const lineOffset = (this.index - this.total / 2) * (15 * spread);

            ctx.lineTo(x, centerY + waveY + lineOffset);
        }

        // Stroke Style
        if (currentMode === 'night') {
            // Gradient for the specific look
            const gradient = ctx.createLinearGradient(0, 0, width, 0);
            gradient.addColorStop(0, 'rgba(100, 100, 255, 0)'); // Fade in from left
            gradient.addColorStop(0.5, 'rgba(180, 50, 255, 0.5)'); // Purple mid
            gradient.addColorStop(1, 'rgba(255, 100, 150, 0.0)'); // Pink fade out right
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2;
        } else {
            ctx.strokeStyle = modeConfig.colors[this.index % modeConfig.colors.length];
            ctx.lineWidth = 1.5;
        }

        ctx.stroke();
    }
}

let waves = [];

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;

    // Create a bunch of waves
    waves = [];
    const waveCount = 40;
    for (let i = 0; i < waveCount; i++) {
        waves.push(new Wave(i, waveCount));
    }
}

function animate() {
    if (!isPaused) {
        ctx.clearRect(0, 0, width, height);

        time += 0.01;

        waves.forEach(wave => {
            wave.draw(time);
        });
    }
    animationId = requestAnimationFrame(animate);
}

// Controls
pauseBtn.addEventListener('click', () => {
    isPaused = !isPaused;
    pauseBtn.querySelector('.icon-pause').classList.toggle('hidden');
    pauseBtn.querySelector('.icon-play').classList.toggle('hidden');
    pauseBtn.setAttribute('aria-label', isPaused ? 'Resume' : 'Pause');
});

modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        modeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentMode = btn.dataset.mode;
        document.body.className = `mode-${currentMode}`;
    });
});

// Init
window.addEventListener('resize', resize);
resize();
animate();

// Sync initial state
document.querySelectorAll('.mode-btn').forEach(b => {
    if (b.dataset.mode === 'night') b.click();
});

// PostHog
if (window.posthog) {
    posthog.capture('experiment_page_viewed', { mode: 'night', variant: 'wave_animation' });
}
