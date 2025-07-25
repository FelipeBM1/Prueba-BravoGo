// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom"
import { jest, beforeAll, afterAll, afterEach } from "@jest/globals"

// Mock de fetch global para todos los tests
global.fetch = jest.fn()

// Mock de localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock de window.open
global.open = jest.fn()

// Mock de console para evitar logs innecesarios en tests
const originalConsoleError = console.error
const originalConsoleLog = console.log

beforeAll(() => {
  // Silenciar warnings específicos de React durante tests
  console.error = (...args) => {
    if (typeof args[0] === "string" && args[0].includes("ReactDOMTestUtils.act")) {
      return
    }
    originalConsoleError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalConsoleError
  console.log = originalConsoleLog
})

// Limpiar mocks después de cada test
afterEach(() => {
  jest.clearAllMocks()
})
