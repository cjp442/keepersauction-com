/**
 * Room Interaction System
 * Handles raycasting, object interaction, and event dispatch
 */

export class RoomInteraction {
  constructor(scene, camera) {
    this.scene = scene
    this.camera = camera
    this.interactables = []
    this.selectedObject = null
  }

  // Register interactive object
  registerInteractable(object, callback) {
    this.interactables.push({
      object,
      callback,
      bbox: this.calculateBoundingBox(object)
    })
  }

  // Calculate bounding box for object
  calculateBoundingBox(element) {
    const rect = element.getBoundingClientRect()
    return {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height
    }
  }

  // Raycast to find intersected objects
  raycast(mouseX, mouseY) {
    // Convert mouse coordinates to normalized device coordinates
    const ndc = {
      x: (mouseX / window.innerWidth) * 2 - 1,
      y: -(mouseY / window.innerHeight) * 2 + 1
    }

    // Check which interactables are under mouse
    for (const item of this.interactables) {
      const bbox = item.bbox
      if (mouseX >= bbox.x && mouseX <= bbox.x + bbox.width &&
          mouseY >= bbox.y && mouseY <= bbox.y + bbox.height) {
        return item
      }
    }

    return null
  }

  // Handle click/interaction
  interact(mouseX, mouseY) {
    const target = this.raycast(mouseX, mouseY)
    if (target) {
      target.callback(target.object)
      this.selectedObject = target.object
      return true
    }
    return false
  }

  // Show interaction prompt
  showPrompt(object, text) {
    const prompt = document.createElement('div')
    prompt.className = 'ka-interaction-prompt'
    prompt.textContent = text
    document.body.appendChild(prompt)

    const rect = object.getBoundingClientRect()
    prompt.style.left = rect.left + rect.width / 2 + 'px'
    prompt.style.top = rect.top - 30 + 'px'

    setTimeout(() => prompt.remove(), 3000)
  }

  // Highlight object
  highlight(object, highlight = true) {
    if (highlight) {
      object.classList.add('ka-highlighted')
    } else {
      object.classList.remove('ka-highlighted')
    }
  }

  // Update interactable positions
  update() {
    this.interactables.forEach(item => {
      item.bbox = this.calculateBoundingBox(item.object)
    })
  }
}
