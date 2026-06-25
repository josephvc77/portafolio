declare const lucide: any;

export function showToast(message: string, type: 'success' | 'info' | 'error' = 'success'): void {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const iconName = type === 'success' ? 'check-circle' : 'info';
    const iconClass = type === 'success' ? 'toast-icon-success' : 'toast-icon-info';
    
    toast.innerHTML = `
        <i data-lucide="${iconName}" class="${iconClass}"></i>
        <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Animación de entrada
    setTimeout(() => {
        toast.classList.add('show');
    }, 50);
    
    // Eliminar después de 3.5 segundos
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 400);
    }, 3500);
}

export function initEmailCopy(): void {
    const btnCopyEmail = document.getElementById('btn-copy-email');
    if (btnCopyEmail) {
        btnCopyEmail.addEventListener('click', (e) => {
            e.stopPropagation();
            navigator.clipboard.writeText('noskedev@gmail.com')
                .then(() => {
                    showToast('¡Correo copiado al portapapeles con éxito!', 'success');
                })
                .catch(() => {
                    showToast('Error al copiar correo al portapapeles', 'error');
                });
        });
    }
}
