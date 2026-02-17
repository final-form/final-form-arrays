import removeBatch from './removeBatch'
import { getIn, setIn, MutableState } from 'final-form'
import { createMockTools } from './testUtils'

describe('removeBatch lexicographic sorting bug', () => {
  it('should remove correct items when indexes > 9 (numeric vs lexicographic sort)', () => {
    const changeValue = jest.fn((state: any, name: string, mutate: (value: any) => any) => {
      const before = getIn(state.formState.values, name)
      const after = mutate(before)
      state.formState.values = setIn(state.formState.values, name, after) || {} as any
    })

    // Create 20 items
    const items = Array.from({ length: 20 }, (_, i) => ({ id: i + 1 }))
    const fields: any = {}
    items.forEach((_, i) => {
      fields[`customers[${i}]`] = { name: `customers[${i}]` }
    })

    const state: MutableState<any> = {
      formState: { values: { customers: items } as any },
      fields
    }

    // Remove indexes 4-16 (customers with id 5-17)
    // Without numeric sort: lexicographic [10,11,12,13,14,15,16,4,5,6,7,8,9] - removes WRONG items
    // With numeric sort: [4,5,6,7,8,9,10,11,12,13,14,15,16] - removes correct items
    removeBatch(['customers', [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]], state, createMockTools({ changeValue }))

    const customers = state.formState.values.customers

    // Should keep customers with id 1-4 and 18-20
    expect(customers).toHaveLength(7)
    expect(customers.map(c => c.id)).toEqual([1, 2, 3, 4, 18, 19, 20])
  })

  it('should handle out-of-order indexes with double-digit numbers', () => {
    const changeValue = jest.fn((state: any, name: string, mutate: (value: any) => any) => {
      const before = getIn(state.formState.values, name)
      const after = mutate(before)
      state.formState.values = setIn(state.formState.values, name, after) || {} as any
    })

    const items = Array.from({ length: 15 }, (_, i) => ({ value: i }))
    const fields: any = {}
    items.forEach((_, i) => {
      fields[`items[${i}]`] = { name: `items[${i}]` }
    })

    const state: MutableState<any> = {
      formState: { values: { items } as any },
      fields
    }

    // Remove in random order with mixed single and double-digit indexes
    removeBatch(['items', [10, 5, 12, 8]], state, createMockTools({ changeValue }))

    const result = state.formState.values.items
    expect(result).toHaveLength(11)
    expect(result.map(i => i.value)).toEqual([0, 1, 2, 3, 4, 6, 7, 9, 11, 13, 14])
  })
})
