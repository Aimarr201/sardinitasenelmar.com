// ==================== BUBBLES GENERATION ====================
const bubblesContainer = document.getElementById('contenedor-burbujas-animadas');
if (bubblesContainer) {
    for (let i = 0; i < 25; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'burbuja-animada';
        const size = Math.random() * 20 + 5;
        bubble.style.width = size + 'px';
        bubble.style.height = size + 'px';
        bubble.style.left = Math.random() * 100 + '%';
        bubble.style.animationDuration = (Math.random() * 10 + 8) + 's';
        bubble.style.animationDelay = (Math.random() * 10) + 's';
        bubblesContainer.appendChild(bubble);
    }
}

// ==================== NAVBAR SCROLL ====================
const scrollTopBtn = document.getElementById('boton-subir-arriba');

window.addEventListener('scroll', () => {
    const navbar = document.getElementById('barra-navegacion-fija');
    if (navbar) {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    if (scrollTopBtn) {
        if (window.scrollY > 80) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }
});

// ==================== CURSOR GLOW ====================
const cursorGlow = document.getElementById('efecto-resplandor-cursor');

document.addEventListener('mousemove', (e) => {
    if (!cursorGlow) return;
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
    cursorGlow.style.display = 'flex';
});

// ==================== RANDOM GROUP DELAY (1s - 15s) ====================
// Añade un tiempo de espera aleatorio a cada cardumen (suma al delay definido en CSS)
(function applyRandomDelayPerCardumen(minSeconds = 1, maxSeconds = 7) {
    const groups = document.querySelectorAll('.cardumen-sardinas-animadas, .cardumen-sardinas-animadas-inverso');
    groups.forEach(group => {
        const baseDelay = Math.random() * (maxSeconds - minSeconds) + minSeconds;
        const fishes = group.querySelectorAll('button');
        fishes.forEach(fish => {
            const cs = getComputedStyle(fish);
            // cs.animationDelay puede devolver valores como "0s" o "0.3s"
            const cssDelay = cs.animationDelay || '0s';
            const parsed = parseFloat(cssDelay) || 0;
            const newDelay = parsed + baseDelay;
            fish.style.animationDelay = newDelay + 's';
            fish.style.animationPlayState = 'running';
        });
    });
})();

// ==================== GROUP VERTICAL BASE + PER-FISH OFFSET ====================

// ==================== CARDUMEN IZQUIERDO ====================
async function applyGroupVerticalPositionsLeft(minVh = 0, maxVh = 60, minDelay = 3.5, maxDelay = 8) {
    const group = document.querySelector('.cardumen-sardinas-animadas');
    const fishes = Array.from(group.querySelectorAll('button'));
    if (!fishes.length) return;

    const initialTops = fishes.map(f => {
        const csTop = getComputedStyle(f).top;
        return csTop.endsWith('%') ? parseFloat(csTop) : (parseFloat(csTop) || 0) / group.offsetHeight * 100;
    });

    function applyRandomPositions() {
        const randomValue = Math.random() * (maxVh - minVh) + minVh;

        fishes.forEach((f, i) => {
            if (f.dataset.escaped) return;
            const topPercent = initialTops[i] + randomValue;
            f.style.top = topPercent + '%';
        });
    }

    function waitForAnimationIteration() {
        return new Promise(resolve => {
            const activeFishes = fishes.filter(fish => !fish.dataset.escaped);
            if (!activeFishes.length) {
                resolve(false);
                return;
            }

            let settled = false;
            const observer = new MutationObserver(() => {
                if (!fishes.some(fish => !fish.dataset.escaped)) {
                    finish(false);
                }
            });

            const finish = hasIteration => {
                if (settled) return;
                settled = true;
                observer.disconnect();
                activeFishes.forEach(fish => fish.removeEventListener('animationiteration', onIteration));
                resolve(hasIteration);
            };

            const onIteration = () => finish(true);
            activeFishes.forEach(fish => fish.addEventListener('animationiteration', onIteration, { once: true }));
            observer.observe(group, { subtree: true, attributes: true, attributeFilter: ['data-escaped'] });
        });
    }

    function waitForDelay() {
        const randomDelay = Math.random() * (maxDelay - minDelay) + minDelay;
        return new Promise(resolve => setTimeout(resolve, randomDelay * 1000));
    }

    // Aplicar posición inicial
    applyRandomPositions();

    // Loop asincrónico
    while (true) {
        if (!await waitForAnimationIteration()) break;
        await waitForDelay();
        applyRandomPositions();
    }
}

// ==================== CARDUMEN DERECHO ====================
async function applyGroupVerticalPositionsRight(minVh = 0, maxVh = 60, minDelay = 3.5, maxDelay = 8) {
    const group = document.querySelector('.cardumen-sardinas-animadas-inverso');
    const fishes = Array.from(group.querySelectorAll('button'));
    if (!fishes.length) return;

    const initialTops = fishes.map(f => {
        const csTop = getComputedStyle(f).top;
        return csTop.endsWith('%') ? parseFloat(csTop) : (parseFloat(csTop) || 0) / group.offsetHeight * 100;
    });

    function applyRandomPositions() {
        const randomValue = Math.random() * (maxVh - minVh) + minVh;

        fishes.forEach((f, i) => {
            if (f.dataset.escaped) return;
            const topPercent = initialTops[i] + randomValue;
            f.style.top = topPercent + '%';
        });
    }

    function waitForAnimationIteration() {
        return new Promise(resolve => {
            const activeFishes = fishes.filter(fish => !fish.dataset.escaped);
            if (!activeFishes.length) {
                resolve(false);
                return;
            }

            let settled = false;
            const observer = new MutationObserver(() => {
                if (!fishes.some(fish => !fish.dataset.escaped)) {
                    finish(false);
                }
            });

            const finish = hasIteration => {
                if (settled) return;
                settled = true;
                observer.disconnect();
                activeFishes.forEach(fish => fish.removeEventListener('animationiteration', onIteration));
                resolve(hasIteration);
            };

            const onIteration = () => finish(true);
            activeFishes.forEach(fish => fish.addEventListener('animationiteration', onIteration, { once: true }));
            observer.observe(group, { subtree: true, attributes: true, attributeFilter: ['data-escaped'] });
        });
    }

    function waitForDelay() {
        const randomDelay = Math.random() * (maxDelay - minDelay) + minDelay;
        return new Promise(resolve => setTimeout(resolve, randomDelay * 1000));
    }

    // Aplicar posición inicial
    applyRandomPositions();

    // Loop asincrónico
    while (true) {
        if (!await waitForAnimationIteration()) break;
        await waitForDelay();
        applyRandomPositions();
    }
}

// Ejecutar ambas funciones
applyGroupVerticalPositionsLeft();
applyGroupVerticalPositionsRight();

// ==================== CAZA DE SARDINAS ====================
function addSardineClickHandlers() {
    const allSardines = document.querySelectorAll('.sardina-individual-animada, .sardina-individual-animada-inversa');

    allSardines.forEach(sardine => {
        sardine.addEventListener('click', function handler() {
            sardine.removeEventListener('click', handler);

            sardine.dataset.escaped = 'true';

            // Detectar qué tipo de sardina es
            const isInversa = sardine.classList.contains('sardina-individual-animada-inversa');
            const scale = isInversa ? 'scaleX(1)' : 'scaleX(-1)';

            const hero = sardine.closest('.seccion-hero-inicio');
            const rect = sardine.getBoundingClientRect();
            const heroRect = hero.getBoundingClientRect();
            const currentTop = rect.top - heroRect.top;
            const targetTop = heroRect.height * 0.02;
            const translateNeeded = -(currentTop - targetTop);

            sardine.style.animation   = 'none';
            sardine.style.position    = 'absolute';
            sardine.style.left        = (rect.left - heroRect.left) + 'px';
            sardine.style.top         = currentTop + 'px';
            sardine.style.right       = 'auto';
            sardine.style.marginLeft  = '0';
            sardine.style.marginRight = '0';
            sardine.style.transform   = 'none';
            sardine.style.opacity     = '1';

            sardine.offsetHeight;

            const escape = sardine.animate([
                { transform: `translateY(0) rotate(0deg) scaleY(-1) ${scale}`,                     opacity: 1 },
                { transform: `translateY(${translateNeeded}px) rotate(10deg) scaleY(-1) ${scale}`, opacity: 1 }
            ], {
                duration: 30000,
                easing: 'ease-out',
                fill: 'forwards'
            });

            escape.onfinish = () => {
                escape.cancel();

                sardine.style.top       = '2%';
                sardine.style.transform = `rotate(10deg) ${scale}`;

                sardine.offsetHeight;

                const floatAnimation = isInversa ? 'sardineFloatReverse' : 'sardineFloat';
                sardine.style.animation = `${floatAnimation} 8s ease-in-out infinite`;
            };
        });
    });
}

addSardineClickHandlers()
