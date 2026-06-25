
export function initTerminal(): void {
    // Pestañas
    const mockupTabs = document.querySelectorAll<HTMLElement>('.mockup-tab');
    mockupTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');
            if (!targetTab) return;
            
            // Desactivar todos
            document.querySelectorAll('.mockup-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.mockup-tab-content').forEach(c => c.classList.remove('active'));
            
            // Activar actual
            tab.classList.add('active');
            const contentEl = document.getElementById(`tab-${targetTab}`);
            if (contentEl) {
                contentEl.classList.add('active');
            }
            
            // Si es terminal, dar foco
            if (targetTab === 'terminal') {
                const termInput = document.getElementById('terminal-input') as HTMLInputElement | null;
                if (termInput) termInput.focus();
            }
        });
    });

    // Motor de comandos de la Terminal
    const termInput = document.getElementById('terminal-input') as HTMLInputElement | null;
    const termOutput = document.getElementById('terminal-output');
    
    if (termInput && termOutput) {
        termInput.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                const cmd = termInput.value.trim().toLowerCase();
                termInput.value = '';
                
                // Agregar línea de comando escrita
                const cmdLine = document.createElement('div');
                cmdLine.innerHTML = `<span class="terminal-prompt">guest@jvc-portfolio:~$</span> ${cmd}`;
                termOutput.appendChild(cmdLine);
                
                // Procesar comando
                const outputLine = document.createElement('div');
                
                switch (cmd) {
                    case 'help':
                        outputLine.innerHTML = `
                            Comandos disponibles:<br>
                            - <span class="terminal-highlight">skills</span>: Ver competencias técnicas principales.<br>
                            - <span class="terminal-highlight">experience</span>: Ver trayectoria profesional destacada.<br>
                            - <span class="terminal-highlight">contact</span>: Ver información de contacto y enlaces.<br>
                            - <span class="terminal-highlight">download</span>: Descargar el CV oficial en PDF.<br>
                            - <span class="terminal-highlight">clear</span>: Limpiar la pantalla.<br>
                            - <span class="terminal-highlight">help</span>: Mostrar esta ayuda.
                        `;
                        break;
                    case 'skills':
                        outputLine.innerHTML = `
                            <span class="terminal-success">Competencias Clave:</span><br>
                            • Frontend: Angular, React, TypeScript, SCSS, WCAG (Accesibilidad)<br>
                            • Backend:  Python, Django, Java, REST APIs, RBAC Security<br>
                            • DevOps:   Docker, Git/GitFlow, AWS, Azure, Linux
                        `;
                        break;
                    case 'experience':
                        outputLine.innerHTML = `
                            <span class="terminal-success">Experiencia Principal:</span><br>
                            • <span class="terminal-highlight">Líder Frontend | SEP Nayarit (2024-2026)</span>: Arquitectura del Proyecto NEN, Docker, GitFlow.<br>
                            • <span class="terminal-highlight">Frontend Engineer | SEP CDMX (2023-2026)</span>: Registro de Profesionistas (RNP) con micro-sitios.<br>
                            • <span class="terminal-highlight">Desarrollador Frontend | IA Interactive (2022-2023)</span>: Componentes en React JS.
                        `;
                        break;
                    case 'contact':
                        outputLine.innerHTML = `
                            <span class="terminal-success">Contacto:</span><br>
                            • Email: <a href="mailto:noskedev@gmail.com" class="terminal-highlight">noskedev@gmail.com</a><br>
                            • GitHub: <a href="https://github.com/josephvc77" target="_blank" class="terminal-highlight">github.com/josephvc77</a><br>
                            • LinkedIn: <a href="https://linkedin.com/in/joseph-valencia-cisneros/" target="_blank" class="terminal-highlight">linkedin.com/in/joseph-valencia-cisneros</a>
                        `;
                        break;
                    case 'download':
                        outputLine.className = 'terminal-success';
                        outputLine.textContent = 'Iniciando descarga del CV en PDF...';
                        const dlBtn = document.getElementById('download-cv') as HTMLElement | null;
                        if (dlBtn) dlBtn.click();
                        break;
                    case 'clear':
                        termOutput.innerHTML = '';
                        break;
                    case '':
                        outputLine.innerHTML = '';
                        break;
                    default:
                        outputLine.className = 'terminal-error';
                        outputLine.innerHTML = `Comando no reconocido: "${cmd}". Escribe <span class="terminal-highlight">help</span> para ver comandos.`;
                }
                
                if (cmd !== 'clear' && outputLine.innerHTML !== '') {
                    termOutput.appendChild(outputLine);
                }
                
                // Auto scroll al final de la terminal
                termOutput.scrollTop = termOutput.scrollHeight;
            }
        });
    }
}
