const DATA_READY = false

function route() {
  return location.hash.startsWith('#/') ? location.hash.slice(1).split('?')[0] : location.pathname
}

function setApp(html) {
  const appRoot = document.getElementById('root')
  if (appRoot) appRoot.style.display = 'none'
  let root = document.getElementById('ka-public-ready-root')
  if (!root) {
    root = document.createElement('div')
    root.id = 'ka-public-ready-root'
    document.body.appendChild(root)
  }
  root.innerHTML = html
}

function clearApp() {
  document.getElementById('ka-public-ready-root')?.remove()
  const appRoot = document.getElementById('root')
  if (appRoot) appRoot.style.display = ''
}

function go(path) {
  location.hash = path
}

function shell(title, sub, body, actions = '') {
  return `<div class="ka-shell"><div class="ka-wrap">
    <div class="ka-topline"><div><h1 class="ka-title">${title}</h1><p class="ka-sub">${sub}</p></div><div class="ka-actions">${actions}</div></div>
    ${body}
  </div></div>`
}

function hostApplication() {
  setApp(shell('Host Application', 'Apply to run auctions on Keepers Auction. This stores a local draft until the production backend is connected.', `
    <div class="ka-grid">
      <form class="ka-card ka-form" id="ka-host-form">
        <label>Legal name<input required name="name" autocomplete="name"></label>
        <label>Email<input required name="email" type="email" autocomplete="email"></label>
        <label>Phone<input required name="phone" autocomplete="tel"></label>
        <label>Business or seller name<input name="seller"></label>
        <label>Primary category<select name="category"><option>Coins</option><option>Bullion</option><option>Currency</option><option>Estate collectibles</option></select></label>
        <label>Experience and inventory<textarea required name="experience" placeholder="Tell us what you sell, how you source inventory, and where you currently stream or sell."></textarea></label>
        <button class="ka-btn primary" type="submit">Save Application Draft</button>
      </form>
      <div class="ka-card">
        <h3>Future Data Location</h3>
        <p>Approved host profile, tax status, payout setup, shipping preferences, moderation settings, and live-room controls will appear here once the backend is connected.</p>
        <div class="ka-empty" style="margin-top:14px">No submitted applications yet.</div>
      </div>
    </div>
  `, `<button class="ka-btn" data-go="/">Back Home</button>`))

  document.getElementById('ka-host-form').addEventListener('submit', event => {
    event.preventDefault()
    const draft = Object.fromEntries(new FormData(event.currentTarget).entries())
    localStorage.setItem('keepers_host_application_draft', JSON.stringify({ ...draft, savedAt: new Date().toISOString() }))
    alert('Host application draft saved locally. Production submission will connect to your backend.')
  })
}

function hosts() {
  setApp(shell('Live Host Rooms', 'No mock host data is displayed. The room locations stay visible so live host data can plug in cleanly later.', `
    <div class="ka-grid">
      ${['Live Rooms', 'Upcoming Rooms', 'Approved Hosts', 'Host Applications'].map((name, i) => `
        <div class="ka-card">
          <h3>${name}</h3>
          <p>${i === 3 ? 'Applications saved locally or submitted through the future backend will appear here.' : 'This location is reserved for real backend data.'}</p>
          <div class="ka-empty">No real ${name.toLowerCase()} yet.</div>
        </div>`).join('')}
    </div>
  `, `<button class="ka-btn primary" data-go="/host-apply">Apply To Host</button><button class="ka-btn" data-go="/room/host-small">Small Room</button><button class="ka-btn" data-go="/room/host-medium">Medium Room</button><button class="ka-btn" data-go="/room/host-large">Large Room</button><button class="ka-btn" data-go="/user-room">My Room</button>`))
}

function hostControls() {
  setApp(shell('Host Live Controls', 'Camera, phone streaming, OBS setup, lots, bids, and moderation are staged here without fake sales data.', `
    <div class="ka-grid">
      <div class="ka-card">
        <h3>Camera Preview</h3>
        <div class="ka-stream-preview" id="ka-preview"><span class="ka-sub">Camera not started</span></div>
        <div class="ka-actions" style="margin-top:12px">
          <button class="ka-btn primary" id="ka-start-camera">Start PC Camera</button>
          <button class="ka-btn" id="ka-stop-camera">Stop</button>
        </div>
      </div>
      <div class="ka-card">
        <h3>Phone Camera Pairing</h3>
        <p>Phone pairing code location. Production pairing will generate a secure QR code and temporary stream key.</p>
        <div class="ka-empty"><strong>PAIR-${Math.random().toString(36).slice(2, 8).toUpperCase()}</strong><br>Waiting for backend pairing service.</div>
      </div>
      <div class="ka-card">
        <h3>OBS / Stream Key</h3>
        <p>OBS location is ready. Real RTMP ingest and stream keys should be issued server-side.</p>
        <ul><li>Server: pending backend</li><li>Stream key: hidden until auth</li><li>Latency mode: low</li></ul>
      </div>
      <div class="ka-card">
        <h3>Live Auction Tools</h3>
        <div class="ka-empty">No active lots, bids, orders, chat, or moderation records yet.</div>
      </div>
    </div>
  `, `<button class="ka-btn" data-go="/hosts">Host Rooms</button>`))

  let stream
  document.getElementById('ka-start-camera').onclick = async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      document.getElementById('ka-preview').innerHTML = '<video autoplay muted playsinline></video>'
      document.querySelector('#ka-preview video').srcObject = stream
    } catch {
      alert('Camera permission was blocked or no camera is available.')
    }
  }
  document.getElementById('ka-stop-camera').onclick = () => {
    stream?.getTracks().forEach(track => track.stop())
    document.getElementById('ka-preview').innerHTML = '<span class="ka-sub">Camera stopped</span>'
  }
}

function avatarStudio() {
  setApp(shell('Avatar Studio', 'The old mismatched image-stack avatar is replaced by a proportional body preview. Parts stay aligned because they are generated from one body rig.', `
    <div class="ka-grid">
      <div class="ka-card"><div class="ka-avatar" id="ka-avatar"></div></div>
      <div class="ka-card ka-form">
        <label>Skin tone<input id="ka-skin" type="color" value="#d4a574"></label>
        <label>Hair color<input id="ka-hair" type="color" value="#2c1810"></label>
        <label>Shirt color<input id="ka-shirt" type="color" value="#263f55"></label>
        <button class="ka-btn primary" id="ka-save-avatar">Save Avatar Locally</button>
      </div>
      <div class="ka-card">
        <h3>Future Avatar Data</h3>
        <p>Saved body measurements, outfit inventory, face presets, and 3D model files will connect here later.</p>
      </div>
    </div>
  `))
  const avatar = document.getElementById('ka-avatar')
  const sync = () => {
    avatar.style.setProperty('--skin', document.getElementById('ka-skin').value)
    avatar.style.setProperty('--hair', document.getElementById('ka-hair').value)
    avatar.style.setProperty('--shirt', document.getElementById('ka-shirt').value)
  }
  ;['ka-skin', 'ka-hair', 'ka-shirt'].forEach(id => document.getElementById(id).addEventListener('input', sync))
  document.getElementById('ka-save-avatar').onclick = () => {
    sync()
    localStorage.setItem('keepers_avatar_v2', JSON.stringify({
      skin: document.getElementById('ka-skin').value,
      hair: document.getElementById('ka-hair').value,
      shirt: document.getElementById('ka-shirt').value
    }))
    alert('Avatar saved locally.')
  }
  sync()
}

function room3d(roomType = 'medium') {
  setApp(`<div class="ka-room ${roomType}">
    <div class="ka-roombar">
      <button class="ka-btn" data-go="/hosts">Exit Room</button>
      <strong>3D Host Room (${roomType.charAt(0).toUpperCase() + roomType.slice(1)})</strong>
      <span class="ka-pill">Camera just above head | body visible</span>
    </div>
    <div class="ka-room-stage">
      <div class="ka-room-world" id="ka-world">
        <div class="ka-floor"></div><div class="ka-wall back"></div><div class="ka-wall left"></div><div class="ka-wall right"></div>
        <div class="ka-door back-wall" id="ka-door-back"></div>
        <div class="ka-screen">Host stream will appear here</div>
        <div class="ka-seat s1"></div><div class="ka-seat s2"></div><div class="ka-seat s3"></div><div class="ka-seat s4"></div><div class="ka-seat s5"></div>
        <div class="ka-body"></div>
      </div>
    </div>
    <div class="ka-sidepanel">
      <div class="ka-card"><h3>Walk Controls</h3><p>Use W/A/S/D to move. Use Q/E to turn. Click door or seats to interact.</p></div>
      <div class="ka-card"><h3>Room Info</h3><p><strong>Size:</strong> ${roomType.charAt(0).toUpperCase() + roomType.slice(1)}<br><strong>Status:</strong> Live Auction Active</p></div>
      <div class="ka-card"><h3>Interaction Tips</h3><ul style="margin:0;padding-left:16px;font-size:12px;color:#a89880;"><li>Click door to enter/exit</li><li>Click seats to sit</li><li>WASD to walk around</li><li>Q/E to turn view</li></ul></div>
      <div class="ka-card"><h3>Support</h3><button class="ka-btn primary" id="ka-knock">Knock For Admin</button></div>
    </div>
  </div>`)
  
  let x = 0, y = 0, turn = 0
  let doorOpen = false
  const world = document.getElementById('ka-world')
  const door = document.getElementById('ka-door-back')
  
  const draw = () => {
    world.style.setProperty('--x', `${x}px`)
    world.style.setProperty('--y', `${y}px`)
    world.style.setProperty('--turn', `${turn}deg`)
  }
  
  // Door interaction
  if (door) {
    door.onclick = (e) => {
      e.stopPropagation()
      doorOpen = !doorOpen
      door.classList.toggle('open', doorOpen)
      const msg = doorOpen ? 'Door opened! Welcome to the auction room.' : 'Door closed.'
      localStorage.setItem('keepers_door_interaction', JSON.stringify({ action: 'toggle_door', doorOpen, at: new Date().toISOString() }))
    }
  }
  
  // Seat interaction
  document.querySelectorAll('.ka-seat').forEach((seat, idx) => {
    seat.onclick = (e) => {
      e.stopPropagation()
      localStorage.setItem('keepers_seat_interaction', JSON.stringify({ seat: idx + 1, at: new Date().toISOString() }))
      alert(`Sitting at seat ${idx + 1}`)
    }
  })
  
  // Walking controls
  window.onkeydown = event => {
    const step = 18
    if (event.key.toLowerCase() === 'w') y += step
    if (event.key.toLowerCase() === 's') y -= step
    if (event.key.toLowerCase() === 'a') x += step
    if (event.key.toLowerCase() === 'd') x -= step
    if (event.key.toLowerCase() === 'q') turn -= 8
    if (event.key.toLowerCase() === 'e') turn += 8
    draw()
  }
  
  document.getElementById('ka-knock').onclick = () => {
    localStorage.setItem('keepers_admin_knock', JSON.stringify({ route: route(), at: new Date().toISOString() }))
    alert('Admin support knock saved locally. Production notification hook should send this to you.')
  }
  
  draw()
}

function userRoom() {
  setApp(`<div class="ka-user-room">
    <div class="ka-user-room-topbar">
      <button class="ka-btn" data-go="/">Exit Room</button>
      <div class="ka-user-info">
        <span id="user-name">Personal Room</span>
        <span>|</span>
        <span id="user-status">Active</span>
      </div>
      <button class="ka-btn" data-go="/avatar">Customize Avatar</button>
    </div>
    <div class="ka-user-room-stage">
      <div class="ka-user-world" id="ka-user-world">
        <div class="ka-floor"></div><div class="ka-wall back"></div><div class="ka-wall left"></div><div class="ka-wall right"></div>
        <div class="ka-door left-wall" id="ka-exit-door"></div>
        <div class="ka-screen">Your personal space</div>
        <div class="ka-body"></div>
      </div>
    </div>
  </div>`)
  
  let x = 0, y = 0, turn = 0
  const world = document.getElementById('ka-user-world')
  const exitDoor = document.getElementById('ka-exit-door')
  
  const draw = () => {
    world.style.setProperty('--x', `${x}px`)
    world.style.setProperty('--y', `${y}px`)
    world.style.setProperty('--turn', `${turn}deg`)
  }
  
  // Exit door
  if (exitDoor) {
    exitDoor.onclick = () => {
      go('/')
    }
  }
  
  // Walking controls
  window.onkeydown = event => {
    const step = 18
    if (event.key.toLowerCase() === 'w') y += step
    if (event.key.toLowerCase() === 's') y -= step
    if (event.key.toLowerCase() === 'a') x += step
    if (event.key.toLowerCase() === 'd') x -= step
    if (event.key.toLowerCase() === 'q') turn -= 8
    if (event.key.toLowerCase() === 'e') turn += 8
    draw()
  }
  
  draw()
}

function adminKnock() {
  localStorage.setItem('keepers_admin_knock', JSON.stringify({ route: route(), at: new Date().toISOString() }))
}

function render() {
  const r = route()
  document.querySelectorAll('[data-go]').forEach(button => button.onclick = () => go(button.dataset.go))
  if (r === '/host-apply') return hostApplication()
  if (r === '/hosts') return hosts()
  if (r === '/host-dashboard' || r === '/host-controls') return hostControls()
  if (r === '/avatar') return avatarStudio()
  if (r === '/user-room') return userRoom()
  if (r.startsWith('/room/host-')) {
    const roomType = r.replace('/room/host-', '')
    return room3d(roomType)
  }
  if (r.startsWith('/room/')) return room3d()
  clearApp()
}

document.addEventListener('click', event => {
  const target = event.target.closest('[data-go]')
  if (target) go(target.dataset.go)
})
window.addEventListener('hashchange', render)
window.addEventListener('keepers:admin-knock', adminKnock)
setTimeout(render, 250)
