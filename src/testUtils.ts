import { MutableState, Tools } from 'final-form'

export const createMockState = (): MutableState<any> => ({
  fieldSubscribers: {},
  fields: {},
  formState: {
    values: {}
  }
} as any)

export const createMockTools = (overrides: Partial<Tools<any>> = {}): Tools<any> => ({
  changeValue: jest.fn(),
  getIn: jest.fn(),
  setIn: jest.fn(),
  shallowEqual: jest.fn(),
  renameField: jest.fn(),
  resetFieldState: jest.fn(),
  ...overrides
} as unknown as Tools<any>) 