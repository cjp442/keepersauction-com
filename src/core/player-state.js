/**
 * Player State Management
 * Centralized state for user profile, settings, and game progress
 */

export class PlayerState {
  constructor() {
    this.userId = null
    this.username = null
    this.avatar = null
    this.level = 0
    this.tokens = 0
    this.membership = 'basic' // 'basic' or 'vip'
    this.isVerified21Plus = false
    this.isHost = false
    this.roomPosition = { x: 0, y: 0, z: 0 }
    this.currentRoom = null
    this.settings = {
      volumeMaster: 0.8,
      volumeChat: 0.7,
      volumeMusic: 0.6,
      enableVoiceChat: true,
      enableParticles: true,
      qualityLevel: 'high'
    }
    this.stats = {
      auctionsWon: 0,
      totalSpent: 0,
      auctionsHosted: 0,
      timeInRooms: 0
    }

    this.loadFromStorage()
  }

  // Initialize or update player
  initializePlayer(userId, username) {
    this.userId = userId
    this.username = username
    this.avatar = this.generateDefaultAvatar()
    this.saveToStorage()
  }

  // Generate default avatar
  generateDefaultAvatar() {
    return {
      skinTone: '#d4a574',
      hairColor: '#2c1810',
      shirtColor: '#263f55',
      savedAt: new Date().toISOString()
    }
  }

  // Update player avatar
  updateAvatar(skinTone, hairColor, shirtColor) {
    this.avatar = {
      skinTone,
      hairColor,
      shirtColor,
      savedAt: new Date().toISOString()
    }
    this.saveToStorage()
  }

  // Add tokens to player
  addTokens(amount) {
    this.tokens += amount
    this.saveToStorage()
    return this.tokens
  }

  // Deduct tokens
  deductTokens(amount) {
    if (this.tokens < amount) {
      throw new Error('Insufficient tokens')
    }
    this.tokens -= amount
    this.saveToStorage()
    return this.tokens
  }

  // Set membership tier
  setMembership(tier) {
    if (!['basic', 'vip'].includes(tier)) {
      throw new Error('Invalid membership tier')
    }
    this.membership = tier
    this.saveToStorage()
  }

  // Mark as 21+ verified
  verify21Plus() {
    this.isVerified21Plus = true
    this.saveToStorage()
  }

  // Grant host privileges
  grantHostAccess() {
    this.isHost = true
    this.saveToStorage()
  }

  // Update position in 3D room
  updatePosition(x, y, z) {
    this.roomPosition = { x, y, z }
  }

  // Update current room
  setCurrentRoom(roomId) {
    this.currentRoom = roomId
  }

  // Update game settings
  updateSettings(settings) {
    this.settings = { ...this.settings, ...settings }
    this.saveToStorage()
  }

  // Record auction win
  recordAuctionWin(amount) {
    this.stats.auctionsWon++
    this.stats.totalSpent += amount
    this.saveToStorage()
  }

  // Record hosting session
  recordHostingSession(durationMinutes) {
    this.stats.auctionsHosted++
    this.stats.timeInRooms += durationMinutes
    this.saveToStorage()
  }

  // Get player profile data
  getProfile() {
    return {
      userId: this.userId,
      username: this.username,
      level: this.level,
      membership: this.membership,
      isVerified21Plus: this.isVerified21Plus,
      isHost: this.isHost,
      avatar: this.avatar,
      stats: { ...this.stats },
      createdAt: this.createdAt || new Date().toISOString()
    }
  }

  // Save to local storage
  saveToStorage() {
    localStorage.setItem('keepers_player_state', JSON.stringify({
      userId: this.userId,
      username: this.username,
      avatar: this.avatar,
      level: this.level,
      tokens: this.tokens,
      membership: this.membership,
      isVerified21Plus: this.isVerified21Plus,
      isHost: this.isHost,
      settings: this.settings,
      stats: this.stats,
      createdAt: this.createdAt || new Date().toISOString()
    }))
  }

  // Load from local storage
  loadFromStorage() {
    const stored = localStorage.getItem('keepers_player_state')
    if (stored) {
      try {
        const data = JSON.parse(stored)
        Object.assign(this, data)
      } catch (e) {
        console.error('Failed to load player state:', e)
      }
    }
  }
}

// Global instance
export const playerState = new PlayerState()
