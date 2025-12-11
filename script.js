document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    
    initNavbar();
    initScrollReveal();
    initVFX(); // Raios e Chuva
    initLocalStorage(); // Salvar dados
    
    // Check if we are on the home page to init city skyline
    if(document.getElementById('city-skyline')) {
        initCitySkyline();
    }
    
    // Page Specific Inits
    if(document.getElementById('class-buttons')) initClassSwitcher();
});

// --- CITY SKYLINE GENERATOR ---
function initCitySkyline() {
    const container = document.getElementById('city-skyline');
    if(!container) return;
    
    // Clear previous if any
    container.innerHTML = '';
    
    const buildingCount = Math.floor(window.innerWidth / 60); // Responsive amount
    const allWindows = [];

    for(let i=0; i<buildingCount; i++) {
        const building = document.createElement('div');
        building.classList.add('building');
        
        // Random dimensions
        const width = Math.floor(Math.random() * 60) + 40; // 40-100px width
        const height = Math.floor(Math.random() * 300) + 100; // 100-400px height
        
        building.style.width = `${width}px`;
        building.style.height = `${height}px`;
        
        // Window Grid
        const grid = document.createElement('div');
        grid.classList.add('window-grid');
        
        // Calculate possible windows
        const rows = Math.floor(height / 20);
        const cols = Math.floor(width / 20);
        
        for(let j=0; j < rows * cols; j++) {
            const win = document.createElement('div');
            win.classList.add('window');
            // Randomly lit at start (10% chance)
            if(Math.random() > 0.9) win.classList.add('lit');
            grid.appendChild(win);
            allWindows.push(win);
        }
        
        building.appendChild(grid);
        container.appendChild(building);
    }
    
    // Animate Lights loop
    setInterval(() => {
        // Pick a random window
        if(allWindows.length > 0) {
            const randomIdx = Math.floor(Math.random() * allWindows.length);
            const win = allWindows[randomIdx];
            win.classList.toggle('lit');
        }
    }, 100); // Fast flicker rate across the city
}


// --- LOCAL STORAGE LOGIC ---
function initLocalStorage() {
    // 1. Wishlist Logic
    const wishlistBtns = document.querySelectorAll('.btn-wishlist');
    const isWishlisted = localStorage.getItem('storm_wishlist') === 'true';

    wishlistBtns.forEach(btn => {
        // Set initial state
        if (isWishlisted) {
            updateWishlistUI(btn, true);
        }

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const currentState = localStorage.getItem('storm_wishlist') === 'true';
            const newState = !currentState;
            
            localStorage.setItem('storm_wishlist', newState);
            
            // Update all buttons on page
            wishlistBtns.forEach(b => updateWishlistUI(b, newState));
            
            // Feedback effect
            if(newState) {
                triggerLightningFlash(); // Dramatic effect on save
            }
        });
    });

    // 2. Newsletter Logic
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const submitBtn = newsletterForm.querySelector('button');
        
        // Check if already subscribed
        const savedEmail = localStorage.getItem('storm_newsletter_email');
        if (savedEmail) {
            emailInput.value = savedEmail;
            emailInput.disabled = true;
            submitBtn.textContent = "INSCRITO";
            submitBtn.classList.add('bg-green-500', 'text-black');
            submitBtn.disabled = true;
        }

        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = emailInput.value;
            if(email) {
                localStorage.setItem('storm_newsletter_email', email);
                submitBtn.innerHTML = '<i data-lucide="check"></i> INSCRITO';
                submitBtn.classList.remove('bg-storm-accent');
                submitBtn.classList.add('bg-green-500', 'text-black');
                emailInput.disabled = true;
                lucide.createIcons();
                alert(`Obrigado! O e-mail ${email} foi salvo para o Beta.`);
            }
        });
    }
}

function updateWishlistUI(btn, isActive) {
    const textSpan = btn.querySelector('span.relative');
    if (isActive) {
        btn.classList.add('btn-wishlist-active');
        btn.classList.remove('bg-transparent', 'text-storm-accent');
        if(textSpan) textSpan.textContent = "Na Lista de Desejos";
    } else {
        btn.classList.remove('btn-wishlist-active');
        btn.classList.add('bg-transparent', 'text-storm-accent');
        if(textSpan) textSpan.textContent = "Lista de Desejos";
    }
}

// --- NAVBAR ---
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    let isMenuOpen = false;

    // Highlight Active Link
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        if(link.getAttribute('href') === currentPath) {
            link.classList.add('nav-active');
        }
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('bg-black/90', 'backdrop-blur-md', 'border-b', 'border-white/10');
            navbar.classList.remove('py-4', 'md:py-4');
        } else {
            navbar.classList.remove('bg-black/90', 'backdrop-blur-md', 'border-b', 'border-white/10');
            navbar.classList.add('py-4', 'md:py-4');
        }
    });

    const toggleMenu = () => {
        isMenuOpen = !isMenuOpen;
        if (isMenuOpen) {
            mobileMenu.classList.remove('opacity-0', 'pointer-events-none');
            mobileToggle.innerHTML = '<i data-lucide="x" class="w-8 h-8"></i>';
        } else {
            mobileMenu.classList.add('opacity-0', 'pointer-events-none');
            mobileToggle.innerHTML = '<i data-lucide="menu" class="w-8 h-8"></i>';
        }
        lucide.createIcons();
    };

    mobileToggle.addEventListener('click', toggleMenu);

    // Close menu when clicking a link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if(isMenuOpen) toggleMenu();
        });
    });
}

// --- VFX: RAIN & LIGHTNING (CANVAS) ---
function initVFX() {
    // Setup Canvases
    const rainCanvas = document.getElementById('rain-canvas');
    const lightningCanvas = document.getElementById('lightning-canvas');
    const flashOverlay = document.getElementById('lightning-flash-overlay');
    
    if(!rainCanvas || !lightningCanvas) return;

    const ctxRain = rainCanvas.getContext('2d');
    const ctxLightning = lightningCanvas.getContext('2d');
    
    let w, h;
    
    function resize() {
        w = window.innerWidth;
        h = window.innerHeight;
        rainCanvas.width = w;
        rainCanvas.height = h;
        lightningCanvas.width = w;
        lightningCanvas.height = h;
    }
    window.addEventListener('resize', resize);
    resize();

    // 1. RAIN SYSTEM
    const drops = [];
    const maxDrops = 100; // Reduced slightly for mobile performance

    class Drop {
        constructor() {
            this.init();
        }
        init() {
            this.x = Math.random() * w;
            this.y = Math.random() * -h; // Start above screen
            this.speed = Math.random() * 10 + 15; // Fast speed for storm
            this.len = Math.random() * 20 + 10;
            this.width = Math.random() * 1.5;
            this.wind = -2; // Slight angle
        }
        update() {
            this.y += this.speed;
            this.x += this.wind;
            if (this.y > h) {
                this.init();
            }
        }
        draw() {
            ctxRain.beginPath();
            ctxRain.moveTo(this.x, this.y);
            ctxRain.lineTo(this.x + this.wind, this.y + this.len);
            ctxRain.strokeStyle = 'rgba(174, 194, 255, 0.4)';
            ctxRain.lineWidth = this.width;
            ctxRain.stroke();
        }
    }

    for(let i=0; i<maxDrops; i++) drops.push(new Drop());

    // 2. LIGHTNING SYSTEM
    let lightning = [];
    
    function createLightning(x, y) {
        const bolt = { x, y, segments: [], life: 10 };
        let currX = x;
        let currY = y;
        
        while(currY < h) {
            let nextX = currX + (Math.random() - 0.5) * 50; // Jagged
            let nextY = currY + Math.random() * 40 + 10;
            bolt.segments.push({x1: currX, y1: currY, x2: nextX, y2: nextY});
            currX = nextX;
            currY = nextY;
        }
        lightning.push(bolt);
        
        // Flash screen
        flashOverlay.style.opacity = '0.3';
        setTimeout(() => flashOverlay.style.opacity = '0', 100);
    }

    // Loop
    function animate() {
        // Clear
        ctxRain.clearRect(0, 0, w, h);
        ctxLightning.clearRect(0, 0, w, h);

        // Draw Rain
        drops.forEach(d => {
            d.update();
            d.draw();
        });

        // Draw Lightning
        ctxLightning.strokeStyle = '#fff';
        ctxLightning.lineWidth = 2;
        ctxLightning.shadowBlur = 20;
        ctxLightning.shadowColor = '#818cf8'; // Purple/Blue glow

        for(let i = lightning.length - 1; i >= 0; i--) {
            const bolt = lightning[i];
            bolt.life--;
            
            ctxLightning.globalAlpha = bolt.life / 10;
            ctxLightning.beginPath();
            bolt.segments.forEach(seg => {
                ctxLightning.moveTo(seg.x1, seg.y1);
                ctxLightning.lineTo(seg.x2, seg.y2);
            });
            ctxLightning.stroke();

            if(bolt.life <= 0) lightning.splice(i, 1);
        }
        ctxLightning.globalAlpha = 1;

        // Random Lightning Trigger
        if(Math.random() < 0.005) { // 0.5% chance per frame
            createLightning(Math.random() * w, 0);
        }

        requestAnimationFrame(animate);
    }
    animate();
    
    // Global Access for button clicks
    window.triggerLightningFlash = () => createLightning(Math.random() * w, 0);
}

// --- CLASS SWITCHER (Specific to classes.html) ---
function initClassSwitcher() {
    
    // Define Rarity Colors for UI
    const rarityConfig = {
        "Comum": { color: "text-slate-400", border: "border-slate-500", shadow: "shadow-slate-500/50" },
        "Incomum": { color: "text-green-400", border: "border-green-500", shadow: "shadow-green-500/50" },
        "Rara": { color: "text-blue-400", border: "border-blue-500", shadow: "shadow-blue-500/50" },
        "Épica": { color: "text-purple-400", border: "border-purple-500", shadow: "shadow-purple-500/50" },
        "Lendária": { color: "text-yellow-400", border: "border-yellow-500", shadow: "shadow-yellow-500/50" }
    };

    const classesData = [
        // COMUM
        {
            name: "Tail (Cauda)",
            rarity: "Comum",
            description: "O usuário possui uma cauda forte, flexível e totalmente controlável. A cauda pode ser usada para ataques simples, agarrar objetos ou equilibrar o corpo em movimentos rápidos. Embora não tenha grande poder ofensivo, aumenta bastante a mobilidade e permite manobras acrobáticas.",
            image: "https://images.unsplash.com/photo-1534251618169-bda2527dbd65?q=80&w=1200&auto=format&fit=crop"
        },
        {
            name: "Invisible",
            rarity: "Comum",
            description: "O usuário pode tornar o próprio corpo invisível, desaparecendo completamente da visão dos inimigos. A quirk é ótima para furtividade e emboscadas, mas não remove o som dos passos nem o cheiro do usuário. Ataques realizados enquanto invisível fazem o corpo piscar rapidamente, revelando a posição por alguns segundos.",
            image: "https://images.unsplash.com/photo-1466695108335-44674aa2019b?q=80&w=1200&auto=format&fit=crop"
        },
        // INCOMUM
        {
            name: "Acid",
            rarity: "Incomum",
            description: "O usuário produz um líquido corrosivo que pode variar entre ácido fraco e extremamente tóxico. O ácido pode ser lançado como projétil, espalhado pelo chão ou usado para derreter objetos. O usuário também pode controlar a viscosidade, tornando-o mais espesso para prender inimigos ou mais fluido para aumentar o alcance. Quanto mais potente o ácido, maior o risco de o próprio usuário sofrer queimaduras se não controlar bem a quirk.",
            image: "https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?q=80&w=1200&auto=format&fit=crop"
        },
        {
            name: "Pop Off",
            rarity: "Incomum",
            description: "O usuário possui esferas adesivas na cabeça que podem ser arrancadas e lançadas como projéteis. As esferas grudam em qualquer superfície — chão, paredes, inimigos — e o tempo de adesão varia conforme a força do usuário. Elas podem ser usadas para imobilizar, criar armadilhas, rebater ataques ou até para saltos rápidos ao grudar nelas. Quanto mais esferas o usuário arranca de uma vez, mais forte fica a dor na cabeça, podendo causar tontura.",
            image: "https://images.unsplash.com/photo-1620052087057-bfd8231f5885?q=80&w=1200&auto=format&fit=crop"
        },
        // RARA
        {
            name: "Dark Shadow",
            rarity: "Rara",
            description: "O usuário controla uma entidade sombria viva que nasce da própria sombra. O Dark Shadow age como um parceiro de combate, podendo atacar, defender ou se mover independentemente do usuário. Em ambientes escuros, torna-se extremamente poderoso, ganhando força, velocidade e tamanho. Porém, quanto mais forte ele fica, mais difícil é controlá-lo. Em locais muito iluminados, o Dark Shadow enfraquece, ficando pequeno e menos agressivo.",
            image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop"
        },
        {
            name: "Armada Animal",
            rarity: "Rara",
            description: "O usuário possui a habilidade de invocar e comandar uma força inteira de criaturas animais, cada uma com funções específicas: ataque, defesa, rastreamento, suporte e distração. As criaturas são formadas por energia espiritual e surgem a partir das marcas animais que aparecem no corpo do usuário. Quanto maior a criatura ou a quantidade invocada, mais energia o usuário gasta. A Armada não controla a vontade própria — segue apenas os comandos diretos do usuário, podendo agir como um exército coordenado.",
            image: "https://images.unsplash.com/photo-1444464666168-49d633b86797?q=80&w=1200&auto=format&fit=crop"
        },
        // ÉPICA
        {
            name: "Engine",
            rarity: "Épica",
            description: "O usuário possui motores biológicos ultra-potentes embutidos nas pernas (ou pernas e braços, dependendo da evolução). Esses motores funcionam como turbinas vivas capazes de gerar impulsos extremos, permitindo velocidade absurda, arranques instantâneos, manobras aéreas e chutes devastadores. Na classe Épica, o usuário pode alternar entre diferentes “Modos de Propulsão”, cada um especializado em velocidade, força ou mobilidade. Os motores também podem superaquecer, ativando efeitos temporários que aumentam drasticamente o poder — mas exigem cooldown.",
            image: "https://images.unsplash.com/photo-1605218427306-763f97972752?q=80&w=1200&auto=format&fit=crop"
        },
        {
            name: "Zero Gravity",
            rarity: "Épica",
            description: "O usuário pode remover completamente a gravidade de qualquer objeto que tocar, fazendo-o flutuar livremente pelo ar. Quanto mais tempo o objeto fica sem gravidade, mais leve e imprevisível ele se torna. O usuário pode acumular vários objetos flutuantes ao mesmo tempo e, quando quiser, reativar a gravidade de todos eles de uma vez, causando quedas violentas, explosões de impacto e ataques inesperados. Com treino, o usuário consegue manipular a direção, velocidade e colisão dos objetos suspensos, criando combos devastadores.",
            image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop"
        },
        // LENDÁRIA
        {
            name: "Explosion",
            rarity: "Lendária",
            description: "O usuário possui glândulas explosivas super-evoluídas capazes de gerar explosões colossais a partir do suor nitroglicerínico do corpo. Na forma Lendária, a quirk libera uma energia explosiva tão intensa que cria propulsão aérea ilimitada, impactos sísmicos, ondas de choque cortantes e explosões acumuladas capazes de devastar tudo ao redor.",
            image: "https://images.unsplash.com/photo-1496337589254-7e19d01cec44?q=80&w=1200&auto=format&fit=crop"
        },
        {
            name: "Electrik",
            rarity: "Lendária",
            description: "O usuário se transforma em uma fonte viva de energia elétrica, capaz de gerar tempestades internas e controlar eletricidade em escala massiva. Seus nervos funcionam como circuitos avançados que conduzem milhões de volts, permitindo ataques instantâneos, velocidade sobre-humana e descargas capazes de destruir tudo ao redor.",
            image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=1200&auto=format&fit=crop"
        }
    ];

    const btnContainer = document.getElementById('class-buttons');
    if(!btnContainer) return;

    const titleEl = document.getElementById('class-title');
    const descEl = document.getElementById('class-desc');
    const imgEl = document.getElementById('class-image');
    const rarityBadgeEl = document.getElementById('rarity-badge');
    
    function renderButtons(activeIndex) {
        btnContainer.innerHTML = '';
        classesData.forEach((cls, idx) => {
            const isActive = idx === activeIndex;
            const rConfig = rarityConfig[cls.rarity];
            
            const btn = document.createElement('button');
            btn.className = `w-full text-left p-3 md:p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group overflow-hidden relative ${
                isActive 
                  ? `bg-slate-900 ${rConfig.border} shadow-[0_0_15px_rgba(0,0,0,0.5)]` 
                  : 'bg-white/5 border-transparent hover:bg-white/10 hover:border-white/20'
            }`;
            
            btn.innerHTML = `
                <div class="relative z-10 flex items-center gap-3 md:gap-4">
                    <div class="w-1 h-10 md:h-12 ${isActive ? `bg-${rConfig.color.split('-')[1]}-500` : 'bg-slate-700'}"></div>
                    <div>
                        <h3 class="font-comic text-lg md:text-xl font-bold uppercase tracking-wide ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}">
                            ${cls.name}
                        </h3>
                        <span class="text-[10px] md:text-xs font-tech font-bold uppercase ${rConfig.color}">${cls.rarity}</span>
                    </div>
                </div>
            `;
            
            btn.addEventListener('click', () => updateClass(idx));
            btnContainer.appendChild(btn);
        });
        lucide.createIcons();
    }

    function updateClass(idx) {
        const cls = classesData[idx];
        const rConfig = rarityConfig[cls.rarity];

        // Animate Image Change
        imgEl.style.opacity = '0';
        setTimeout(() => {
            imgEl.src = cls.image;
            imgEl.style.opacity = '0.6';
        }, 200);

        titleEl.textContent = cls.name;
        descEl.textContent = cls.description;
        descEl.className = `text-slate-300 font-tech text-lg md:text-xl leading-relaxed border-l-4 pl-4 ${rConfig.border} bg-white/5 p-4 rounded-r-lg`;

        // Update Rarity Badge
        rarityBadgeEl.innerHTML = `
            <i data-lucide="star" class="w-4 h-4 ${rConfig.color} fill-current"></i>
            <span class="font-comic text-lg md:text-xl uppercase ${rConfig.color} tracking-widest">${cls.rarity}</span>
        `;
        rarityBadgeEl.className = `inline-flex items-center gap-2 px-3 py-1 mb-4 border ${rConfig.border} bg-black bg-opacity-80 shadow-[4px_4px_0px_#000] transform -skew-x-12`;

        renderButtons(idx);
    }
    updateClass(0);
}

// --- SCROLL REVEAL ---
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
    
    // Immediate show for hero
    setTimeout(() => {
        document.querySelectorAll('.hero-title, .hero-text, .hero-cta').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    }, 100);
}