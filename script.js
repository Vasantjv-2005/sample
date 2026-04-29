// DOM Elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const rememberCheckbox = document.getElementById('remember');
const googleBtn = document.querySelector('.google-btn');
const microsoftBtn = document.querySelector('.microsoft-btn');
const forgotPasswordLink = document.querySelector('.forgot-password');
const signupLink = document.querySelector('.signup-link a');

// Form Validation
function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

function showError(element, message) {
    element.textContent = message;
    element.style.display = 'block';
}

function hideError(element) {
    element.textContent = '';
    element.style.display = 'none';
}

function clearErrors() {
    hideError(emailError);
    hideError(passwordError);
}

// Real-time validation
emailInput.addEventListener('input', function() {
    const email = this.value.trim();
    if (email && !validateEmail(email)) {
        showError(emailError, 'Please enter a valid email address');
    } else {
        hideError(emailError);
    }
});

passwordInput.addEventListener('input', function() {
    const password = this.value;
    if (password && !validatePassword(password)) {
        showError(passwordError, 'Password must be at least 6 characters');
    } else {
        hideError(passwordError);
    }
});

// Form submission
loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    clearErrors();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const remember = rememberCheckbox.checked;
    
    let isValid = true;
    
    // Validate email
    if (!email) {
        showError(emailError, 'Email is required');
        isValid = false;
    } else if (!validateEmail(email)) {
        showError(emailError, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate password
    if (!password) {
        showError(passwordError, 'Password is required');
        isValid = false;
    } else if (!validatePassword(password)) {
        showError(passwordError, 'Password must be at least 6 characters');
        isValid = false;
    }
    
    if (isValid) {
        // Show loading state
        const loginBtn = loginForm.querySelector('.login-btn');
        const originalText = loginBtn.textContent;
        loginBtn.textContent = 'Signing in...';
        loginBtn.disabled = true;
        
        try {
            // Simulate API call
            const response = await simulateLogin(email, password, remember);
            
            if (response.success) {
                // Store session if remember is checked
                if (remember) {
                    localStorage.setItem('rememberedEmail', email);
                } else {
                    localStorage.removeItem('rememberedEmail');
                }
                
                // Redirect to dashboard or home
                showSuccessMessage('Login successful! Redirecting...');
                setTimeout(() => {
                    // window.location.href = '/dashboard';
                    console.log('Redirecting to dashboard...');
                }, 1500);
            } else {
                showError(emailError, response.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            showError(emailError, 'Network error. Please try again.');
        } finally {
            // Reset button state
            loginBtn.textContent = originalText;
            loginBtn.disabled = false;
        }
    }
});

// Simulate login API call
async function simulateLogin(email, password, remember) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication logic
    if (email === 'test@example.com' && password === 'password') {
        return {
            success: true,
            user: {
                email: email,
                name: 'Test User'
            },
            token: 'mock-jwt-token'
        };
    } else {
        return {
            success: false,
            message: 'Invalid email or password'
        };
    }
}

// Social login handlers
googleBtn.addEventListener('click', function() {
    showLoadingState(this, 'Connecting to Google...');
    
    // Simulate OAuth flow
    setTimeout(() => {
        console.log('Google OAuth initiated');
        showInfoMessage('Google OAuth would be implemented here');
        resetButtonState(this, 'Continue with Google');
    }, 1500);
});

microsoftBtn.addEventListener('click', function() {
    showLoadingState(this, 'Connecting to Microsoft...');
    
    // Simulate OAuth flow
    setTimeout(() => {
        console.log('Microsoft OAuth initiated');
        showInfoMessage('Microsoft OAuth would be implemented here');
        resetButtonState(this, 'Continue with Microsoft');
    }, 1500);
});

// Forgot password handler
forgotPasswordLink.addEventListener('click', function(e) {
    e.preventDefault();
    const email = emailInput.value.trim();
    
    if (email && validateEmail(email)) {
        showInfoMessage(`Password reset link sent to ${email}`);
    } else {
        showError(emailError, 'Please enter your email address first');
        emailInput.focus();
    }
});

// Sign up handler
signupLink.addEventListener('click', function(e) {
    e.preventDefault();
    showInfoMessage('Redirecting to sign up page...');
    // window.location.href = '/signup';
});

// Utility functions
function showLoadingState(button, text) {
    const originalText = button.textContent;
    button.textContent = text;
    button.disabled = true;
    button.dataset.originalText = originalText;
}

function resetButtonState(button, text) {
    button.textContent = text;
    button.disabled = false;
    delete button.dataset.originalText;
}

function showSuccessMessage(message) {
    showMessage(message, 'success');
}

function showInfoMessage(message) {
    showMessage(message, 'info');
}

function showErrorMessage(message) {
    showMessage(message, 'error');
}

function showMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `message ${type}`;
    messageEl.textContent = message;
    
    // Add styles
    Object.assign(messageEl.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '1000',
        maxWidth: '300px',
        wordWrap: 'break-word',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        transform: 'translateX(0)',
        transition: 'transform 0.3s ease'
    });
    
    // Set background color based on type
    switch (type) {
        case 'success':
            messageEl.style.background = '#48bb78';
            break;
        case 'error':
            messageEl.style.background = '#e53e3e';
            break;
        case 'info':
            messageEl.style.background = '#667eea';
            break;
    }
    
    // Add to page
    document.body.appendChild(messageEl);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        messageEl.style.transform = 'translateX(400px)';
        setTimeout(() => messageEl.remove(), 300);
    }, 3000);
}

// Remember me functionality
window.addEventListener('load', function() {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
        emailInput.value = rememberedEmail;
        rememberCheckbox.checked = true;
    }
    
    // Focus on email input if empty
    if (!emailInput.value) {
        emailInput.focus();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to submit form
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        loginForm.dispatchEvent(new Event('submit'));
    }
    
    // Escape to clear form
    if (e.key === 'Escape') {
        loginForm.reset();
        clearErrors();
    }
});

// Password visibility toggle (optional enhancement)
function addPasswordToggle() {
    const passwordGroup = passwordInput.parentElement;
    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'password-toggle';
    toggleBtn.innerHTML = '👁️';
    toggleBtn.setAttribute('aria-label', 'Toggle password visibility');
    
    Object.assign(toggleBtn.style, {
        position: 'absolute',
        right: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px',
        padding: '4px'
    });
    
    passwordGroup.style.position = 'relative';
    passwordGroup.appendChild(toggleBtn);
    
    toggleBtn.addEventListener('click', function() {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        this.innerHTML = type === 'password' ? '👁️' : '👁️‍🗨️';
    });
}

// Initialize password toggle
addPasswordToggle();

// Console log for debugging
console.log('Login page script loaded successfully');