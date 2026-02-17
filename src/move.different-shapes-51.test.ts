import move from './move'
import { getIn, setIn, MutableState } from 'final-form'
import { createMockTools } from './testUtils'

describe('move different shapes regression #51', () => {
  it('should preserve functions in field state when fields with different shapes', () => {
    const changeValue = jest.fn((state: any, name: string, mutate: (value: any) => any) => {
      const before = getIn(state.formState.values, name)
      const after = mutate(before)
      state.formState.values = setIn(state.formState.values, name, after) || {} as any
    })

    const changeDogA = jest.fn(() => 'A Dog')
    const changeCatA = jest.fn(() => 'A Cat')
    const changeDogB = jest.fn(() => 'B Dog')

    const state: MutableState<any> = {
      formState: {
        values: {
          foo: [
            { dog: 'apple dog', cat: 'apple cat' },
            { dog: 'banana dog' }
          ]
        } as any
      },
      fields: {
        'foo[0].dog': {
          name: 'foo[0].dog',
          touched: true,
          error: 'Error A Dog',
          change: changeDogA
        } as any,
        'foo[0].cat': {
          name: 'foo[0].cat',
          touched: false,
          error: 'Error A Cat',
          change: changeCatA
        } as any,
        'foo[1].dog': {
          name: 'foo[1].dog',
          touched: true,
          error: 'Error B Dog',
          change: changeDogB
        } as any
      }
    }

    // Move index 0 to index 1
    move(['foo', 0, 1], state, createMockTools({ changeValue }))

    // Values should be swapped
    expect(state.formState.values).toEqual({
      foo: [
        { dog: 'banana dog' },
        { dog: 'apple dog', cat: 'apple cat' }
      ]
    })

    // When moving fields, functions get swapped for matching fields
    expect(state.fields['foo[0].dog'].change).toBe(changeDogA) // gets from old foo[0].dog
    expect(state.fields['foo[0].dog'].change()).toBe('A Dog')

    expect(state.fields['foo[1].dog'].change).toBe(changeDogB) // gets from old foo[1].dog
    expect(state.fields['foo[1].dog'].change()).toBe('B Dog')

    // BUG #51: This field exists but has no change function (no matching field at old foo[1].cat)
    // After fix: should preserve the function from source field
    expect(state.fields['foo[1].cat']).toBeDefined()
    expect(state.fields['foo[1].cat'].change).toBe(changeCatA)
    expect(state.fields['foo[1].cat'].change()).toBe('A Cat')
  })
})
