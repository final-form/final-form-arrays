import remove from './remove'
import { getIn, setIn, MutableState } from 'final-form'
import { createMockTools } from './testUtils'

describe('remove empty array regression #95', () => {
  it('should keep empty array instead of removing key when last item removed', () => {
    const changeValue = jest.fn((state: any, name: string, mutate: (value: any) => any) => {
      const before = getIn(state.formState.values, name)
      const after = mutate(before)
      state.formState.values = setIn(state.formState.values, name, after) || {} as any
    })

    const state: MutableState<any> = {
      formState: {
        values: {
          customers: [{ name: 'Alice' }]
        } as any
      },
      fields: {
        'customers[0]': { name: 'customers[0]' } as any,
        'customers[0].name': { name: 'customers[0].name' } as any
      }
    }

    // Remove the last (and only) item
    remove(['customers', 0], state, createMockTools({ changeValue, getIn, setIn }))

    // Current behavior (v3.1.0+): customers key gets deleted (undefined)
    // Expected behavior (v3.0.2): customers should remain as empty array
    expect(state.formState.values.customers).toBeDefined()
    expect(state.formState.values.customers).toEqual([])
  })

  it('should preserve other object keys when array becomes empty', () => {
    const changeValue = jest.fn((state: any, name: string, mutate: (value: any) => any) => {
      const before = getIn(state.formState.values, name)
      const after = mutate(before)
      state.formState.values = setIn(state.formState.values, name, after) || {} as any
    })

    const state: MutableState<any> = {
      formState: {
        values: {
          name: 'Form Name',
          items: ['A'],
          description: 'Test form'
        } as any
      },
      fields: {
        name: { name: 'name' } as any,
        'items[0]': { name: 'items[0]' } as any,
        description: { name: 'description' } as any
      }
    }

    remove(['items', 0], state, createMockTools({ changeValue, getIn, setIn }))

    // Other keys should still exist
    expect(state.formState.values.name).toBe('Form Name')
    expect(state.formState.values.description).toBe('Test form')
    // items should be empty array, not undefined/deleted
    expect(state.formState.values.items).toEqual([])
  })
})
