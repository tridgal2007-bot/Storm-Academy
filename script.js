// Navbar Logic
const navbar = document.getElementById('navbar');
const mobileToggle = document.getElementById('mobile-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

// Scroll Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
        navbar.classList.add('bg-storm-dark/90', 'border-storm-dark', 'backdrop-blur-md');
        navbar.classList.remove('border-transparent');
    } else {
        navbar.classList.remove('bg-storm-dark/90', 'border-storm-dark', 'backdrop-blur-md');
        navbar.classList.add('border-transparent');
    }
});

// Mobile Menu Toggle
mobileToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('opacity-100');
    if (isOpen) {
        mobileMenu.classList.remove('opacity-100', 'pointer-events-auto');
        mobileMenu.classList.add('opacity-0', 'pointer-events-none');
    } else {
        mobileMenu.classList.add('opacity-100', 'pointer-events-auto');
        mobileMenu.classList.remove('opacity-0', 'pointer-events-none');
    }
});

// Close mobile menu on link click
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('opacity-100', 'pointer-events-auto');
        mobileMenu.classList.add('opacity-0', 'pointer-events-none');
    });
});


// VFX: Rain and Lightning
const rainCanvas = document.getElementById('rain-canvas');
const lightningCanvas = document.getElementById('lightning-canvas');
const flashOverlay = document.getElementById('lightning-flash-overlay');

if (rainCanvas && lightningCanvas) {
    const ctxRain = rainCanvas.getContext('2d');
    const ctxLightning = lightningCanvas.getContext('2d');

    let w = window.innerWidth;
    let h = window.innerHeight;

    const resize = () => {
        w = window.innerWidth;
        h = window.innerHeight;
        rainCanvas.width = w;
        rainCanvas.height = h;
        lightningCanvas.width = w;
        lightningCanvas.height = h;
    };
    window.addEventListener('resize', resize);
    resize();

    // Rain Logic
    const raindrops = [];
    const maxDrops = 150;

    for (let i = 0; i < maxDrops; i++) {
        raindrops.push({
            x: Math.random() * w,
            y: Math.random() * h,
            speed: Math.random() * 15 + 10,
            len: Math.random() * 20 + 10,
        });
    }

    function drawRain() {
        ctxRain.clearRect(0, 0, w, h);
        ctxRain.strokeStyle = 'rgba(174, 194, 224, 0.3)';
        ctxRain.lineWidth = 1;
        ctxRain.lineCap = 'round';

        ctxRain.beginPath();
        for (let i = 0; i < maxDrops; i++) {
            const d = raindrops[i];
            ctxRain.moveTo(d.x, d.y);
            ctxRain.lineTo(d.x, d.y + d.len);

            d.y += d.speed;
            d.x -= 1; // Slight wind

            if (d.y > h) {
                d.y = -20;
                d.x = Math.random() * w;
            }
        }
        ctxRain.stroke();
        requestAnimationFrame(drawRain);
    }
    drawRain();

    // Lightning Logic
    let isFlashing = false;

    function flash() {
        if (isFlashing) return;
        isFlashing = true;

        // Flash Overlay
        flashOverlay.style.opacity = (Math.random() * 0.3 + 0.1).toString();
        setTimeout(() => {
            flashOverlay.style.opacity = '0';
        }, 100);

        // Draw Lightning Bolt
        const startX = Math.random() * w;
        
        ctxLightning.strokeStyle = '#ffffff';
        ctxLightning.shadowBlur = 20;
        ctxLightning.shadowColor = '#818cf8';
        ctxLightning.lineWidth = 2;
        
        ctxLightning.beginPath();
        ctxLightning.moveTo(startX, 0);
        
        let currentX = startX;
        let currentY = 0;
        
        while (currentY < h) {
            const newX = currentX + (Math.random() * 40 - 20);
            const newY = currentY + (Math.random() * 30 + 10);
            ctxLightning.lineTo(newX, newY);
            currentX = newX;
            currentY = newY;
        }
        ctxLightning.stroke();

        // Clear lightning
        setTimeout(() => {
            ctxLightning.clearRect(0, 0, w, h);
            isFlashing = false;
            scheduleFlash();
        }, 150);
    }

    function scheduleFlash() {
        const delay = Math.random() * 5000 + 2000;
        setTimeout(flash, delay);
    }
    scheduleFlash();
}