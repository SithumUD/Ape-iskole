/**
 * EduTrack Pro - Custom Password Toggle & Interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    // Update page title
    updatePageTitle();
    
    // Add custom favicon
    addFavicon();
    
    // Update username field for admission/registration number
    updateUsernameField();
    
    // Create custom password toggle button
    createPasswordToggle();
    
    // Add focus animations
    addInputAnimations();
    
    // Add submit loading state
    addFormLoadingState();
    
    // Handle responsive adjustments
    handleResponsiveAdjustments();
    
    // Listen for resize events
    window.addEventListener('resize', debounce(handleResponsiveAdjustments, 250));
    
    // Listen for orientation changes
    window.addEventListener('orientationchange', function() {
        setTimeout(handleResponsiveAdjustments, 100);
    });
});

/**
 * Updates the browser tab title
 */
function updatePageTitle() {
    document.title = 'EduTrack Pro - Sign In';
}

/**
 * Adds custom favicon to the page
 */
function addFavicon() {
    // Remove existing favicons
    const existingFavicons = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]');
    existingFavicons.forEach(function(favicon) {
        favicon.remove();
    });
    
    // Get the base path from existing theme resources
    const styleSheet = document.querySelector('link[href*="EDUTrackPro"]') || 
                       document.querySelector('link[href*="styles.css"]');
    
    let faviconPath = '';
    if (styleSheet && styleSheet.href) {
        // Extract base path from stylesheet URL
        faviconPath = styleSheet.href.replace(/css\/styles\.css.*$/, 'img/favicon.svg');
    } else {
        // Fallback: construct path from current URL
        const pathParts = window.location.pathname.split('/');
        const realmIndex = pathParts.indexOf('realms');
        if (realmIndex !== -1 && pathParts[realmIndex + 1]) {
            const realm = pathParts[realmIndex + 1];
            faviconPath = window.location.origin + '/resources/' + realm + '/login/EDUTrackPro/img/favicon.svg';
        }
    }
    
    if (faviconPath) {
        const favicon = document.createElement('link');
        favicon.rel = 'icon';
        favicon.type = 'image/svg+xml';
        favicon.href = faviconPath;
        document.head.appendChild(favicon);
    }
}

/**
 * Updates username field placeholder for admission/registration number
 */
function updateUsernameField() {
    const usernameField = document.getElementById('username');
    if (usernameField) {
        
    }
}

/**
 * Creates a custom password toggle button outside the password field
 */
function createPasswordToggle() {
    const passwordField = document.getElementById('password');
    if (!passwordField) return;
    
    // Create wrapper div for password field and toggle button
    const wrapper = document.createElement('div');
    wrapper.className = 'password-wrapper';
    
    // Insert wrapper before password field
    passwordField.parentNode.insertBefore(wrapper, passwordField);
    
    // Move password field into wrapper
    wrapper.appendChild(passwordField);
    
    // Create toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'custom-pwd-toggle';
    toggleBtn.setAttribute('aria-label', 'Toggle password visibility');
    toggleBtn.innerHTML = `
        <svg class="eye-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
        </svg>
        <svg class="eye-closed" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
        </svg>
    `;
    
    // Toggle visibility on click
    toggleBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        const isPassword = passwordField.type === 'password';
        passwordField.type = isPassword ? 'text' : 'password';
        
        // Toggle button state
        if (isPassword) {
            toggleBtn.classList.add('visible');
        } else {
            toggleBtn.classList.remove('visible');
        }
        
        // Keep focus on password field
        passwordField.focus();
    });
    
    // Add toggle button to wrapper (next to password field)
    wrapper.appendChild(toggleBtn);
}

/**
 * Adds focus animations to input fields
 */
function addInputAnimations() {
    const inputs = document.querySelectorAll('input[type="text"], input[type="password"], input[type="email"]');
    
    inputs.forEach(function(input) {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('field-focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('field-focused');
        });
    });
}

/**
 * Adds loading state to form submission
 */
function addFormLoadingState() {
    const form = document.getElementById('kc-form-login');
    const submitBtn = document.getElementById('kc-login');
    
    if (!form || !submitBtn) return;
    
    form.addEventListener('submit', function() {
        submitBtn.style.opacity = '0.7';
        submitBtn.style.pointerEvents = 'none';
        submitBtn.value = 'Signing in...';
    });
}

/**
 * Handles responsive adjustments dynamically
 */
function handleResponsiveAdjustments() {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const isLandscape = window.innerWidth > window.innerHeight;
    
    // Adjust font size for very small screens to prevent zoom on iOS
    const inputs = document.querySelectorAll('input[type="text"], input[type="password"], input[type="email"]');
    if (viewportWidth <= 480) {
        inputs.forEach(function(input) {
            if (input.style.fontSize !== '16px') {
                input.style.fontSize = '16px';
            }
        });
    }
    
    // Adjust card padding for very short screens
    const contentWrapper = document.getElementById('kc-content-wrapper') || 
                          document.querySelector('.edu-card') ||
                          document.querySelector('.card-pf');
    
    if (contentWrapper && viewportHeight < 600) {
        contentWrapper.style.padding = '16px 18px';
    }
    
    // Handle viewport height for mobile browsers (address bar)
    if (viewportHeight < 500 && isLandscape) {
        document.body.style.minHeight = viewportHeight + 'px';
    }
}

/**
 * Debounce function to limit function calls
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = function() {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
