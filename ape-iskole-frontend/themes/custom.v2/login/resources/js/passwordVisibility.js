document.addEventListener('DOMContentLoaded', function() {
    const passwordToggle = document.querySelector('[data-password-toggle]');
    const passwordInput = document.getElementById('password');
    
    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Toggle icon
            const svg = this.querySelector('svg');
            if (type === 'text') {
                svg.innerHTML = `
                    <path d="M13.875 18.825C12.65 19.125 11.35 19.125 10.125 18.825C6.125 18.125 3.75 15 2.75 12C3.75 9 6.125 5.875 10.125 5.175C11.35 4.875 12.65 4.875 13.875 5.175C17.875 5.875 20.25 9 21.25 12C20.25 15 17.875 18.125 13.875 18.825Z" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M2 2L22 22" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                `;
                this.setAttribute('aria-label', 'Hide password');
            } else {
                svg.innerHTML = `
                    <path d="M1.66797 10C1.66797 10 4.16797 4.16666 10.0013 4.16666C15.8346 4.16666 18.3346 10 18.3346 10C18.3346 10 15.8346 15.8333 10.0013 15.8333C4.16797 15.8333 1.66797 10 1.66797 10Z" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                `;
                this.setAttribute('aria-label', 'Show password');
            }
        });
    }
    
    // Add enter key submission
    document.querySelectorAll('.form-input').forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !this.closest('.form-actions')) {
                e.preventDefault();
                const form = document.getElementById('kc-form-login');
                if (form) {
                    form.dispatchEvent(new Event('submit'));
                }
            }
        });
    });
});