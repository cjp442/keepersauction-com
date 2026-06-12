/**
 * Admin Authentication & Access Control
 * Handles admin role verification and protected route access
 */

export class AdminAuth {
  constructor() {
    this.user = null
    this.isAdmin = false
    this.token = null
    this.loadFromStorage()
  }

  // Check if user is authenticated as admin
  isAuthenticated() {
    return !!this.token && this.isAdmin
  }

  // Admin login (dev/test mode)
  // In production, this connects to backend auth
  async login(password) {
    // Dev mode: accept any non-empty password
    // Production: validate against secure backend
    if (!password) {
      throw new Error('Password required')
    }

    // Simulate backend validation
    this.token = btoa(`admin:${Date.now()}`)
    this.isAdmin = true
    this.user = {
      id: 'admin-1',
      name: 'Admin',
      role: 'admin',
      permissions: [
        'view_all_rooms',
        'manage_users',
        'moderate_chat',
        'approve_hosts',
        'view_analytics',
        'manage_payments'
      ]
    }

    this.saveToStorage()
    return this.user
  }

  // Admin logout
  logout() {
    this.token = null
    this.isAdmin = false
    this.user = null
    this.clearStorage()
  }

  // Check if admin has specific permission
  hasPermission(permission) {
    if (!this.isAdmin || !this.user) return false
    return this.user.permissions.includes(permission)
  }

  // Grant admin access to user (super-admin only)
  grantAdminAccess(userId, permissions = []) {
    if (!this.isAdmin) {
      throw new Error('Only admins can grant access')
    }
    // In production: call backend API
    return { userId, permissions, grantedAt: new Date().toISOString() }
  }

  // Verify user is 21+ (integration point for age verification service)
  async verifyAgeVerification() {
    const verification = localStorage.getItem('keepers_age_verified')
    if (!verification) return false

    const data = JSON.parse(verification)
    if (data.age < 21) return false
    if (new Date(data.verifiedAt) < new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)) {
      // Reverify if older than 1 year
      return false
    }

    return true
  }

  // Save auth state to local storage
  saveToStorage() {
    if (this.isAdmin) {
      localStorage.setItem('keepers_admin_auth', JSON.stringify({
        token: this.token,
        user: this.user,
        loginAt: new Date().toISOString()
      }))
    }
  }

  // Load auth state from storage
  loadFromStorage() {
    const stored = localStorage.getItem('keepers_admin_auth')
    if (stored) {
      try {
        const data = JSON.parse(stored)
        // Check if token is still valid (within 24 hours)
        const loginTime = new Date(data.loginAt).getTime()
        if (Date.now() - loginTime < 24 * 60 * 60 * 1000) {
          this.token = data.token
          this.user = data.user
          this.isAdmin = true
        } else {
          this.clearStorage()
        }
      } catch (e) {
        console.error('Failed to load admin auth:', e)
        this.clearStorage()
      }
    }
  }

  // Clear stored auth
  clearStorage() {
    localStorage.removeItem('keepers_admin_auth')
  }
}

// Global instance
export const adminAuth = new AdminAuth()
