import { showToast } from './utils';

export function initTheme(): void {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'dark'; // default dark

    // Aplicar el tema guardado al iniciar
    document.documentElement.setAttribute('data-theme', currentTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const activeTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = activeTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            showToast(
                newTheme === 'dark' ? 'Modo oscuro activado (Estilo Linear)' : 'Modo claro activado (Estilo Apple)',
                'info'
            );
        });
    }
}
