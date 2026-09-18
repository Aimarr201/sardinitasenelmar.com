/* ==========================================================================
   global.js — sardinitasenelmar
   ========================================================================== */

/* --------------------------------------------------------------------------
    Configuración
    -------------------------------------------------------------------------- */

const BUBBLES = {
    count: 25,
    minSize: 5,
    maxSize: 25,
    minDuration: 8,
    maxDuration: 18,
    maxDelay: 10,
};

const SCROLL_THRESHOLD = 80;

const SCHOOL = {
    // Tiempo de adelanto añadido a cada pez del cardumen, además del
    // `animation-delay` definido en CSS.
    headStart: [1, 7],
    // Deriva vertical, en porcentaje de la altura del hero, añadida al `top`
    // CSS de cada pez.
    drift: [0, 60],
    // Tiempo mínimo que se mantiene un valor de deriva antes de poder elegir
    // uno nuevo (segundos). Una vuelta dura 15s, así que valores menores
    // significan "una nueva altura cada vuelta".
    hold: [3.5, 8],
    // No empujar nunca un pez más abajo que esto, para que permanezca dentro
    // del hero.
    maxTop: 90,
};

const ESCAPE = {
    durationMs: 30000,
    targetTop: 2,      // porcentaje de la altura del hero
    floatSeconds: 8,
};

const SELECTOR = {
    hero: '.seccion-hero-inicio',
    bubbles: '#contenedor-burbujas-animadas',
    // `header.js` inyecta la barra de navegación; el id es lo que buscaba el
    // código antiguo y la clase es lo que realmente estiliza `global.css`, así
    // que aceptar ambos.
    navbar: '#barra-navegacion-fija, .barra-navegacion',
    scrollTop: '#boton-subir-arriba',
    cursorGlow: '#efecto-resplandor-cursor',
    sardine: '.sardina-individual-animada, .sardina-individual-animada-inversa',
    reverseSardine: '.sardina-individual-animada-inversa',
    interactive: 'a, button, input, select, textarea, label, [role="button"]',
};

const SCHOOLS = [
    '.cardumen-sardinas-animadas',
    '.cardumen-sardinas-animadas-inverso',
];

/* --------------------------------------------------------------------------
    Utilidades
    -------------------------------------------------------------------------- */

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

const randomBetween = ([min, max]) => Math.random() * (max - min) + min;

const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasFinePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

// Vacía el layout pendiente para que la siguiente escritura de estilo parta
// del valor que acabamos de establecer en lugar de combinarse con él.
const forceReflow = element => void element.offsetHeight;

function rafThrottle(callback) {
    let frame = null;
    return (...args) => {
        if (frame !== null) return;
        frame = requestAnimationFrame(() => {
            frame = null;
            callback(...args);
        });
    };
}

/* --------------------------------------------------------------------------
    Burbujas
    -------------------------------------------------------------------------- */

function createBubbles() {
    const container = $(SELECTOR.bubbles);
    if (!container || prefersReducedMotion) return;

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < BUBBLES.count; i++) {
        const bubble = document.createElement('div');
        const size = randomBetween([BUBBLES.minSize, BUBBLES.maxSize]);

        bubble.className = 'burbuja-animada';
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${randomBetween([0, 100])}%`;
        bubble.style.animationDuration = `${randomBetween([BUBBLES.minDuration, BUBBLES.maxDuration])}s`;
        bubble.style.animationDelay = `${randomBetween([0, BUBBLES.maxDelay])}s`;

        fragment.appendChild(bubble);
    }

    container.appendChild(fragment);
}

/* --------------------------------------------------------------------------
    Barra de navegación + botón "subir-arriba"
    -------------------------------------------------------------------------- */

function initScrollState() {
    const scrollTopButton = $(SELECTOR.scrollTop);
    let navbar = $(SELECTOR.navbar);

    const update = () => {
        // La barra de navegación llega con <site-header>, que puede actualizarse
        // después de que esto se ejecute.
        if (!navbar) navbar = $(SELECTOR.navbar);

        const scrolled = window.scrollY > SCROLL_THRESHOLD;
        navbar?.classList.toggle('scrolled', scrolled);
        scrollTopButton?.classList.toggle('visible', scrolled);
    };

    window.addEventListener('scroll', rafThrottle(update), { passive: true });
    update(); // por si la página carga ya desplazada
}

/* --------------------------------------------------------------------------
    Resplandor del cursor
    -------------------------------------------------------------------------- */

function initCursorGlow() {
    const glow = $(SELECTOR.cursorGlow);
    if (!glow || prefersReducedMotion || !hasFinePointer) return;

    let x = 0;
    let y = 0;
    let visible = false;

    // Usar `transform` en vez de `left/top`: evita layout en cada movimiento del
    // ratón.
    const render = rafThrottle(() => {
        glow.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    });

    document.addEventListener('mousemove', event => {
        x = event.clientX;
        y = event.clientY;

        if (!visible) {
            visible = true;
            glow.style.display = 'flex';
        }

        render();
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
        visible = false;
        glow.style.display = 'none';
    });
}

/* --------------------------------------------------------------------------
    Cardúmenes: deriva vertical
    --------------------------------------------------------------------------
    Todos los peces ejecutan la misma vuelta de 15s. Están fuera de pantalla y
    totalmente transparentes desde 0% hasta ~55% de esa vuelta, y visibles desde
    ~55% hasta ~95%. Por ello, el único momento seguro para cambiar su `top` es
    el instante en que se reinicia la animación —que coincide con el evento
    `animationiteration` del propio elemento.

    El cardumen comparte un solo valor de deriva por vuelta, así mantiene la
    formación; un pez adopta el valor actual cuando se reinicia, lo que hace que
    el cambio de altura reconstituya el cardumen a lo largo de una vuelta en
    lugar de teletransportarlo a mitad de pantalla.
    -------------------------------------------------------------------------- */

function startSchool(groupSelector) {
    const group = $(groupSelector);
    if (!group) return;

    const fishes = $$('button', group);
    if (!fishes.length) return;

    const groupHeight = group.getBoundingClientRect().height;

    // El `top` CSS de cada pez como porcentaje, leído una vez antes de que
    // exista un `top` inline.
    const baseTops = new Map(fishes.map(fish => [fish, readTopPercent(fish, groupHeight)]));
    const lapOf = new Map(fishes.map(fish => [fish, 0]));
    const driftOfLap = new Map();

    let drift = randomBetween(SCHOOL.drift);
    let driftSetAt = performance.now();
    let holdMs = randomBetween(SCHOOL.hold) * 1000;

    driftOfLap.set(0, drift);

    function driftForLap(lap) {
        if (driftOfLap.has(lap)) return driftOfLap.get(lap);

        // El primer pez que entre en esta vuelta decide la altura del cardumen
        // para esa vuelta.
        const now = performance.now();
        if (now - driftSetAt >= holdMs) {
            drift = randomBetween(SCHOOL.drift);
            driftSetAt = now;
            holdMs = randomBetween(SCHOOL.hold) * 1000;
        }

        driftOfLap.set(lap, drift);
        driftOfLap.delete(lap - 2);
        return drift;
    }

    function applyTop(fish, value) {
        if (fish.dataset.escaped) return;
        fish.style.top = `${Math.min(baseTops.get(fish) + value, SCHOOL.maxTop)}%`;
    }

    function onIteration(event) {
        const fish = event.currentTarget;

        if (fish.dataset.escaped) {
            fish.removeEventListener('animationiteration', onIteration);
            return;
        }

        const lap = lapOf.get(fish) + 1;
        lapOf.set(fish, lap);
        applyTop(fish, driftForLap(lap));
    }

    // 1. Colocar a todos antes de que algo sea visible.
    fishes.forEach(fish => applyTop(fish, drift));

    // 2. Escuchar el reinicio (wrap) de cada pez.
    if (!prefersReducedMotion) {
        fishes.forEach(fish => fish.addEventListener('animationiteration', onIteration));
    }

    // 3. Empezar a nadar. El CSS pausa cada pez en el tiempo 0, por lo que su
    //    `delay` solo comienza a contar aquí —eso es lo que mantiene la forma del
    //    cardumen.
    const headStart = randomBetween(SCHOOL.headStart);

    fishes.forEach(fish => {
        const cssDelay = parseFloat(getComputedStyle(fish).animationDelay) || 0;
        fish.style.animationDelay = `${cssDelay + headStart}s`;
        fish.style.animationPlayState = 'running';
    });
}

function readTopPercent(fish, containerHeight) {
    const top = getComputedStyle(fish).top;

    if (top.endsWith('%')) return parseFloat(top);

    const px = parseFloat(top);
    if (!Number.isFinite(px) || !containerHeight) return 0;

    return (px / containerHeight) * 100;
}

/* --------------------------------------------------------------------------
    Cardúmenes: clic para soltar una sardina
    -------------------------------------------------------------------------- */

function initSardineHunt() {
    document.addEventListener('click', event => {
        const target = event.target;
        if (!target?.closest || !target.closest(SELECTOR.hero)) return;

        const direct = target.closest(SELECTOR.sardine);
        if (direct) {
            escapeSardine(direct);
            return;
        }

        // No interferir con los controles reales del hero.
        if (target.closest(SELECTOR.interactive)) return;

        // La capa del hero está en z-index 30 y cubre los peces; detectar a
        // través de ella en lugar de cambiar `pointer-events` en la superposición.
        const covered = document
            .elementsFromPoint(event.clientX, event.clientY)
            .find(element => element.matches?.(SELECTOR.sardine) && !element.dataset.escaped);

        if (covered) escapeSardine(covered);
    });
}

function escapeSardine(fish) {
    if (fish.dataset.escaped) return; // indica al bucle de deriva que ignore este pez

    const group = fish.parentElement;
    if (!group) return;

    fish.dataset.escaped = 'true'; // indica al bucle de deriva que deje este pez tranquilo

    const groupRect = group.getBoundingClientRect();
    const fishRect = fish.getBoundingClientRect();

    const left = ((fishRect.left - groupRect.left) / groupRect.width) * 100;
    const top = ((fishRect.top - groupRect.top) / groupRect.height) * 100;
    const rise = groupRect.height * (ESCAPE.targetTop / 100) - (fishRect.top - groupRect.top);

    // Congela el pez donde se hizo clic: elimina la animación de nado y
    // convierte su transform en left/top. Se usan porcentajes para que resista
    // el cambio de tamaño.
    fish.style.animation = 'none';
    fish.style.left = `${left}%`;
    fish.style.top = `${top}%`;
    fish.style.right = 'auto';
    fish.style.marginLeft = '0';
    fish.style.marginRight = '0';
    fish.style.transform = 'none';
    fish.style.opacity = '1';

    forceReflow(fish);

    const isReverse = fish.matches(SELECTOR.reverseSardine);
    const bellyUp = `scaleY(-1) ${isReverse ? 'scaleX(1)' : 'scaleX(-1)'}`;

    const drift = fish.animate([
        { transform: `translateY(0) rotate(0deg) ${bellyUp}` },
        { transform: `translateY(${rise}px) rotate(10deg) ${bellyUp}` },
    ], {
        duration: ESCAPE.durationMs,
        easing: 'ease-out',
        fill: 'forwards',
    });

    drift.onfinish = () => {
        drift.cancel(); // devolver el transform al CSS

        fish.style.top = `${ESCAPE.targetTop}%`;
        fish.style.transform = `rotate(10deg) ${bellyUp}`;

        forceReflow(fish);

        const float = isReverse ? 'sardineFloatReverse' : 'sardineFloat';
        fish.style.animation = `${float} ${ESCAPE.floatSeconds}s ease-in-out infinite`;
    };
}

/* --------------------------------------------------------------------------
    Inicialización
    -------------------------------------------------------------------------- */

function init() {
    createBubbles();
    initScrollState();
    initCursorGlow();
    initSardineHunt();
    SCHOOLS.forEach(startSchool);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
    init();
}
