import { showToast } from './utils';

export function initSkillsFiltering(): void {
    const skillBadges = document.querySelectorAll<HTMLElement>('.skill-badge');
    const projectCards = document.querySelectorAll<HTMLElement>('.project-card');
    const timelineItems = document.querySelectorAll<HTMLElement>('.timeline-item');
    
    function clearFilters(): void {
        skillBadges.forEach(b => b.classList.remove('active'));
        projectCards.forEach(card => {
            card.classList.remove('dimmed', 'highlighted');
        });
        timelineItems.forEach(item => {
            item.classList.remove('dimmed', 'highlighted');
        });
    }

    skillBadges.forEach(badge => {
        badge.addEventListener('click', (e) => {
            e.stopPropagation();
            const tech = badge.getAttribute('data-tech');
            if (!tech) return;
            
            const isActive = badge.classList.contains('active');
            
            // Desactivar todas las habilidades
            skillBadges.forEach(b => b.classList.remove('active'));
            
            if (!isActive) {
                // Activar la actual
                badge.classList.add('active');
                
                let matchCount = 0;
                
                // Filtrar proyectos
                projectCards.forEach(card => {
                    const techList = card.getAttribute('data-tech') || '';
                    if (techList.split(' ').includes(tech)) {
                        card.classList.add('highlighted');
                        card.classList.remove('dimmed');
                        matchCount++;
                    } else {
                        card.classList.add('dimmed');
                        card.classList.remove('highlighted');
                    }
                });
                
                // Filtrar timeline (experiencia)
                timelineItems.forEach(item => {
                    const techList = item.getAttribute('data-tech') || '';
                    if (techList.split(' ').includes(tech)) {
                        item.classList.add('highlighted');
                        item.classList.remove('dimmed');
                    } else {
                        item.classList.add('dimmed');
                        item.classList.remove('highlighted');
                    }
                });
                
                showToast(`Filtrando por "${badge.textContent?.trim()}" (${matchCount} coincidencias)`, 'info');
            } else {
                // Desactivar filtro
                clearFilters();
                showToast('Filtro de habilidades desactivado', 'info');
            }
        });
    });
    
    // Si el usuario hace clic fuera de una sección de habilidades, limpiar filtros
    document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (!target.closest('.skills-badges-wrapper')) {
            // Solo limpiar si hay algún filtro activo
            if (document.querySelector('.skill-badge.active')) {
                clearFilters();
                showToast('Filtros restaurados', 'info');
            }
        }
    });
}
