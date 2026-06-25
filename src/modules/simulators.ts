import { showToast } from './utils';

declare const lucide: any;

export function initSimulators(): void {
    // 1. Phone Simulator (Ikigai)
    const ikigaiSendTrigger = document.getElementById('ikigai-send-trigger');
    const ikigaiChatBody = document.getElementById('ikigai-chat-body');
    const ikigaiResponses = [
        "¡Excelente! Mantener la consistencia es la clave del bienestar integral.",
        "Recuerda beber agua e hidratarte adecuadamente tras tu entrenamiento.",
        "Planifica tus comidas de mañana para mantener tu enfoque nutricional.",
        "¿Qué tal si programamos una breve sesión de meditación para cerrar el día?"
    ];
    let responseIdx = 0;
    
    if (ikigaiSendTrigger && ikigaiChatBody) {
        ikigaiSendTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Evitar clicks mientras simula
            ikigaiSendTrigger.style.pointerEvents = 'none';
            
            // Agregar mensaje de usuario
            const userMsg = document.createElement('div');
            userMsg.className = 'chat-message user';
            userMsg.textContent = '¿Cuál es mi siguiente recomendación?';
            ikigaiChatBody.appendChild(userMsg);
            ikigaiChatBody.scrollTop = ikigaiChatBody.scrollHeight;
            
            // Agregar indicador de escritura
            const typingMsg = document.createElement('div');
            typingMsg.className = 'chat-message bot typing';
            typingMsg.innerHTML = '<span></span><span></span><span></span>';
            ikigaiChatBody.appendChild(typingMsg);
            ikigaiChatBody.scrollTop = ikigaiChatBody.scrollHeight;
            
            setTimeout(() => {
                // Quitar typing
                typingMsg.remove();
                
                // Agregar respuesta bot
                const botMsg = document.createElement('div');
                botMsg.className = 'chat-message bot';
                botMsg.textContent = ikigaiResponses[responseIdx];
                responseIdx = (responseIdx + 1) % ikigaiResponses.length;
                
                ikigaiChatBody.appendChild(botMsg);
                ikigaiChatBody.scrollTop = ikigaiChatBody.scrollHeight;
                
                // Habilitar click
                ikigaiSendTrigger.style.pointerEvents = 'auto';
            }, 1500);
        });
    }

    // 2. Search Simulator (RNP)
    const rnpSearchInput = document.getElementById('rnp-search-input') as HTMLInputElement | null;
    const rnpResultsContainer = document.getElementById('rnp-results-container');
    const mockLicenses = [
        { name: 'VALENCIA CISNEROS JOSEPH', title: 'ING. EN DESARROLLO DE SOFTWARE', id: '12345678', status: 'CÉDULA ACTIVA' },
        { name: 'GARCÍA MENDOZA ANA', title: 'LIC. EN ADMINISTRACIÓN DE EMPRESAS', id: '87654321', status: 'CÉDULA ACTIVA' },
        { name: 'RODRÍGUEZ SÁNCHEZ LUIS', title: 'INGENIERÍA EN COMPUTACIÓN', id: '45678912', status: 'CÉDULA ACTIVA' },
        { name: 'MARTÍNEZ LÓPEZ MARÍA', title: 'LICENCIATURA EN DERECHO', id: '98765432', status: 'CÉDULA ACTIVA' }
    ];
    
    if (rnpSearchInput && rnpResultsContainer) {
        rnpSearchInput.addEventListener('input', () => {
            const query = rnpSearchInput.value.trim().toUpperCase();
            rnpResultsContainer.innerHTML = '';
            
            const filtered = mockLicenses.filter(lic => 
                lic.name.includes(query) || lic.id.includes(query) || lic.title.includes(query)
            );
            
            if (filtered.length > 0) {
                filtered.forEach(lic => {
                    const card = document.createElement('div');
                    card.className = 'rnp-result-card';
                    card.innerHTML = `
                         <div class="rnp-result-header">
                             <span class="rnp-badge-valid">${lic.status}</span>
                         </div>
                         <span class="rnp-result-name">${lic.name}</span>
                         <span class="rnp-result-title">${lic.title}</span>
                     `;
                    rnpResultsContainer.appendChild(card);
                });
            } else {
                rnpResultsContainer.innerHTML = `<div class="rnp-no-results">No se encontraron cédulas para tu búsqueda</div>`;
            }
        });
    }

    // 3. Properties Simulator ( SEP CDMX )
    const propItems = document.querySelectorAll<HTMLElement>('.prop-item');
    const propDetailBox = document.getElementById('prop-detail-box');
    const propData: Record<string, { code: string; area: string; rent: string; occupancy: string }> = {
        '1': { code: 'INM-001', area: '1,200 m²', rent: '$45,000 MXN/mes', occupancy: 'Oficinas administrativas y de enlace regional CDMX.' },
        '2': { code: 'INM-002', area: '3,500 m²', rent: '$110,000 MXN/mes', occupancy: 'Bodega de resguardo de material didáctico nacional.' },
        '3': { code: 'INM-003', area: '800 m²', rent: '$32,000 MXN/mes', occupancy: 'Sede de atención ciudadana y trámites de inmuebles.' },
        '4': { code: 'INM-004', area: '1,800 m²', rent: '$55,000 MXN/mes', occupancy: 'Edificio de archivo. Evaluando adecuación de oficinas.' }
    };
    
    if (propItems && propDetailBox) {
        propItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // Desmarcar anteriores
                propItems.forEach(i => i.classList.remove('active'));
                
                // Marcar actual
                item.classList.add('active');
                const id = item.getAttribute('data-id');
                if (!id) return;
                const data = propData[id];
                
                if (data) {
                    propDetailBox.innerHTML = `
                        <strong>ID:</strong> ${data.code} | <strong>Superficie:</strong> ${data.area}<br>
                        <strong>Costo:</strong> ${data.rent}<br>
                        <strong>Uso:</strong> ${data.occupancy}
                    `;
                }
            });
        });
    }

    // 4. Cinema Themes Simulator
    const themeChips = document.querySelectorAll<HTMLElement>('.theme-chip');
    const cinemaContainer = document.getElementById('cinema-preview-container');
    const cinemaTitle = document.getElementById('cinema-title');
    const cinemaDesc = document.getElementById('cinema-desc');
    const cinemaActionBtn = document.getElementById('cinema-action-btn') as HTMLElement | null;
    const cinemaGlow = document.getElementById('cinema-glow');
    
    const cinemaThemes: Record<string, { title: string; desc: string; bg: string; glow: string; btnBg: string; genre: string; genreColor: string }> = {
        interstellar: {
            title: 'Interstellar',
            desc: 'El fin de la Tierra no será el fin de la humanidad. Viaje al espacio exterior.',
            bg: '#080a0e',
            glow: 'rgba(138, 43, 226, 0.12)',
            btnBg: 'linear-gradient(135deg, var(--color-neon-purple) 0%, #a78bfa 100%)',
            genre: 'ESTRENO INMERSIVO',
            genreColor: 'var(--color-neon-purple)'
        },
        cyberpunk: {
            title: 'Cyberpunk 2077',
            desc: 'Una megalópolis obsesionada con el poder, el glamur y la modificación corporal.',
            bg: '#1a051d',
            glow: 'rgba(0, 242, 254, 0.15)',
            btnBg: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-primary) 100%)',
            genre: 'EDICIÓN ESPECIAL',
            genreColor: 'var(--color-accent)'
        },
        classic: {
            title: 'Double Indemnity',
            desc: 'Cine negro clásico. Pasión, engaño y sospechas en un ambiente retro en blanco y negro.',
            bg: '#121212',
            glow: 'rgba(255, 255, 255, 0.08)',
            btnBg: 'linear-gradient(135deg, #333 0%, #666 100%)',
            genre: 'CINE CLÁSICO',
            genreColor: '#fff'
        }
    };
    
    if (themeChips && cinemaContainer) {
        themeChips.forEach(chip => {
            chip.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // Desmarcar anteriores
                themeChips.forEach(c => c.classList.remove('active'));
                
                // Marcar actual
                chip.classList.add('active');
                const movie = chip.getAttribute('data-movie');
                if (!movie) return;
                const theme = cinemaThemes[movie];
                
                if (theme) {
                    // Aplicar estilos
                    cinemaContainer.style.background = theme.bg;
                    if (cinemaTitle) cinemaTitle.textContent = theme.title;
                    if (cinemaDesc) cinemaDesc.textContent = theme.desc;
                    if (cinemaActionBtn) cinemaActionBtn.style.background = theme.btnBg;
                    
                    const genreEl = cinemaContainer.querySelector('.cinema-genre') as HTMLElement | null;
                    if (genreEl) {
                         genreEl.textContent = theme.genre;
                         genreEl.style.color = theme.genreColor;
                    }
                    
                    if (cinemaGlow) {
                        cinemaGlow.style.background = theme.glow;
                    }
                    
                    showToast(`Tema visual de cartelera: ${theme.title}`, 'info');
                }
            });
        });
    }

    // 5. nexusBPO Simulator (Dashboard de Instalaciones)
    const nexusBtnMap = document.getElementById('nexus-btn-map');
    const nexusBtnStats = document.getElementById('nexus-btn-stats');
    const nexusContent = document.getElementById('nexus-simulator-content');

    if (nexusBtnMap && nexusBtnStats && nexusContent) {
        // Al hacer clic en Mapa
        nexusBtnMap.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (nexusBtnMap.classList.contains('active')) return;

            nexusBtnMap.classList.add('active');
            nexusBtnStats.classList.remove('active');

            nexusContent.innerHTML = `
                <!-- Vista de Mapa -->
                <div class="nexus-map-view">
                    <div class="nexus-map-grid">
                        <div class="nexus-grid-line h-1"></div>
                        <div class="nexus-grid-line h-2"></div>
                        <div class="nexus-grid-line v-1"></div>
                        <div class="nexus-grid-line v-2"></div>
                        <!-- Marcador de instalación geolocalizada 1 -->
                        <div class="nexus-marker pulse-1" style="top: 30%; left: 45%;">
                            <div class="nexus-marker-dot"></div>
                            <div class="nexus-marker-tooltip">CDMX: Corporativo A (Activo)</div>
                        </div>
                        <!-- Marcador de instalación geolocalizada 2 -->
                        <div class="nexus-marker pulse-2" style="top: 60%; left: 70%;">
                            <div class="nexus-marker-dot"></div>
                            <div class="nexus-marker-tooltip">MTY: Cedis Norte (Normal)</div>
                        </div>
                    </div>
                    <div class="nexus-map-legend">
                        <span><i data-lucide="map-pin" class="legend-icon"></i> 24 Sedes Monitoreadas</span>
                    </div>
                </div>
            `;

            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }

            showToast('Simulador nexusBPO: Vista del mapa de instalaciones georreferenciadas activa', 'info');
        });

        // Al hacer clic en Métricas
        nexusBtnStats.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (nexusBtnStats.classList.contains('active')) return;

            nexusBtnStats.classList.add('active');
            nexusBtnMap.classList.remove('active');

            nexusContent.innerHTML = `
                <!-- Vista de Métricas -->
                <div class="nexus-stats-view">
                    <div class="nexus-stat-bar-group">
                        <div class="nexus-stat-header">
                            <span class="nexus-stat-name">Uptime de Servidores</span>
                            <span class="nexus-stat-value">99.98%</span>
                        </div>
                        <div class="nexus-stat-bar-wrapper">
                            <div class="nexus-stat-bar-fill fill-uptime" style="width: 0%;"></div>
                        </div>
                    </div>
                    <div class="nexus-stat-bar-group">
                        <div class="nexus-stat-header">
                            <span class="nexus-stat-name">Cumplimiento SLA</span>
                            <span class="nexus-stat-value">98.4%</span>
                        </div>
                        <div class="nexus-stat-bar-wrapper">
                            <div class="nexus-stat-bar-fill fill-sla" style="width: 0%;"></div>
                        </div>
                    </div>
                    <div class="nexus-stat-bar-group">
                        <div class="nexus-stat-header">
                            <span class="nexus-stat-name">Tickets Resueltos</span>
                            <span class="nexus-stat-value">847 / 850</span>
                        </div>
                        <div class="nexus-stat-bar-wrapper">
                            <div class="nexus-stat-bar-fill fill-active-tickets" style="width: 0%;"></div>
                        </div>
                    </div>
                </div>
            `;

            // Ejecutar la animación de llenado de barras
            const fillUptime = nexusContent.querySelector('.fill-uptime') as HTMLElement;
            const fillSla = nexusContent.querySelector('.fill-sla') as HTMLElement;
            const fillActiveTickets = nexusContent.querySelector('.fill-active-tickets') as HTMLElement;

            setTimeout(() => {
                if (fillUptime) fillUptime.style.width = '99.98%';
                if (fillSla) fillSla.style.width = '98.4%';
                if (fillActiveTickets) fillActiveTickets.style.width = '99.6%';
            }, 50);

            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }

            showToast('Simulador nexusBPO: Métricas operativas en tiempo real de la plataforma BPO', 'info');
        });
    }
}
