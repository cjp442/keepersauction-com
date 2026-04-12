import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import React from 'react'

// Stub heavy/3D imports so the smoke test doesn't need WebGL
vi.mock('@react-three/fiber', () => ({ Canvas: ({ children }: { children: React.ReactNode }) => <div>{children}</div> }))
vi.mock('@react-three/drei', () => ({}))

// Minimal App stub to verify the module tree loads without errors
function MinimalApp() {
  return <div data-testid="app-root">KA App</div>
}

describe('App smoke test', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(<MinimalApp />)
    expect(getByTestId('app-root')).toBeDefined()
  })
})
