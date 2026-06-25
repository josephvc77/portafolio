export function initAnimations(): void {
    // 1. Intersection Observer para Revelar Elementos al hacer Scroll (.scroll-reveal)
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    function animateSkillsBadges(): void {
        const badges = document.querySelectorAll<HTMLElement>('.skill-badge');
        badges.forEach((badge, index) => {
            badge.style.opacity = '0';
            badge.style.transform = 'translateY(15px) scale(0.9)';
            badge.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            
            setTimeout(() => {
                badge.style.opacity = '1';
                badge.style.transform = 'translateY(0) scale(1)';
            }, index * 25); // Animación escalonada secuencial
        });
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Si es la sección de Skills, disparar la animación de los badges
                if (entry.target.id === 'skills') {
                    animateSkillsBadges();
                }
                
                observer.unobserve(entry.target); // Solo revelar una vez para mejor rendimiento
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 2. Intersection Observer para Sincronización Activa de Enlaces del Menú
    // Esto reemplaza al listener de scroll ineficiente con offsetTop
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll<HTMLElement>('.nav-link');
    
    const activeSectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                if (!activeId) return;
                
                navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href && href.slice(1) === activeId) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, {
        // Marcamos activo cuando la sección ocupa la mayor parte del viewport medio
        threshold: 0.25,
        rootMargin: '-20% 0px -60% 0px' // centrar la ventana de observación
    });

    sections.forEach(section => {
        activeSectionObserver.observe(section);
    });
}
