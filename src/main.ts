import './styles.css';

import { initTheme } from './modules/theme';
import { initCursor } from './modules/cursor';
import { initMenu } from './modules/menu';
import { initSkillsFiltering } from './modules/skills';
import { initSimulators } from './modules/simulators';
import { initTerminal } from './modules/terminal';
import { initAnimations } from './modules/animations';
import { initEmailCopy, showToast } from './modules/utils';

declare const lucide: any;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializar Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Inicializar Módulos de Lógica Modular
    initTheme();
    initCursor();
    initMenu();
    initSkillsFiltering();
    initSimulators();
    initTerminal();
    initAnimations();
    initEmailCopy();

    // 3. Control del Loader Inicial
    const loader = document.getElementById('loader');
    setTimeout(() => {
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 800);
        }
    }, 2400);

    // 4. Grid radial interactivo
    const gridGlow = document.getElementById('grid-glow');
    document.addEventListener('mousemove', (e: MouseEvent) => {
        if (gridGlow) {
            gridGlow.style.transform = `translate(${e.clientX - 400}px, ${e.clientY - 400}px)`;
        }
    });

    // 5. Progreso de lectura del scroll
    const scrollProgress = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progressPercent = (scrollTop / docHeight) * 100;
        
        if (scrollProgress) {
            scrollProgress.style.width = `${progressPercent}%`;
        }
    });

    // 6. Formulario de Contacto
    const contactForm = document.getElementById('contact-form') as HTMLFormElement | null;
    const btnSubmit = document.getElementById('btn-submit') as HTMLButtonElement | null;

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (btnSubmit) {
                const origText = btnSubmit.innerHTML;
                btnSubmit.innerHTML = `<span>Enviando mensaje...</span> <i class="lucide-refresh-cw animate-spin" style="width:16px; height:16px;"></i>`;
                btnSubmit.disabled = true;
                
                const formData = new FormData(contactForm);
                
                fetch('/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams(formData as any).toString()
                })
                .then(response => {
                    if (response.ok) {
                        btnSubmit.innerHTML = `<span>¡Enviado con éxito!</span> <i class="lucide-check-circle" style="width:16px; height:16px; color:#39ff14;"></i>`;
                        showToast('¡Mensaje enviado con éxito a través de Netlify Forms!', 'success');
                        contactForm.reset();
                    } else {
                        throw new Error('Error en respuesta');
                    }
                })
                .catch(() => {
                    btnSubmit.innerHTML = `<span>Error al enviar</span> <i class="lucide-alert-triangle" style="width:16px; height:16px; color:#ff3b30;"></i>`;
                    showToast('Hubo un error al enviar el mensaje. Por favor, reinténtalo.', 'error');
                })
                .finally(() => {
                    setTimeout(() => {
                        btnSubmit.innerHTML = origText;
                        btnSubmit.disabled = false;
                    }, 5000);
                });
            }
        });
    }

    // 7. Descarga de CV Animada
    const downloadCvBtn = document.getElementById('download-cv');
    if (downloadCvBtn) {
        downloadCvBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const notification = document.createElement('div');
            notification.style.position = 'fixed';
            notification.style.bottom = '30px';
            notification.style.right = '30px';
            notification.style.background = 'rgba(10, 12, 16, 0.9)';
            notification.style.border = '1px solid var(--border-card-hover)';
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
            
            notification.innerHTML = `<i class="lucide-sparkles" style="color:var(--color-accent); width:18px; height:18px;"></i> <span>Generando CV de Joseph Valencia Cisneros...</span>`;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.transform = 'translateY(0)';
                notification.style.opacity = '1';
            }, 100);
            
            setTimeout(() => {
                notification.innerHTML = `<i class="lucide-check-circle" style="color:#39ff14; width:18px; height:18px;"></i> <span>¡CV listo! Descargando...</span>`;
                
                const realLink = document.createElement("a");
                realLink.href = "CV_Joseph_Valencia_Cisneros.pdf";
                realLink.download = "CV_Joseph_Valencia_Cisneros.pdf";
                document.body.appendChild(realLink);
                realLink.click();
                document.body.removeChild(realLink);
                
                setTimeout(() => {
                    notification.style.transform = 'translateY(100px)';
                    notification.style.opacity = '0';
                    setTimeout(() => {
                        document.body.removeChild(notification);
                    }, 500);
                }, 3000);
            }, 1500);
        });
    }
});
