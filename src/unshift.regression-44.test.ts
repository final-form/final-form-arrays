import unshift from './unshift'
import { getIn, setIn, MutableState } from 'final-form'
import { createMockTools } from './testUtils'

describe('unshift regression #44', () => {
  it('should properly initialize unshifted field values', () => {
    const changeValue = jest.fn((state: any, name: string, mutate: (value: any) => any) => {
      const before = getIn(state.formState.values, name)
      const after = mutate(before)
      state.formState.values = setIn(state.formState.values, name, after) || {} as any
    })

    // Start with one customer
    const state: MutableState<any> = {
      formState: {
        values: {
          customers: [{ firstName: 'John', lastName: 'Doe' }]
        } as any
      },
      fields: {
        'customers[0]': { name: 'customers[0]' } as any,
        'customers[0].firstName': { name: 'customers[0].firstName' } as any,
        'customers[0].lastName': { name: 'customers[0].lastName' } as any
      }
    }

    // Unshift a new customer
    unshift(['customers', { firstName: 'Jane', lastName: 'Smith' }], state, createMockTools({ changeValue }))

    const customers = state.formState.values.customers

    // Verify new customer is at index 0
    expect(customers).toHaveLength(2)
    expect(customers[0]).toEqual({ firstName: 'Jane', lastName: 'Smith' })
    expect(customers[1]).toEqual({ firstName: 'John', lastName: 'Doe' })

    // Verify field keys were shifted
    expect(state.fields['customers[0]']).toBeDefined()
    expect(state.fields['customers[1]']).toBeDefined()
    expect(state.fields['customers[0].firstName']).toBeDefined()
    expect(state.fields['customers[0].lastName']).toBeDefined()
    expect(state.fields['customers[1].firstName']).toBeDefined()
    expect(state.fields['customers[1].lastName']).toBeDefined()
  })

  it('should not have null values after unshift', () => {
    const changeValue = jest.fn((state: any, name: string, mutate: (value: any) => any) => {
      const before = getIn(state.formState.values, name)
      const after = mutate(before)
      state.formState.values = setIn(state.formState.values, name, after) || {} as any
    })

    const state: MutableState<any> = {
      formState: {
        values: {
          items: ['first']
        } as any
      },
      fields: {
        'items[0]': { name: 'items[0]' } as any
      }
    }

    // Unshift should add the value, not null
    unshift(['items', 'prepended'], state, createMockTools({ changeValue }))

    expect(state.formState.values.items[0]).toBe('prepended')
    expect(state.formState.values.items[0]).not.toBeNull()
    expect(state.formState.values.items[1]).toBe('first')
  })
})
