/**
 * AyushConnect Session Manager
 * Handles authentication state in the main application
 * Version: 2.0.0
 */

class AyushSessionManager {
    constructor() {
        this.config = {
            sessionKey: 'ayush_auth_session',
            loginUrl: 'login.html',
            checkInterval: 60000, // 1 minute
            warningThreshold: 5 * 60 * 1000 // 5 minutes
        };
        
        this.currentSession = null;
        this.sessionTimer = null;
        this.warningShown = false;
        
        this.init();
    }
    
    init() {
        console.log('🔐 AyushConnect Session Manager v2.0.0 - PROTOTYPE MODE');
        
        // PROTOTYPE MODE: Skip authentication check
        // if (!this.checkAuthentication()) {
        //     return; // Will redirect to login
        // }
        
        console.log('⚠️ Running in PROTOTYPE MODE - Authentication disabled');
        
        // Setup session monitoring
        this.setupSessionMonitoring();
        this.updateUserInterface();
        this.setupEventListeners();
        
        console.log('✅ Session manager initialized');
    }
    
    checkAuthentication() {
        // PROTOTYPE MODE: Always return true
        console.log('🎯 PROTOTYPE MODE: Authentication bypassed');
        return true;
        
        // Original authentication code (disabled for prototype)
        try {
            const sessionData = localStorage.getItem(this.config.sessionKey);
            
            if (!sessionData) {
                console.log('❌ No session found, redirecting to login');
                this.redirectToLogin();
                return false;
            }
            
            const session = JSON.parse(sessionData);
            const now = new Date();
            const expiresAt = new Date(session.expiresAt);
            
            if (now >= expiresAt) {
                console.log('⏰ Session expired, redirecting to login');
                this.clearSession();
                this.redirectToLogin();
                return false;
            }
            
            // Update last activity
            session.lastActivity = new Date().toISOString();
            localStorage.setItem(this.config.sessionKey, JSON.stringify(session));
            
            this.currentSession = session;
            console.log('✅ Valid session found:', session.user.name || session.user.id);
            
            return true;
            
        } catch (error) {
            console.error('❌ Session validation error:', error);
            this.clearSession();
            this.redirectToLogin();
            return false;
        }
    }
    
    setupSessionMonitoring() {
        // PROTOTYPE MODE: Disable periodic authentication checks
        console.log('🎯 PROTOTYPE MODE: Session monitoring disabled');
        
        // Original session monitoring (disabled for prototype)
        // setInterval(() => {
        //     if (!this.checkAuthentication()) {
        //         return; // Will redirect if session invalid
        //     }
        //     
        //     this.updateSessionTimer();
        //     this.checkSessionWarning();
        //     
        // }, this.config.checkInterval);
        
        // Update timer display every second
        this.sessionTimer = setInterval(() => {
            this.updateSessionTimer();
        }, 1000);
    }
    
    updateUserInterface() {
        if (!this.currentSession) return;
        
        const userSession = document.getElementById('userSession');
        const userName = document.getElementById('userName');
        const userRole = document.getElementById('userRole');
        
        if (userSession) {
            // Show user session info
            userSession.classList.remove('hidden');
            
            // Update user details
            if (userName) {
                userName.textContent = this.currentSession.user.name || 
                                     this.currentSession.user.id || 
                                     'Authenticated User';
            }
            
            if (userRole) {
                const roleText = this.formatUserRole();
                userRole.textContent = roleText;
            }
        }
    }
    
    formatUserRole() {
        const session = this.currentSession;
        
        if (session.authType === 'abha') {
            return `${session.user.specialty} Specialist`;
        } else if (session.authType === 'oauth') {
            return session.user.role || 'OAuth User';
        }
        
        return 'Authenticated';
    }
    
    updateSessionTimer() {
        if (!this.currentSession) return;
        
        const now = new Date();
        const expiresAt = new Date(this.currentSession.expiresAt);
        const remainingMs = expiresAt.getTime() - now.getTime();
        
        const sessionTimerEl = document.getElementById('sessionTimer');
        if (sessionTimerEl && remainingMs > 0) {
            const minutes = Math.floor(remainingMs / (60 * 1000));
            const seconds = Math.floor((remainingMs % (60 * 1000)) / 1000);
            sessionTimerEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            // Change color based on time remaining
            const sessionTimeBtn = document.getElementById('sessionTimeBtn');
            if (sessionTimeBtn) {
                if (remainingMs <= this.warningThreshold) {
                    sessionTimeBtn.classList.add('warning');
                } else {
                    sessionTimeBtn.classList.remove('warning');
                }
            }
        }
    }
    
    checkSessionWarning() {
        if (!this.currentSession || this.warningShown) return;
        
        const now = new Date();
        const expiresAt = new Date(this.currentSession.expiresAt);
        const remainingMs = expiresAt.getTime() - now.getTime();
        
        if (remainingMs <= this.warningThreshold && remainingMs > 0) {
            this.showSessionWarning(Math.ceil(remainingMs / (60 * 1000)));
            this.warningShown = true;
        }
    }
    
    showSessionWarning(minutesLeft) {
        const warning = `⚠️ Your session will expire in ${minutesLeft} minutes. Please save your work.`;
        
        // Create toast notification
        this.showToast(warning, 'warning', 10000);
        
        console.warn('Session warning:', warning);
        
        // Log audit event
        this.auditLog('session_warning_shown', {
            minutesRemaining: minutesLeft,
            timestamp: new Date().toISOString()
        });
    }
    
    setupEventListeners() {
        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }
        
        // Session time button (extend session)
        const sessionTimeBtn = document.getElementById('sessionTimeBtn');
        if (sessionTimeBtn) {
            sessionTimeBtn.addEventListener('click', () => this.showSessionDetails());
        }
        
        // Activity tracking for session extension
        this.setupActivityTracking();
        
        // Before unload warning
        window.addEventListener('beforeunload', (e) => {
            this.auditLog('page_unload', {
                timestamp: new Date().toISOString()
            });
        });
    }
    
    setupActivityTracking() {
        // Track user activity to extend session
        const activityEvents = ['click', 'keypress', 'scroll', 'mousemove'];
        let lastActivity = Date.now();
        
        const trackActivity = () => {
            const now = Date.now();
            if (now - lastActivity > 30000) { // Only log every 30 seconds
                lastActivity = now;
                this.updateLastActivity();
            }
        };
        
        activityEvents.forEach(event => {
            document.addEventListener(event, trackActivity, { passive: true });
        });
    }
    
    updateLastActivity() {
        if (!this.currentSession) return;
        
        this.currentSession.lastActivity = new Date().toISOString();
        localStorage.setItem(this.config.sessionKey, JSON.stringify(this.currentSession));
        
        this.auditLog('user_activity', {
            timestamp: this.currentSession.lastActivity
        });
    }
    
    showSessionDetails() {
        if (!this.currentSession) return;
        
        const details = `
Session Information:
• User: ${this.currentSession.user.name || this.currentSession.user.id}
• Type: ${this.currentSession.authType.toUpperCase()}
• License: ${this.maskLicenseNumber(this.currentSession.licenseNumber)}
• Started: ${new Date(this.currentSession.createdAt).toLocaleString()}
• Expires: ${new Date(this.currentSession.expiresAt).toLocaleString()}
• Last Activity: ${new Date(this.currentSession.lastActivity).toLocaleString()}
        `;
        
        alert(details);
        
        this.auditLog('session_details_viewed', {
            timestamp: new Date().toISOString()
        });
    }
    
    handleLogout() {
        const confirmed = confirm('Are you sure you want to logout? Any unsaved work will be lost.');
        
        if (confirmed) {
            this.auditLog('user_initiated_logout', {
                timestamp: new Date().toISOString()
            });
            
            this.clearSession();
            this.showToast('✅ Logged out successfully', 'success', 3000);
            
            setTimeout(() => {
                this.redirectToLogin();
            }, 1000);
        }
    }
    
    clearSession() {
        if (this.currentSession) {
            this.auditLog('session_cleared', {
                sessionId: this.currentSession.id,
                duration: Date.now() - new Date(this.currentSession.createdAt).getTime(),
                timestamp: new Date().toISOString()
            });
        }
        
        localStorage.removeItem(this.config.sessionKey);
        this.currentSession = null;
        
        if (this.sessionTimer) {
            clearInterval(this.sessionTimer);
            this.sessionTimer = null;
        }
    }
    
    redirectToLogin() {
        window.location.href = this.config.loginUrl;
    }
    
    // Utility Methods
    maskLicenseNumber(license) {
        if (!license) return '';
        const parts = license.split('/');
        if (parts.length === 4) {
            return `${parts[0]}/${parts[1]}/${parts[2]}/******`;
        }
        return license.substring(0, 6) + '******';
    }
    
    auditLog(action, data = {}) {
        const auditEntry = {
            timestamp: new Date().toISOString(),
            action: action,
            sessionId: this.currentSession?.id || 'anonymous',
            userAgent: navigator.userAgent,
            data: data
        };
        
        console.log('📋 Audit:', action, data);
        
        // In production, send to audit endpoint
        // this.sendAuditLog(auditEntry);
    }
    
    showToast(message, type = 'info', duration = 5000) {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type}`;
        toast.textContent = message;
        
        // Add to container or body
        let container = document.getElementById('toastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastContainer';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        
        container.appendChild(toast);
        
        // Remove after duration
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, duration);
    }
    
    // Public API for other scripts
    getSession() {
        return this.currentSession;
    }
    
    isAuthenticated() {
        return this.currentSession !== null;
    }
    
    getUserInfo() {
        return this.currentSession?.user || null;
    }
    
    hasScope(scope) {
        return this.currentSession?.scopes?.includes(scope) || false;
    }
    
    extendSession(additionalMinutes = 30) {
        if (!this.currentSession) return false;
        
        const newExpiryTime = new Date(Date.now() + (additionalMinutes * 60 * 1000));
        this.currentSession.expiresAt = newExpiryTime.toISOString();
        localStorage.setItem(this.config.sessionKey, JSON.stringify(this.currentSession));
        
        this.auditLog('session_extended', {
            additionalMinutes: additionalMinutes,
            newExpiry: this.currentSession.expiresAt,
            timestamp: new Date().toISOString()
        });
        
        this.warningShown = false; // Reset warning flag
        return true;
    }
}

// Initialize session manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if not on login page
    if (!window.location.pathname.includes('login.html')) {
        window.ayushSession = new AyushSessionManager();
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AyushSessionManager;
}