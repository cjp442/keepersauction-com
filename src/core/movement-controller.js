/**
 * Movement Controller - Handles responsive player movement and physics
 * Provides smooth, predictable WASD/arrow key controls
 */

export class MovementController {
  constructor(options = {}) {
    this.position = { x: 0, y: 0, z: 0 }
    this.velocity = { x: 0, y: 0, z: 0 }
    this.rotation = { x: 0, y: 0, z: 0 }
    this.angularVelocity = { x: 0, y: 0, z: 0 }

    // Movement parameters - tuned for responsive control
    this.moveSpeed = options.moveSpeed || 0.15 // units per frame
    this.acceleration = options.acceleration || 0.02
    this.friction = options.friction || 0.92 // exponential damping
    this.turnSpeed = options.turnSpeed || 4 // degrees per frame
    this.turnFriction = options.turnFriction || 0.85

    // Input state
    this.keys = {}
    this.mouseDown = false
    this.lastMouseX = 0
    this.lastMouseY = 0

    // Collision/Physics
    this.isGrounded = true
    this.gravity = options.gravity || 0.01
    this.boundsX = options.boundsX || { min: -50, max: 50 }
    this.boundsZ = options.boundsZ || { min: -50, max: 50 }
    this.boundsY = options.boundsY || { min: 0, max: 10 }

    this.setupControls()
  }

  setupControls() {
    // Keyboard
    document.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true
      e.preventDefault && !this.shouldAllowDefault(e) && e.preventDefault()
    }, true)

    document.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false
    })

    // Gamepad polling
    this.gamepadIndex = null
    window.addEventListener('gamepadconnected', (e) => {
      this.gamepadIndex = e.gamepad.index
      console.log(`Gamepad ${e.gamepad.index} connected`)
    })

    window.addEventListener('gamepaddisconnected', () => {
      this.gamepadIndex = null
    })
  }

  shouldAllowDefault(e) {
    const key = e.key.toLowerCase()
    return !['w', 'a', 's', 'd', 'q', 'e', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)
  }

  updateInput() {
    // Keyboard input
    let moveForward = this.keys['w'] || this.keys['arrowup'] ? 1 : 0
    let moveBackward = this.keys['s'] || this.keys['arrowdown'] ? 1 : 0
    let strafeLeft = this.keys['a'] ? 1 : 0
    let strafeRight = this.keys['d'] ? 1 : 0
    let turnLeft = this.keys['q'] ? 1 : 0
    let turnRight = this.keys['e'] ? 1 : 0

    // Gamepad input
    if (this.gamepadIndex !== null) {
      const gp = navigator.getGamepads()[this.gamepadIndex]
      if (gp) {
        // Left stick for movement
        moveForward += Math.max(0, gp.axes[1] * -1) // Y-axis inverted
        moveBackward += Math.max(0, gp.axes[1])
        strafeLeft += Math.max(0, gp.axes[0] * -1)
        strafeRight += Math.max(0, gp.axes[0])

        // Right stick or triggers for rotation
        turnLeft += Math.max(0, gp.axes[2] * -1) * 0.5
        turnRight += Math.max(0, gp.axes[2]) * 0.5

        // Clamp values
        moveForward = Math.min(1, moveForward)
        moveBackward = Math.min(1, moveBackward)
        strafeLeft = Math.min(1, strafeLeft)
        strafeRight = Math.min(1, strafeRight)
      }
    }

    // Net movement
    const moveZ = (moveForward - moveBackward) * this.moveSpeed
    const moveX = (strafeRight - strafeLeft) * this.moveSpeed
    const turnY = (turnRight - turnLeft) * this.turnSpeed

    // Apply with acceleration/friction for smooth feel
    this.velocity.z += moveZ * this.acceleration
    this.velocity.x += moveX * this.acceleration
    this.angularVelocity.y += turnY * 0.1

    // Apply friction/damping
    this.velocity.z *= this.friction
    this.velocity.x *= this.friction
    this.angularVelocity.y *= this.turnFriction

    // Apply deadzone (prevent tiny drifts)
    if (Math.abs(this.velocity.z) < 0.001) this.velocity.z = 0
    if (Math.abs(this.velocity.x) < 0.001) this.velocity.x = 0
    if (Math.abs(this.angularVelocity.y) < 0.01) this.angularVelocity.y = 0
  }

  update(deltaTime = 0.016) {
    this.updateInput()

    // Update position with velocity
    this.position.x += this.velocity.x
    this.position.z += this.velocity.z
    this.position.y += this.velocity.y

    // Update rotation
    this.rotation.y += this.angularVelocity.y

    // Apply gravity (if needed)
    if (!this.isGrounded) {
      this.velocity.y -= this.gravity
    } else {
      this.velocity.y = 0
      this.position.y = Math.max(0, this.position.y)
    }

    // Clamp position to bounds
    this.position.x = Math.max(this.boundsX.min, Math.min(this.boundsX.max, this.position.x))
    this.position.z = Math.max(this.boundsZ.min, Math.min(this.boundsZ.max, this.position.z))
    this.position.y = Math.max(this.boundsY.min, Math.min(this.boundsY.max, this.position.y))

    // Normalize rotation
    this.rotation.y = ((this.rotation.y % 360) + 360) % 360
  }

  jump() {
    if (this.isGrounded) {
      this.velocity.y = 0.3
      this.isGrounded = false
    }
  }

  teleport(x, y, z) {
    this.position = { x, y, z }
    this.velocity = { x: 0, y: 0, z: 0 }
  }

  getState() {
    return {
      position: { ...this.position },
      rotation: { ...this.rotation },
      velocity: { ...this.velocity }
    }
  }

  setState(state) {
    if (state.position) Object.assign(this.position, state.position)
    if (state.rotation) Object.assign(this.rotation, state.rotation)
    if (state.velocity) Object.assign(this.velocity, state.velocity)
  }
}
