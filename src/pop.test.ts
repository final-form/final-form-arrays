import pop from './pop'
import { getIn, setIn, MutableState, Tools } from 'final-form'

describe('pop', () => {
  it('should call changeValue once', () => {
    const changeValue = jest.fn()
    const state: MutableState<any> = {
      formState: {
        values: {
          foo: ['one', 'two']
        } as any
      },
      fields: {
        'foo[0]': {
          name: 'foo[0]',
          touched: true,
          error: 'First Error'
        } as any,
        'foo[1]': {
          name: 'foo[1]',
          touched: false,
          error: 'Second Error'
        } as any
      }
    }
    const result = pop(['foo'], state, { changeValue, getIn, setIn } as unknown as Tools<any>)
    expect(result).toBeUndefined()
    expect(changeValue).toHaveBeenCalled()
    expect(changeValue).toHaveBeenCalledTimes(1)
    expect(changeValue.mock.calls[0][0]).toBe(state)
    expect(changeValue.mock.calls[0][1]).toBe('foo')
    expect(typeof changeValue.mock.calls[0][2]).toBe('function')
  })

  it('should return undefined if array is undefined', () => {
    // implementation of changeValue taken directly from Final Form
    const changeValue = (state: any, name: string, mutate: (value: any) => any) => {
      const before = getIn(state.formState.values, name)
      const after = mutate(before)
      state.formState.values = setIn(state.formState.values, name, after) || {} as any
    }
    const state: MutableState<any> = {
      formState: {
        values: {
          foo: undefined
        } as any
      },
      fields: {}
    } as any
    const returnValue = pop(['foo'], state, { changeValue, getIn, setIn } as unknown as Tools<any>)
    expect(returnValue).toBeUndefined()
    const result = state.formState.foo
    expect(result).toBeUndefined()
  })

  it('should return empty array if array is empty', () => {
    // implementation of changeValue taken directly from Final Form
    const changeValue = (state: any, name: string, mutate: (value: any) => any) => {
      const before = getIn(state.formState.values, name)
      const after = mutate(before)
      state.formState.values = setIn(state.formState.values, name, after) || {} as any
    }
    const state: MutableState<any> = {
      formState: {
        values: {
          foo: []
        } as any
      },
      fields: {}
    } as any
    const returnValue = pop(['foo'], state, { changeValue, getIn, setIn } as unknown as Tools<any>)
    expect(returnValue).toBeUndefined()
    const result = state.formState.values.foo
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(0)
  })

  it('should pop value off the end of array and return it', () => {
    // implementation of changeValue taken directly from Final Form
    const changeValue = jest.fn((state: any, name: string, mutate: (value: any) => any) => {
      const before = getIn(state.formState.values, name)
      const after = mutate(before)
      state.formState.values = setIn(state.formState.values, name, after) || {} as any
    })  
    const state: MutableState<any> = {
      formState: {
        values: {
          foo: ['a', 'b', 'c']
        } as any
      },
      fields: {
        'foo[0]': {
          name: 'foo[0]',
          touched: true,
          error: 'First Error'
        } as any,
        'foo[1]': {
          name: 'foo[1]',
          touched: false,
          error: 'Second Error'
        } as any
      }
    }
    const returnValue = pop(['foo'], state, { changeValue, getIn, setIn } as unknown as Tools<any>)
    const result = state.formState.values.foo
    expect(returnValue).toBe('c')
    expect(Array.isArray(result)).toBe(true)
    expect(result).toEqual(['a', 'b'])
  })

  it('should pop value off the end of array and return it', () => {
    const array = ['a', 'b', 'c', 'd']
    // implementation of changeValue taken directly from Final Form
    const changeValue = (state: any, name: string, mutate: (value: any) => any) => {
      const before = getIn(state.formState.values, name)
      const after = mutate(before)
      state.formState.values = setIn(state.formState.values, name, after) || {} as any
    }
    const state: MutableState<any> = {
      formState: {
        values: {
          foo: array,
          anotherField: 42
        } as any
      },
      fields: {
        'foo[0]': {
          name: 'foo[0]',
          touched: true,
          error: 'A Error'
        } as any,
        'foo[1]': {
          name: 'foo[1]',
          touched: false,
          error: 'B Error'
        } as any,
        'foo[2]': {
          name: 'foo[2]',
          touched: true,
          error: 'C Error'
        } as any,
        'foo[3]': {
          name: 'foo[3]',
          touched: false,
          error: 'D Error'
        } as any,
        anotherField: {
          name: 'anotherField',
          touched: false
        }
      }
    }
    const returnValue = pop(['foo'], state, { changeValue, getIn, setIn } as unknown as Tools<any>)
    expect(returnValue).toBe('d')
    expect(Array.isArray(state.formState.values.foo)).toBe(true)
    expect(state.formState.values.foo).not.toBe(array) // copied
    expect(state).toEqual({
      formState: {
        values: {
          foo: ['a', 'b', 'c'],
          anotherField: 42
        } as any
      },
      fields: {
        'foo[0]': {
          name: 'foo[0]',
          touched: true,
          error: 'A Error'
        } as any,
        'foo[1]': {
          name: 'foo[1]',
          touched: false,
          error: 'B Error'
        } as any,
        'foo[2]': {
          name: 'foo[2]',
          touched: true,
          error: 'C Error'
        } as any,
        anotherField: {
          name: 'anotherField',
          touched: false
        }
      }
    })
  })

  it('should pop value off the end of array and return it (nested arrays)', () => {
    const array = ['a', 'b', 'c', 'd']
    // implementation of changeValue taken directly from Final Form
    const changeValue = (state: any, name: string, mutate: (value: any) => any) => {
      const before = getIn(state.formState.values, name)
      const after = mutate(before)
      state.formState.values = setIn(state.formState.values, name, after) || {} as any
    }
    const state: MutableState<any> = {
      formState: {
        values: {
          foo: [array],
          anotherField: 42
        } as any
      },
      fields: {
        'foo[0][0]': {
          name: 'foo[0][0]',
          touched: true,
          error: 'A Error'
        } as any,
        'foo[0][1]': {
          name: 'foo[0][1]',
          touched: false,
          error: 'B Error'
        } as any,
        'foo[0][2]': {
          name: 'foo[0][2]',
          touched: true,
          error: 'C Error'
        } as any,
        'foo[0][3]': {
          name: 'foo[0][3]',
          touched: false,
          error: 'D Error'
        } as any,
        anotherField: {
          name: 'anotherField',
          touched: false
        }
      }
    }
    const returnValue = pop(['foo[0]'], state, { changeValue, getIn, setIn } as unknown as Tools<any>)
    expect(returnValue).toBe('d')
    expect(Array.isArray(state.formState.values.foo)).toBe(true)
    expect(state.formState.values.foo).not.toBe(array) // copied
    expect(state).toEqual({
      formState: {
        values: {
          foo: [['a', 'b', 'c']],
          anotherField: 42
        } as any
      },
      fields: {
        'foo[0][0]': {
          name: 'foo[0][0]',
          touched: true,
          error: 'A Error'
        } as any,
        'foo[0][1]': {
          name: 'foo[0][1]',
          touched: false,
          error: 'B Error'
        } as any,
        'foo[0][2]': {
          name: 'foo[0][2]',
          touched: true,
          error: 'C Error'
        } as any,
        anotherField: {
          name: 'anotherField',
          touched: false
        }
      }
    })
  })
})
