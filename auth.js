/**
 * AyushConnect Authentication System
 * OAuth 2.0 + ABHA Integration with Audit Logging
 * Author: AyushConnect Team
 * Version: 2.0.0
 */

class AyushAuthenticator {
    constructor() {
        this.config = {
            // OAuth 2.0 Configuration
            oauth: {
                clientId: 'ayushconnect-oauth-client',
                scope: 'read:patient_data write:diagnosis access:namaste_api',
                tokenEndpoint: '/oauth/token',
                userInfoEndpoint: '/oauth/userinfo',
                tokenType: 'Bearer'
            },
            
            // ABHA Integration Configuration  
            abha: {
                apiEndpoint: 'https://healthidsbx.abdm.gov.in/api/v1',
                clientId: 'SBX_002772',
                clientSecret: 'ayushconnect_abha_secret_2024'
            },
            
            // Session Configuration
            session: {
                timeout: 30 * 60 * 1000, // 30 minutes
                refreshThreshold: 5 * 60 * 1000, // 5 minutes before expiry
                storageKey: 'ayush_auth_session'
            },
            
            // Audit Configuration
            audit: {
                enabled: true,
                endpoint: '/api/audit',
                batchSize: 10,
                flushInterval: 60 * 1000 // 1 minute
            }
        };
        
        this.currentSession = null;
        this.auditQueue = [];
        this.auditTimer = null;
        
        this.init();
    }
    
    init() {
        console.log('🔐 AyushConnect Authentication System v2.0.0');
        this.setupEventListeners();
        this.checkExistingSession();
        this.startAuditService();
    }
    
    setupEventListeners() {
        // Authentication method toggle
        const authMethodInputs = document.querySelectorAll('input[name="authMethod"]');
        authMethodInputs.forEach(input => {
            input.addEventListener('change', (e) => this.toggleAuthMethod(e.target.value));
        });
        
        // Password visibility toggles
        const toggleButtons = document.querySelectorAll('.toggle-visibility');
        toggleButtons.forEach(button => {
            button.addEventListener('click', (e) => this.togglePasswordVisibility(e));
        });
        
        // Login form submission
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        // ABHA ID formatting
        const abhaInput = document.getElementById('abhaId');
        if (abhaInput) {
            abhaInput.addEventListener('input', (e) => this.formatABHAInput(e));
        }
        
        // Session timeout warning
        this.setupSessionTimeoutWarning();
    }
    
    toggleAuthMethod(method) {
        const abhaSection = document.getElementById('abhaLoginSection');
        const tokenSection = document.getElementById('tokenLoginSection');
        const loginBtnText = document.getElementById('loginBtnText');
        
        if (method === 'abha') {
            abhaSection.classList.remove('hidden');
            tokenSection.classList.add('hidden');
            loginBtnText.textContent = 'Authenticate with ABHA';
        } else {
            abhaSection.classList.add('hidden');
            tokenSection.classList.remove('hidden');
            loginBtnText.textContent = 'Authenticate with OAuth 2.0';
        }
        
        this.auditLog('auth_method_changed', { method });
    }
    
    togglePasswordVisibility(event) {
        const button = event.currentTarget;
        const input = button.parentNode.querySelector('input');
        const icon = button.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
        
        this.auditLog('password_visibility_toggled', { 
            field: input.id,
            visible: input.type === 'text'
        });
    }
    
    formatABHAInput(event) {
        let value = event.target.value.replace(/\D/g, ''); // Remove non-digits
        
        // Format as XX-XXXX-XXXX-XXXX
        if (value.length >= 2) {
            value = value.substring(0, 2) + '-' + value.substring(2);
        }
        if (value.length >= 7) {
            value = value.substring(0, 7) + '-' + value.substring(7);
        }
        if (value.length >= 12) {
            value = value.substring(0, 12) + '-' + value.substring(12);
        }
        
        // Limit to 17 characters (14 digits + 3 hyphens)
        event.target.value = value.substring(0, 17);
    }
    
    async handleLogin(event) {
        event.preventDefault();
        
        const loginBtn = document.getElementById('loginBtn');
        const errorMessage = document.getElementById('errorMessage');
        const successMessage = document.getElementById('successMessage');
        
        // Reset messages
        this.hideMessage(errorMessage);
        this.hideMessage(successMessage);
        
        // Show loading state
        this.setLoginLoading(true);
        
        try {
            const formData = new FormData(event.target);
            const authMethod = formData.get('authMethod');
            const licenseNumber = formData.get('licenseNumber');
            const auditConsent = formData.has('auditConsent');
            
            // Validate audit consent
            if (!auditConsent) {
                throw new Error('Audit consent is required for healthcare data access');
            }
            
            // Validate license number
            if (!this.validateLicenseNumber(licenseNumber)) {
                throw new Error('Invalid medical license number format');
            }
            
            let authResult;
            
            if (authMethod === 'abha') {
                authResult = await this.authenticateWithABHA(formData);
            } else {
                authResult = await this.authenticateWithOAuth(formData);
            }
            
            // Create session
            await this.createSession(authResult, licenseNumber, auditConsent);
            
            // Show success and redirect
            this.showMessage(successMessage, '✅ Authentication successful! Redirecting...', 'success');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            
        } catch (error) {
            console.error('Authentication error:', error);
            this.showMessage(errorMessage, `❌ ${error.message}`, 'error');
            this.auditLog('authentication_failed', { 
                error: error.message,
                timestamp: new Date().toISOString()
            });
        } finally {
            this.setLoginLoading(false);
        }
    }
    
    async authenticateWithABHA(formData) {
        const abhaId = formData.get('abhaId');
        const password = formData.get('abhaPassword');
        
        this.auditLog('abha_login_attempt', { 
            abhaId: this.maskABHAId(abhaId),
            timestamp: new Date().toISOString()
        });
        
        // Validate ABHA ID format
        if (!this.validateABHAId(abhaId)) {
            throw new Error('Invalid ABHA ID format. Use XX-XXXX-XXXX-XXXX');
        }
        
        // Demo authentication (replace with actual ABHA API call)
        const demoABHAAccounts = {
            '91-2024-1234-5678': { password: 'Demo@2024', name: 'Dr. Rajesh Kumar', specialty: 'Ayurveda', license: 'AYUSH/MH/2024/001234' },
            '91-2024-2345-6789': { password: 'Demo@2024', name: 'Dr. Priya Sharma', specialty: 'Siddha', license: 'AYUSH/DL/2024/005678' },
            '91-2024-3456-7890': { password: 'Demo@2024', name: 'Dr. Ahmed Ali', specialty: 'Unani', license: 'AYUSH/KA/2024/009012' }
        };
        
        const account = demoABHAAccounts[abhaId];
        if (!account || account.password !== password) {
            throw new Error('Invalid ABHA credentials');
        }
        
        // Simulate API delay
        await this.delay(1500);
        
        return {
            type: 'abha',
            user: {
                abhaId: abhaId,
                name: account.name,
                specialty: account.specialty,
                license: account.license,
                verified: true
            },
            token: this.generateSessionToken(),
            expiresIn: this.config.session.timeout
        };
    }
    
    async authenticateWithOAuth(formData) {
        const token = formData.get('authToken');
        
        this.auditLog('oauth_login_attempt', { 
            tokenPrefix: token.substring(0, 10) + '...',
            timestamp: new Date().toISOString()
        });
        
        // Validate OAuth token format
        if (!this.validateOAuthToken(token)) {
            throw new Error('Invalid OAuth 2.0 token format');
        }
        
        // Demo token validation (replace with actual OAuth validation)
        const validTokens = {
            'ayush_oauth2_admin_2024_secure_token': {
                user: { id: 'admin_001', name: 'System Administrator', role: 'admin' },
                scopes: ['read:patient_data', 'write:diagnosis', 'access:namaste_api', 'admin:system']
            },
            'ayush_oauth2_doctor_2024_secure_token': {
                user: { id: 'doc_001', name: 'Dr. Generic User', role: 'doctor' },
                scopes: ['read:patient_data', 'write:diagnosis', 'access:namaste_api']
            },
            'ayush_oauth2_research_2024_secure_token': {
                user: { id: 'res_001', name: 'Research User', role: 'researcher' },
                scopes: ['read:patient_data', 'access:namaste_api']
            }
        };
        
        const tokenData = validTokens[token];
        if (!tokenData) {
            throw new Error('Invalid or expired OAuth 2.0 token');
        }
        
        // Simulate API delay
        await this.delay(1200);
        
        return {
            type: 'oauth',
            user: tokenData.user,
            scopes: tokenData.scopes,
            token: this.generateSessionToken(),
            expiresIn: this.config.session.timeout
        };
    }
    
    async createSession(authResult, licenseNumber, auditConsent) {
        const session = {
            id: this.generateSessionId(),
            authType: authResult.type,
            user: authResult.user,
            licenseNumber: licenseNumber,
            auditConsent: auditConsent,
            token: authResult.token,
            scopes: authResult.scopes || [],
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + authResult.expiresIn).toISOString(),
            lastActivity: new Date().toISOString()
        };
        
        // Store session
        this.currentSession = session;
        localStorage.setItem(this.config.session.storageKey, JSON.stringify(session));
        
        // Log successful authentication
        this.auditLog('authentication_successful', {
            sessionId: session.id,
            authType: session.authType,
            userId: session.user.id || session.user.abhaId,
            licenseNumber: this.maskLicenseNumber(licenseNumber),
            timestamp: session.createdAt
        });
        
        console.log('✅ Authentication session created:', session.id);
    }
    
    checkExistingSession() {
        const storedSession = localStorage.getItem(this.config.session.storageKey);
        if (!storedSession) return;
        
        try {
            const session = JSON.parse(storedSession);
            const now = new Date();
            const expiresAt = new Date(session.expiresAt);
            
            if (now < expiresAt) {
                this.currentSession = session;
                console.log('📋 Existing session found, redirecting...');
                window.location.href = 'index.html';
            } else {
                console.log('⏰ Session expired, clearing...');
                this.clearSession();
            }
        } catch (error) {
            console.error('Error checking session:', error);
            this.clearSession();
        }
    }
    
    clearSession() {
        if (this.currentSession) {
            this.auditLog('session_ended', {
                sessionId: this.currentSession.id,
                duration: Date.now() - new Date(this.currentSession.createdAt).getTime(),
                timestamp: new Date().toISOString()
            });
        }
        
        this.currentSession = null;
        localStorage.removeItem(this.config.session.storageKey);
    }
    
    setupSessionTimeoutWarning() {
        // Check for session timeout every minute
        setInterval(() => {
            if (!this.currentSession) return;
            
            const now = new Date();
            const expiresAt = new Date(this.currentSession.expiresAt);
            const timeUntilExpiry = expiresAt.getTime() - now.getTime();
            
            // Warn when 5 minutes left
            if (timeUntilExpiry <= this.config.session.refreshThreshold && timeUntilExpiry > 0) {
                this.showSessionWarning(Math.ceil(timeUntilExpiry / (60 * 1000)));
            }
            
            // Auto-logout when expired
            if (timeUntilExpiry <= 0) {
                this.handleSessionExpiry();
            }
        }, 60000);
    }
    
    showSessionWarning(minutesLeft) {
        const warning = `⚠️ Your session will expire in ${minutesLeft} minutes. Please save your work.`;
        console.warn(warning);
        // You can show a toast notification here
    }
    
    handleSessionExpiry() {
        console.log('🔒 Session expired, logging out...');
        this.auditLog('session_expired', {
            sessionId: this.currentSession.id,
            timestamp: new Date().toISOString()
        });
        this.clearSession();
        window.location.href = 'login.html';
    }
    
    // Validation Methods
    validateABHAId(abhaId) {
        const pattern = /^\d{2}-\d{4}-\d{4}-\d{4}$/;
        return pattern.test(abhaId);
    }
    
    validateOAuthToken(token) {
        // Basic token validation (should be more robust in production)
        return token && token.length >= 20 && /^[a-zA-Z0-9_]+$/.test(token);
    }
    
    validateLicenseNumber(license) {
        // AYUSH license format: AYUSH/STATE/YYYY/NNNNNN
        const pattern = /^AYUSH\/[A-Z]{2}\/\d{4}\/\d{6}$/;
        return pattern.test(license);
    }
    
    // Audit Logging System
    auditLog(action, data = {}) {
        if (!this.config.audit.enabled) return;
        
        const auditEntry = {
            id: this.generateAuditId(),
            timestamp: new Date().toISOString(),
            action: action,
            sessionId: this.currentSession?.id || 'anonymous',
            userAgent: navigator.userAgent,
            ipAddress: 'client-side', // Would be populated server-side
            data: data
        };
        
        this.auditQueue.push(auditEntry);
        console.log('📋 Audit:', action, data);
        
        // Flush if queue is full
        if (this.auditQueue.length >= this.config.audit.batchSize) {
            this.flushAuditQueue();
        }
    }
    
    startAuditService() {
        if (!this.config.audit.enabled) return;
        
        // Flush audit queue periodically
        this.auditTimer = setInterval(() => {
            if (this.auditQueue.length > 0) {
                this.flushAuditQueue();
            }
        }, this.config.audit.flushInterval);
    }
    
    async flushAuditQueue() {
        if (this.auditQueue.length === 0) return;
        
        const entries = [...this.auditQueue];
        this.auditQueue = [];
        
        try {
            // In production, send to audit endpoint
            console.log('📤 Flushing audit queue:', entries.length, 'entries');
            // await fetch(this.config.audit.endpoint, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ entries })
            // });
        } catch (error) {
            console.error('Failed to flush audit queue:', error);
            // Re-add entries to queue for retry
            this.auditQueue.unshift(...entries);
        }
    }
    
    // Utility Methods
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    generateSessionToken() {
        return 'sess_' + Array.from(crypto.getRandomValues(new Uint8Array(16)))
            .map(b => b.toString(16).padStart(2, '0')).join('');
    }
    
    generateSessionId() {
        return 'sid_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    generateAuditId() {
        return 'audit_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    }
    
    maskABHAId(abhaId) {
        if (!abhaId) return '';
        return abhaId.substring(0, 8) + '****-****';
    }
    
    maskLicenseNumber(license) {
        if (!license) return '';
        const parts = license.split('/');
        if (parts.length === 4) {
            return `${parts[0]}/${parts[1]}/${parts[2]}/******`;
        }
        return '******';
    }
    
    setLoginLoading(loading) {
        const loginBtn = document.getElementById('loginBtn');
        const spinner = loginBtn.querySelector('.spinner');
        const text = loginBtn.querySelector('span');
        
        if (loading) {
            loginBtn.classList.add('loading');
            loginBtn.disabled = true;
            text.textContent = 'Authenticating...';
        } else {
            loginBtn.classList.remove('loading');
            loginBtn.disabled = false;
            // Text will be restored by the auth method toggle
        }
    }
    
    showMessage(element, message, type) {
        element.textContent = message;
        element.style.display = 'block';
        element.className = `${type}-message`;
    }
    
    hideMessage(element) {
        element.style.display = 'none';
    }
}

// Initialize authentication system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.ayushAuth = new AyushAuthenticator();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AyushAuthenticator;
}