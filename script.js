document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Inicializar Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Control del Loader Inicial
    const loader = document.getElementById('loader');
    setTimeout(() => {
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 800); // Dar tiempo para la transición de opacidad
        }
    }, 2400); // 2.4s coincide con la animación del progreso

    // 3. Cursor Personalizado Inteligente con Fricción Física
    const cursor = document.getElementById('cursor');
    const cursorGlow = document.getElementById('cursor-glow');
    
    let mouseX = 0, mouseY = 0; // Coordenadas del ratón reales
    let glowX = 0, glowY = 0;   // Coordenadas del glow con retraso (smooth)
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // El cursor principal sigue de inmediato al mouse
        if (cursor) {
            cursor.style.left = `${mouseX}px`;
            cursor.style.top = `${mouseY}px`;
        }
    });

    // Bucle de animación para suavizar el movimiento del Glow
    function animateCursorGlow() {
        // Fórmula de interpolación lineal para retraso suave (0.15 = fricción)
        glowX += (mouseX - glowX) * 0.15;
        glowY += (mouseY - glowY) * 0.15;

        if (cursorGlow) {
            cursorGlow.style.left = `${glowX}px`;
            cursorGlow.style.top = `${glowY}px`;
        }

        requestAnimationFrame(animateCursorGlow);
    }
    animateCursorGlow();

    // Efectos de Hover para enlaces y botones sobre el cursor
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .stat-card, .timeline-content, .project-card, .lead-card');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (cursor) cursor.classList.add('hovered');
            if (cursorGlow) cursorGlow.classList.add('hovered');
        });
        
        el.addEventListener('mouseleave', () => {
            if (cursor) cursor.classList.remove('hovered');
            if (cursorGlow) cursorGlow.classList.remove('hovered');
        });
    });

    // 4. Grid Tecnológico Interactivo (Brillo sigue al ratón en el fondo)
    const gridGlow = document.getElementById('grid-glow');
    document.addEventListener('mousemove', (e) => {
        if (gridGlow) {
            // Centrar el gradiente radial en la posición del puntero
            gridGlow.style.transform = `translate(${e.clientX - 400}px, ${e.clientY - 400}px)`;
        }
    });

    // 5. Barra de Progreso de Lectura (Reading Scroll Progress)
    const scrollProgress = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progressPercent = (scrollTop / docHeight) * 100;
        
        if (scrollProgress) {
            scrollProgress.style.width = `${progressPercent}%`;
        }
    });

    // 6. Intersection Observer para Revelar Elementos al hacer Scroll
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
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
        threshold: 0.15, // Gatillar cuando el 15% del elemento sea visible
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 7. Animación Dinámica y Stagger de Skills Badges
    function animateSkillsBadges() {
        const badges = document.querySelectorAll('.skill-badge');
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

    // 8. Sincronización Activa de Enlaces del Menú en Scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            // Si el scroll está en medio de la sección
            if (window.scrollY >= (sectionTop - 250)) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === currentSection) {
                link.classList.add('active');
            }
        });
    });

    // 9. Formulario de Contacto Premium (Stripe-Style Form Feedback)
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const btnSubmit = document.getElementById('btn-submit');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Efecto Micro-animado al presionar
            if (btnSubmit) {
                const origText = btnSubmit.innerHTML;
                btnSubmit.innerHTML = `<span>Enviando mensaje...</span> <i class="lucide-refresh-cw animate-spin" style="width:16px; height:16px;"></i>`;
                btnSubmit.disabled = true;
                
                // Simulación de envío a endpoint real de alto nivel
                setTimeout(() => {
                    btnSubmit.innerHTML = `<span>¡Enviado con éxito!</span> <i class="lucide-check-circle" style="width:16px; height:16px; color:#39ff14;"></i>`;
                    
                    if (formStatus) {
                        formStatus.className = 'form-status success';
                        formStatus.textContent = '¡Gracias Joseph! Tu mensaje ha sido enviado. Me pondré en contacto contigo a la brevedad.';
                    }
                    
                    contactForm.reset();
                    
                    setTimeout(() => {
                        btnSubmit.innerHTML = origText;
                        btnSubmit.disabled = false;
                        if (formStatus) formStatus.style.display = 'none';
                    }, 5000);
                    
                }, 2000);
            }
        });
    }

    // 10. Mock Download de CV con Alerta Premium
    const downloadCvBtn = document.getElementById('download-cv');
    if (downloadCvBtn) {
        downloadCvBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Generación de un PDF virtual de manera creativa e inmersiva
            const notification = document.createElement('div');
            notification.style.position = 'fixed';
            notification.style.bottom = '30px';
            notification.style.right = '30px';
            notification.style.background = 'rgba(10, 12, 16, 0.9)';
            notification.style.border = '1px solid var(--color-accent)';
            notification.style.padding = '15px 25px';
            notification.style.borderRadius = '12px';
            notification.style.backdropFilter = 'blur(10px)';
            notification.style.color = '#fff';
            notification.style.zIndex = '99999';
            notification.style.fontSize = '0.85rem';
            notification.style.fontFamily = 'var(--font-text)';
            notification.style.boxShadow = '0 10px 30px rgba(0,242,254,0.2)';
            notification.style.display = 'flex';
            notification.style.alignItems = 'center';
            notification.style.gap = '10px';
            notification.style.transform = 'translateY(100px)';
            notification.style.opacity = '0';
            notification.style.transition = 'var(--transition-smooth)';
            
            notification.innerHTML = `<i class="lucide-sparkles" style="color:var(--color-accent); width:18px; height:18px;"></i> <span>Generando CV de Joseph Valencia Cisneros (Senior Front-End)...</span>`;
            
            document.body.appendChild(notification);
            
            // Entrada de la notificación
            setTimeout(() => {
                notification.style.transform = 'translateY(0)';
                notification.style.opacity = '1';
            }, 100);
            
            // Simular descarga exitosa
            setTimeout(() => {
                notification.innerHTML = `<i class="lucide-check-circle" style="color:#39ff14; width:18px; height:18px;"></i> <span>¡CV generado exitosamente! Descargando...</span>`;
                
                // Simulación real de descarga del CV estructurado del usuario
                const cvText = `========================================================================
JOSEPH VALENCIA CISNEROS - SENIOR FRONTEND / LÍDER TÉCNICO FRONTEND
========================================================================

Contacto:
- Correo: joseph.valencia.cisneros@gmail.com
- Ubicación: Nayarit / CDMX / Morelia, México
- Idiomas: Español (Nativo) | Inglés B2 (Técnico / Colaboración funcional)

------------------------------------------------------------------------
PERFIL PROFESIONAL:
Frontend Senior / Líder Técnico Frontend con +3 años de experiencia en el 
diseño, desarrollo y liderazgo de aplicaciones web empresariales y 
gubernamentales de alta criticidad. Especialista en Angular, React, Python
y Django con fuerte enfoque en arquitectura frontend, performance,
escalabilidad y experiencia de usuario. 

------------------------------------------------------------------------
EXPERIENCIA PROFESIONAL:

1. Secretaría de Educación Pública (SEP) — Nayarit
   Frontend Senior / Líder Frontend | 2024 – 2026
   * Responsable técnico del Frontend del Registro Nacional de Profesionistas (RNP).
   * Liderazgo de arquitectura frontend, componentes modulares y lineamientos de código.
   * Interfaces escalables, responsivas y accesibles bajo estándares nacionales (WCAG).
   * Colaboración y resolución de incidencias en Frontend y Backend (Java).
   * Gestión de despliegues y pruebas unitarias con contenedores Docker.
   * Uso de Git / GitFlow para control de versiones y revisiones de código de alta calidad.

2. Secretaría de Educación Pública (SEP) — CDMX
   Desarrollador Full Stack | 2023 – 2026
   * Diseño y desarrollo integral de plataforma centralizada de inmuebles arrendados.
   * Definición de arquitectura modular escalable en micro-sitios.
   * Desarrollo del Backend en Python y Django, y Frontend en HTML, CSS y Bootstrap.
   * Implementación de roles de acceso seguro (RBAC), autenticación y flujos CRUD.
   * Digitalización y automatización de procesos operativos institucionales.

3. IA Interactive C — Morelia, Michoacán
   Desarrollador Frontend | 2022 – 2023
   * Componentes reutilizables en React JS para portales de lanzamientos cinematográficos.
   * Estructura dinámica en SCSS para tematización escalable por proyecto.
   * Aplicación de mejores prácticas de SEO técnico y velocidad de carga.
   * Colaboración en entornos ágiles con equipos de México, España, Honduras y Venezuela.

------------------------------------------------------------------------
EDUCACIÓN:

* Licenciatura en Ingeniería en Desarrollo y Gestión de Software
  Universidad Tecnológica de Morelia | 2021 – 2023
* Técnico Superior Universitario en Tecnologías de la Información
  Área: Desarrollo de Software Multiplataforma
  Universidad Tecnológica de Morelia | 2019 – 2021

------------------------------------------------------------------------
HABILIDADES TÉCNICAS:

* Frontend: Angular, React, JavaScript (ES6+), TypeScript, HTML5, CSS3, SASS, LESS
* Backend: Python, Django, Java, RESTful APIs, Web Services
* DevOps & Herramientas: Docker, Git, GitFlow, Visual Studio Code, IntelliJ, Jira, Figma
* Bases de Datos: PostgreSQL, MySQL, MongoDB
* Cloud: AWS (S3, EC2, RDS), Azure
* Sistemas: Windows, macOS, Linux
========================================================================`;
                const mockBlob = new Blob([cvText], { type: "text/plain;charset=utf-8" });
                const mockUrl = URL.createObjectURL(mockBlob);
                const mockLink = document.createElement("a");
                mockLink.href = mockUrl;
                mockLink.download = "CV_Joseph_Valencia_Cisneros_Senior_Frontend.txt";
                document.body.appendChild(mockLink);
                mockLink.click();
                document.body.removeChild(mockLink);
                
                setTimeout(() => {
                    notification.style.transform = 'translateY(100px)';
                    notification.style.opacity = '0';
                    setTimeout(() => {
                        document.body.removeChild(notification);
                    }, 500);
                }, 3000);
            }, 2500);
        });
    }

    // 11. Menú Móvil Toggles
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileClose = document.querySelector('.mobile-close');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileMenu.classList.add('active');
        });
    }

    if (mobileClose && mobileMenu) {
        mobileClose.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    }

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu) {
                mobileMenu.classList.remove('active');
            }
        });
    });

    // 12. Alternancia de Modo Claro/Oscuro (Theme Toggle)
    const themeToggleBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'dark';

    // Aplicar el tema guardado al iniciar
    document.documentElement.setAttribute('data-theme', currentTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const activeTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = activeTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
});
