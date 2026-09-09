import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'

afterEach(() => {
  cleanup()
})

global.matchMedia = global.matchMedia || function() {
  return {
    addListener: vi.fn(),
    removeListener: vi.fn(),
  }
}
