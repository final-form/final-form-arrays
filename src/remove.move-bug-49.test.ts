import remove from './remove'
import move from './move'
import { getIn, setIn, MutableState } from 'final-form'
import { createMockTools } from './testUtils'

describe('remove after move regression #49', () => {
  it('should remove the correct field after moving items', () => {
    const changeValue = jest.fn((state: any, name: string, mutate: (value: any) => any) => {
      const before = getIn(state.formState.values, name)
      const after = mutate(before)
      state.formState.values = setIn(state.formState.values, name, after) || {} as any
    })

    // Initial state: two customers in order [0, 1]
    const state: MutableState<any> = {
      formState: {
        values: {
          customers: [
            { id: 1, name: 'Customer #1' },
            { id: 2, name: 'Customer #2' }
          ]
        } as any
      },
      fields: {
        'customers[0]': { name: 'customers[0]', value: { id: 1, name: 'Customer #1' } } as any,
        'customers[0].id': { name: 'customers[0].id', value: 1 } as any,
        'customers[0].name': { name: 'customers[0].name', value: 'Customer #1' } as any,
        'customers[1]': { name: 'customers[1]', value: { id: 2, name: 'Customer #2' } } as any,
        'customers[1].id': { name: 'customers[1].id', value: 2 } as any,
        'customers[1].name': { name: 'customers[1].name', value: 'Customer #2' } as any
      },
      lastFormState: {} as any
    }

    const tools = createMockTools({ changeValue })

    // Step 1: Move customer from index 1 to index 0 (reorder to [1, 0])
    move(['customers', 1, 0], state, tools)

    // After move, the array should be [Customer #2, Customer #1]
    expect(state.formState.values.customers).toEqual([
      { id: 2, name: 'Customer #2' },
      { id: 1, name: 'Customer #1' }
    ])

    // Field state should have swapped
    expect(state.fields['customers[0]'].value).toEqual({ id: 2, name: 'Customer #2' })
    expect(state.fields['customers[1]'].value).toEqual({ id: 1, name: 'Customer #1' })

    // Step 2: Remove customer at index 1 (which is now Customer #1, original item 0)
    const removed = remove(['customers', 1], state, tools)

    // Should have removed Customer #1 (id: 1)
    expect(removed).toEqual({ id: 1, name: 'Customer #1' })

    // Array should now contain only Customer #2
    expect(state.formState.values.customers).toEqual([
      { id: 2, name: 'Customer #2' }
    ])

    // Field state should reflect the remaining customer at index 0
    expect(state.fields['customers[0]']).toBeDefined()
    expect(state.fields['customers[0]'].value).toEqual({ id: 2, name: 'Customer #2' })
    expect(state.fields['customers[0].id']).toBeDefined()
    expect(state.fields['customers[0].id'].value).toBe(2)
    expect(state.fields['customers[0].name']).toBeDefined()
    expect(state.fields['customers[0].name'].value).toBe('Customer #2')

    // Fields for index 1 should be gone
    expect(state.fields['customers[1]']).toBeUndefined()
    expect(state.fields['customers[1].id']).toBeUndefined()
    expect(state.fields['customers[1].name']).toBeUndefined()
  })
})
