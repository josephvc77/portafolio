export function initMenu(): void {
    const mobileToggle = document.querySelector('.mobile-toggle') as HTMLElement | null;
    const mobileClose = document.querySelector('.mobile-close') as HTMLElement | null;
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    
    let originalTrigger: HTMLElement | null = null;
    
    function getFocusableElements(container: HTMLElement): HTMLElement[] {
        return Array.from(
            container.querySelectorAll<HTMLElement>(
                'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]'
            )
        );
    }
    
    function focusTrapListener(e: KeyboardEvent): void {
        if (!mobileMenu) return;
        
        if (e.key === 'Tab') {
            const focusables = getFocusableElements(mobileMenu);
            if (focusables.length === 0) {
                e.preventDefault();
                return;
            }
            
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            
            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === first) {
                    last.focus();
                    e.preventDefault();
                }
            } else {
                // Tab
                if (document.activeElement === last) {
                    first.focus();
                    e.preventDefault();
                }
            }
        } else if (e.key === 'Escape') {
            closeMenu();
        }
    }
    
    function openMenu(): void {
        if (mobileMenu) {
            mobileMenu.classList.add('active');
            mobileMenu.setAttribute('aria-hidden', 'false');
            if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'true');
            originalTrigger = document.activeElement as HTMLElement | null;
            
            // Focus on close button first
            if (mobileClose) {
                mobileClose.focus();
            }
            
            document.addEventListener('keydown', focusTrapListener);
        }
    }
    
    function closeMenu(): void {
        if (mobileMenu) {
            mobileMenu.classList.remove('active');
            mobileMenu.setAttribute('aria-hidden', 'true');
            if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
            
            document.removeEventListener('keydown', focusTrapListener);
            
            // Restore focus
            if (originalTrigger) {
                originalTrigger.focus();
            }
        }
    }
    
    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', () => {
            openMenu();
        });
    }
    
    if (mobileClose) {
        mobileClose.addEventListener('click', () => {
            closeMenu();
        });
    }
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });
}
