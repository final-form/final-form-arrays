import { createMockState, createMockTools } from './testUtils'

describe('testUtils', () => {
  describe('createMockState', () => {
    it('should create a mock state object', () => {
      const state = createMockState()
      expect(state).toHaveProperty('fieldSubscribers')
      expect(state).toHaveProperty('fields')
      expect(state).toHaveProperty('formState')
      expect(state.formState).toHaveProperty('values')
    })
  })

  describe('createMockTools', () => {
    it('should create mock tools with default functions', () => {
      const tools = createMockTools()
      expect(tools.changeValue).toBeDefined()
      expect(tools.getIn).toBeDefined()
      expect(tools.setIn).toBeDefined()
      expect(tools.shallowEqual).toBeDefined()
      expect(tools.renameField).toBeDefined()
      expect(tools.resetFieldState).toBeDefined()
    })

    it('should allow overriding specific tools', () => {
      const customChangeValue = jest.fn()
      const tools = createMockTools({ changeValue: customChangeValue })
      expect(tools.changeValue).toBe(customChangeValue)
      expect(tools.getIn).toBeDefined()
    })

    it('should work with no overrides', () => {
      const tools = createMockTools()
      expect(typeof tools.changeValue).toBe('function')
    })
  })
}) 