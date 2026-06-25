import { showToast } from './utils';

declare const lucide: any;

export function initCursor(): void {
    const cursor = document.getElementById('cursor');
    const cursorGlow = document.getElementById('cursor-glow');
    const cursorToggleBtn = document.getElementById('cursor-toggle');
    
    let cursorEnabled = localStorage.getItem('custom-cursor') !== 'false'; // default true
    let mouseX = 0, mouseY = 0; // Coordenadas del ratón reales
    let glowX = 0, glowY = 0;   // Coordenadas del glow con retraso (smooth)
    
    function updateCursorToggleUI(): void {
        if (cursorEnabled) {
            document.documentElement.classList.remove('no-custom-cursor');
            if (cursorToggleBtn) {
                cursorToggleBtn.classList.remove('disabled');
                cursorToggleBtn.setAttribute('aria-label', 'Desactivar cursor personalizado');
                cursorToggleBtn.innerHTML = `<i data-lucide="mouse-pointer" class="icon-cursor-on"></i>`;
            }
        } else {
            document.documentElement.classList.add('no-custom-cursor');
            if (cursorToggleBtn) {
                cursorToggleBtn.classList.add('disabled');
                cursorToggleBtn.setAttribute('aria-label', 'Activar cursor personalizado');
                cursorToggleBtn.innerHTML = `<i data-lucide="mouse-pointer-click" class="icon-cursor-off"></i>`;
            }
        }
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    if (cursorToggleBtn) {
        cursorToggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            cursorEnabled = !cursorEnabled;
            localStorage.setItem('custom-cursor', cursorEnabled ? 'true' : 'false');
            updateCursorToggleUI();
            showToast(cursorEnabled ? 'Cursor inteligente activado' : 'Cursor estándar activado', 'info');
        });
    }
    
    // Inicializar cursor
    updateCursorToggleUI();
    
    document.addEventListener('mousemove', (e: MouseEvent) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // El cursor principal sigue de inmediato al mouse
        if (cursor && cursorEnabled) {
            cursor.style.left = `${mouseX}px`;
            cursor.style.top = `${mouseY}px`;
        }
    });

    // Bucle de animación para suavizar el movimiento del Glow
    function animateCursorGlow(): void {
        if (cursorEnabled) {
            // Fórmula de interpolación lineal para retraso suave (0.15 = fricción)
            glowX += (mouseX - glowX) * 0.15;
            glowY += (mouseY - glowY) * 0.15;

            if (cursorGlow) {
                cursorGlow.style.left = `${glowX}px`;
                cursorGlow.style.top = `${glowY}px`;
            }
        }

        requestAnimationFrame(animateCursorGlow);
    }
    animateCursorGlow();

    // Efectos de Hover para enlaces y botones sobre el cursor
    const interactiveElements = document.querySelectorAll<HTMLElement>(
        'a, button, input, textarea, .stat-card, .timeline-content, .project-card, .lead-card, .skill-badge'
    );
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (cursor && cursorEnabled) cursor.classList.add('hovered');
            if (cursorGlow && cursorEnabled) cursorGlow.classList.add('hovered');
        });
        
        el.addEventListener('mouseleave', () => {
            if (cursor && cursorEnabled) cursor.classList.remove('hovered');
            if (cursorGlow && cursorEnabled) cursorGlow.classList.remove('hovered');
        });
    });
}
