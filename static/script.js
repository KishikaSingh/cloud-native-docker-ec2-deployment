document.addEventListener('DOMContentLoaded', function() {
    // Update length value display
    const lengthSlider = document.getElementById('length');
    const lengthValue = document.getElementById('lengthValue');
    
    if (lengthSlider && lengthValue) {
        lengthSlider.addEventListener('input', function() {
            lengthValue.textContent = this.value;
        });
    }
    
    // Password strength checker
    const passwordInput = document.getElementById('passwordInput');
    const checkerResult = document.getElementById('checkerResult');
    
    if (passwordInput && checkerResult) {
        let debounceTimer;
        
        passwordInput.addEventListener('input', function() {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(checkPasswordStrength, 500);
        });
        
        // Focus effect
        passwordInput.addEventListener('focus', function() {
            this.style.transform = 'scale(1.02)';
        });
        
        passwordInput.addEventListener('blur', function() {
            this.style.transform = 'scale(1)';
        });
    }
    
    // Add animation to generate button
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    }
    
    // Initialize tooltips
    initTooltips();
});

function copyPassword() {
    const passwordElement = document.querySelector('.password-text');
    if (!passwordElement) return;
    
    const password = passwordElement.textContent;
    
    navigator.clipboard.writeText(password)
        .then(() => {
            showNotification('Password copied to clipboard!', 'success');
            
            // Animate copy button
            const copyBtn = document.querySelector('.copy-btn i');
            if (copyBtn) {
                copyBtn.className = 'fas fa-check';
                setTimeout(() => {
                    copyBtn.className = 'far fa-copy';
                }, 2000);
            }
        })
        .catch(() => {
            showNotification('Failed to copy password', 'error');
        });
}

function refreshPassword() {
    // Add refresh animation
    const refreshBtn = document.querySelector('.refresh-btn i');
    if (refreshBtn) {
        refreshBtn.style.transform = 'rotate(360deg)';
        refreshBtn.style.transition = 'transform 0.5s ease';
        
        setTimeout(() => {
            refreshBtn.style.transform = 'rotate(0deg)';
        }, 500);
    }
    
    // Submit form to generate new password
    document.getElementById('passwordForm').submit();
}

function togglePasswordVisibility() {
    const passwordText = document.querySelector('.password-text');
    const eyeBtn = document.querySelector('.eye-btn i');
    
    if (!passwordText || !eyeBtn) return;
    
    if (passwordText.classList.contains('password-hidden')) {
        passwordText.classList.remove('password-hidden');
        eyeBtn.className = 'far fa-eye-slash';
    } else {
        passwordText.classList.add('password-hidden');
        eyeBtn.className = 'far fa-eye';
    }
}

function checkPasswordStrength() {
    const password = document.getElementById('passwordInput').value;
    const resultDiv = document.getElementById('checkerResult');
    
    if (!password.trim()) {
        resultDiv.innerHTML = '<div style="color: #94a3b8;">Enter a password to analyze its strength</div>';
        return;
    }
    
    // Show loading
    resultDiv.innerHTML = '<div style="color: #94a3b8;"><i class="fas fa-spinner fa-spin"></i> Analyzing...</div>';
    
    // Call backend API
    fetch('/api/strength', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: password })
    })
    .then(response => response.json())
    .then(data => {
        resultDiv.innerHTML = `
            <div class="strength-display">
                <div class="strength-visual">
                    <div class="strength-bar" style="background: ${data.color}; width: ${
                        data.strength === 'Very Weak' ? '20%' :
                        data.strength === 'Weak' ? '40%' :
                        data.strength === 'Good' ? '60%' :
                        data.strength === 'Strong' ? '80%' : '100%'
                    }"></div>
                </div>
                <div class="strength-details">
                    <div style="color: ${data.color}; font-weight: 600;">${data.strength}</div>
                    <div>${data.entropy} bits entropy • Crack time: ${data.crack_time}</div>
                    <div class="password-features">
                        <span class="feature ${data.has_lower ? 'active' : ''}">
                            <i class="fas fa-${data.has_lower ? 'check-circle' : 'times-circle'}"></i> Lowercase
                        </span>
                        <span class="feature ${data.has_upper ? 'active' : ''}">
                            <i class="fas fa-${data.has_upper ? 'check-circle' : 'times-circle'}"></i> Uppercase
                        </span>
                        <span class="feature ${data.has_digit ? 'active' : ''}">
                            <i class="fas fa-${data.has_digit ? 'check-circle' : 'times-circle'}"></i> Numbers
                        </span>
                        <span class="feature ${data.has_special ? 'active' : ''}">
                            <i class="fas fa-${data.has_special ? 'check-circle' : 'times-circle'}"></i> Special
                        </span>
                    </div>
                </div>
            </div>
        `;
    })
    .catch(error => {
        resultDiv.innerHTML = '<div style="color: #ef4444;">Error analyzing password</div>';
    });
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        ${message}
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function initTooltips() {
    // Add tooltips to buttons
    const buttons = document.querySelectorAll('[title]');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', createTooltip);
        button.addEventListener('mouseleave', removeTooltip);
    });
}

function createTooltip(e) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = this.getAttribute('title');
    tooltip.style.cssText = `
        position: absolute;
        background: #1e293b;
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 0.85rem;
        white-space: nowrap;
        z-index: 1000;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = this.getBoundingClientRect();
    tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
    tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
    
    this._tooltip = tooltip;
}

function removeTooltip() {
    if (this._tooltip) {
        document.body.removeChild(this._tooltip);
        this._tooltip = null;
    }
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .password-features {
        display: flex;
        gap: 15px;
        margin-top: 10px;
        flex-wrap: wrap;
    }
    
    .feature.active {
        color: #10b981;
    }
    
    .strength-visual {
        height: 8px;
        background: #334155;
        border-radius: 4px;
        margin-bottom: 10px;
        overflow: hidden;
    }
    
    .tooltip::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: #1e293b transparent transparent transparent;
    }
`;
document.head.appendChild(style);
