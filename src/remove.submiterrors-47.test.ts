import remove from './remove'
import { getIn, setIn, MutableState } from 'final-form'
import { createMockTools } from './testUtils'

describe('remove submitErrors regression #47', () => {
  it('should remove submitErrors when removing array item', () => {
    const changeValue = jest.fn((state: any, name: string, mutate: (value: any) => any) => {
      const before = getIn(state.formState.values, name)
      const after = mutate(before)
      state.formState.values = setIn(state.formState.values, name, after) || {} as any
    })

    const state: MutableState<any> = {
      formState: {
        values: {
          customers: [
            { name: 'Alice' },
            { name: 'Bob' },
            { name: 'Charlie' }
          ]
        } as any,
        submitErrors: {
          customers: [
            { name: 'Error for Alice' },
            { name: 'Error for Bob' },
            { name: 'Error for Charlie' }
          ]
        }
      },
      fields: {
        'customers[0]': { name: 'customers[0]' } as any,
        'customers[0].name': { name: 'customers[0].name' } as any,
        'customers[1]': { name: 'customers[1]' } as any,
        'customers[1].name': { name: 'customers[1].name' } as any,
        'customers[2]': { name: 'customers[2]' } as any,
        'customers[2].name': { name: 'customers[2].name' } as any
      }
    }

    // Remove middle item (index 1 - Bob)
    remove(['customers', 1], state, createMockTools({ changeValue, getIn, setIn }))

    // Values should have Bob removed
    expect(state.formState.values.customers).toHaveLength(2)
    expect(state.formState.values.customers[0].name).toBe('Alice')
    expect(state.formState.values.customers[1].name).toBe('Charlie')

    // Submit errors should also have Bob's error removed
    expect(state.formState.submitErrors.customers).toHaveLength(2)
    expect(state.formState.submitErrors.customers[0].name).toBe('Error for Alice')
    expect(state.formState.submitErrors.customers[1].name).toBe('Error for Charlie')
  })

  it('should handle removing first item with submitErrors', () => {
    const changeValue = jest.fn((state: any, name: string, mutate: (value: any) => any) => {
      const before = getIn(state.formState.values, name)
      const after = mutate(before)
      state.formState.values = setIn(state.formState.values, name, after) || {} as any
    })

    const state: MutableState<any> = {
      formState: {
        values: {
          items: ['A', 'B', 'C']
        } as any,
        submitErrors: {
          items: ['Error A', 'Error B', 'Error C']
        }
      },
      fields: {
        'items[0]': { name: 'items[0]' } as any,
        'items[1]': { name: 'items[1]' } as any,
        'items[2]': { name: 'items[2]' } as any
      }
    }

    // Remove first item
    remove(['items', 0], state, createMockTools({ changeValue, getIn, setIn }))

    expect(state.formState.values.items).toEqual(['B', 'C'])
    expect(state.formState.submitErrors.items).toEqual(['Error B', 'Error C'])
  })

  it('should not crash when no submitErrors exist', () => {
    const changeValue = jest.fn((state: any, name: string, mutate: (value: any) => any) => {
      const before = getIn(state.formState.values, name)
      const after = mutate(before)
      state.formState.values = setIn(state.formState.values, name, after) || {} as any
    })

    const state: MutableState<any> = {
      formState: {
        values: {
          items: ['A', 'B']
        } as any
        // No submitErrors
      },
      fields: {
        'items[0]': { name: 'items[0]' } as any,
        'items[1]': { name: 'items[1]' } as any
      }
    }

    // Should not crash
    expect(() => {
      remove(['items', 0], state, createMockTools({ changeValue, getIn, setIn }))
    }).not.toThrow()

    expect(state.formState.values.items).toEqual(['B'])
  })
})
