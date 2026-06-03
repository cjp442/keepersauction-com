const MONEY_PATHS = ['/wallet', '/saloon']
const ADMIN_PATHS = ['/admin', '/admin-room']

function currentRoute() {
  if (location.hash.startsWith('#/')) return location.hash.slice(1).split('?')[0]
  return location.pathname
}

function routeStartsWith(paths) {
  const route = currentRoute()
  return paths.some(path => route === path || route.startsWith(`${path}/`))
}

function showNotice(message) {
  let notice = document.getElementById('launch-guard-notice')

  if (!notice) {
    notice = document.createElement('div')
    notice.id = 'launch-guard-notice'
    notice.setAttribute('role', 'status')
    notice.style.cssText = [
      'position:fixed',
      'left:50%',
      'bottom:24px',
      'transform:translateX(-50%)',
      'z-index:99999',
      'max-width:min(560px,calc(100vw - 32px))',
      'padding:14px 18px',
      'border:1px solid rgba(212,149,58,.45)',
      'border-radius:10px',
      'background:rgba(13,10,8,.94)',
      'box-shadow:0 18px 50px rgba(0,0,0,.35)',
      'color:#F0E6D8',
      'font:600 14px/1.45 Inter,system-ui,sans-serif',
      'text-align:center'
    ].join(';')
    document.body.appendChild(notice)
  }

  notice.textContent = message
  window.clearTimeout(showNotice.timer)
  showNotice.timer = window.setTimeout(() => notice.remove(), 7000)
}

function isMoneyButton(target) {
  const button = target.closest?.('button')
  if (!button) return false

  const text = button.textContent.replace(/\s+/g, ' ').trim().toLowerCase()
  return text.includes('purchase') && text.includes('coin') || text.includes('buy token')
}

function guardPrivateRoutes() {
  if (routeStartsWith(ADMIN_PATHS)) {
    history.replaceState({}, '', '/#/')
    showNotice('Admin and host controls are locked on the public site until production authentication is connected.')
  }
}

function markCheckoutButtons() {
  if (!routeStartsWith(MONEY_PATHS)) return

  document.querySelectorAll('button').forEach(button => {
    const text = button.textContent.replace(/\s+/g, ' ').trim().toLowerCase()

    if ((text.includes('purchase') && text.includes('coin')) || text.includes('buy tokens')) {
      button.dataset.launchGuard = 'checkout-disabled'
      button.setAttribute('aria-disabled', 'true')
      button.title = 'Real payment checkout must be connected before public token sales.'

      if (!button.dataset.launchGuardLabel) {
        button.dataset.launchGuardLabel = '1'
        button.textContent = 'Checkout Coming Soon'
      }
    }
  })
}

function normalizeBrandText() {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  const replacements = [
    ['The Coin Keeper', 'Keepers Auction'],
    ['Coin Keeper', 'Keepers Auction'],
    ['CoinKeeper', 'Keepers']
  ]

  while (walker.nextNode()) {
    let value = walker.currentNode.nodeValue

    replacements.forEach(([from, to]) => {
      value = value.replaceAll(from, to)
    })

    walker.currentNode.nodeValue = value
  }
}

document.addEventListener('click', event => {
  if (!isMoneyButton(event.target)) return

  event.preventDefault()
  event.stopImmediatePropagation()
  showNotice('Token checkout is paused until secure payment processing is connected. No card or token sale was processed.')
}, true)

guardPrivateRoutes()
markCheckoutButtons()
normalizeBrandText()
new MutationObserver(() => {
  guardPrivateRoutes()
  markCheckoutButtons()
  normalizeBrandText()
}).observe(document.documentElement, { childList: true, subtree: true })

window.addEventListener('popstate', () => {
  guardPrivateRoutes()
  markCheckoutButtons()
  normalizeBrandText()
})

window.addEventListener('hashchange', () => {
  guardPrivateRoutes()
  markCheckoutButtons()
  normalizeBrandText()
})
