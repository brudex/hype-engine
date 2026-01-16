/**
 * Authentication Client-side JavaScript
 * Handles password toggle, validation, and form interactions
 */

(function() {
    'use strict';
    
    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        initializePasswordToggles();
        initializePasswordValidation();
        initializeFormValidation();
    });

    /**
     * Initialize password toggle functionality
     */
    function initializePasswordToggles() {
        const passwordToggles = document.querySelectorAll('.password-toggle[data-toggle-password]');
        
        passwordToggles.forEach(function(toggle) {
            toggle.addEventListener('click', function() {
                const inputId = this.getAttribute('data-toggle-password');
                togglePassword(inputId);
            });
        });
    }

    /**
     * Toggle password visibility
     * @param {string} inputId - The ID of the password input field
     */
    function togglePassword(inputId) {
        const input = document.getElementById(inputId);
        const icon = document.getElementById(inputId + '-toggle-icon');
        
        if (!input || !icon) {
            console.error('Password toggle elements not found for:', inputId);
            return;
        }
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('bi-eye');
            icon.classList.add('bi-eye-slash');
            input.setAttribute('aria-label', 'Password is visible');
        } else {
            input.type = 'password';
            icon.classList.remove('bi-eye-slash');
            icon.classList.add('bi-eye');
            input.setAttribute('aria-label', 'Password is hidden');
        }
    }

    /**
     * Initialize password validation (for register page)
     */
    function initializePasswordValidation() {
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        
        if (passwordInput) {
            passwordInput.addEventListener('input', validatePassword);
        }
        
        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', validatePasswordMatch);
        }
    }

    /**
     * Validate password strength
     */
    function validatePassword() {
        const password = document.getElementById('password');
        if (!password) return;
        
        const passwordValue = password.value;
        const strengthText = document.getElementById('password-strength');
        const confirmPassword = document.getElementById('confirmPassword');
        
        if (passwordValue.length === 0) {
            if (strengthText) strengthText.textContent = '';
            return;
        }
        
        let strength = 0;
        let feedback = [];
        
        if (passwordValue.length >= 8) strength++;
        else feedback.push('At least 8 characters');
        
        if (/[a-z]/.test(passwordValue)) strength++;
        else feedback.push('Lowercase letter');
        
        if (/[A-Z]/.test(passwordValue)) strength++;
        else feedback.push('Uppercase letter');
        
        if (/[0-9]/.test(passwordValue)) strength++;
        else feedback.push('Number');
        
        if (/[^a-zA-Z0-9]/.test(passwordValue)) strength++;
        else feedback.push('Special character');
        
        const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
        const strengthColors = ['#FF0000', '#FF6B6B', '#FFC107', '#00EFFF', '#C6FF00', '#C6FF00'];
        
        if (strengthText) {
            strengthText.textContent = 'Strength: ' + strengthLabels[strength - 1];
            strengthText.style.color = strengthColors[strength - 1] || '#FF0000';
            
            if (feedback.length > 0) {
                strengthText.textContent += ' (Missing: ' + feedback.join(', ') + ')';
            }
        }
        
        // Re-validate password match if confirm password has value
        if (confirmPassword && confirmPassword.value) {
            validatePasswordMatch();
        }
    }

    /**
     * Validate password match
     */
    function validatePasswordMatch() {
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirmPassword');
        const feedback = document.getElementById('confirmPassword-feedback');
        
        if (!password || !confirmPassword) return;
        
        if (confirmPassword.value && password.value !== confirmPassword.value) {
            confirmPassword.setCustomValidity('Passwords do not match');
            confirmPassword.classList.add('is-invalid');
            if (feedback) feedback.style.display = 'block';
        } else {
            confirmPassword.setCustomValidity('');
            confirmPassword.classList.remove('is-invalid');
            if (feedback) feedback.style.display = 'none';
        }
    }

    /**
     * Initialize form validation
     */
    function initializeFormValidation() {
        const forms = document.querySelectorAll('form[novalidate]');
        
        Array.from(forms).forEach(function(form) {
            form.addEventListener('submit', function(event) {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                
                form.classList.add('was-validated');
            }, false);
        });
    }

    // Export functions for global access if needed
    window.authClient = {
        togglePassword: togglePassword,
        validatePassword: validatePassword,
        validatePasswordMatch: validatePasswordMatch
    };
})();

