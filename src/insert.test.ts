import insert from './insert'
import { getIn, setIn, MutableState } from 'final-form'
import { createMockTools } from './testUtils'

describe('insert', () => {
  const getOp = (index, value: any) => {
    const changeValue = jest.fn()
    const resetFieldState = jest.fn()
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
    insert(['foo', index, value], state, createMockTools({ changeValue, resetFieldState }))
    return changeValue.mock.calls[0][2]
  }

  it('should call changeValue once', () => {
    const changeValue = jest.fn()
    const resetFieldState = jest.fn()
    const state: MutableState<any> = {
      formState: {
        values: {
          foo: ['one', 'two'],
          anotherField: 42
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
          touched: false
        },
        anotherField: {
          name: 'anotherField',
          touched: true
        }
      }
    }
    const result = insert(['foo', 0, 'bar'], state, createMockTools({ changeValue, resetFieldState }))
    expect(result).toBeUndefined()
    expect(changeValue).toHaveBeenCalled()
    expect(changeValue).toHaveBeenCalledTimes(1)
    expect(changeValue.mock.calls[0][0]).toBe(state)
    expect(changeValue.mock.calls[0][1]).toBe('foo')
    expect(typeof changeValue.mock.calls[0][2]).toBe('function')
  })

  it('should treat undefined like an empty array', () => {
    const op = getOp(0, 'bar')
    const result = op(undefined)
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(1)
    expect(result[0]).toBe('bar')
  })

  it('should insert value into the specified index', () => {
    const op = getOp(1, 'd')
    const array = ['a', 'b', 'c']
    const result = op(array)
    expect(result).not.toBe(array) // copied
    expect(Array.isArray(result)).toBe(true)
    expect(result).toEqual(['a', 'd', 'b', 'c'])
  })

  it('should increment other field data from the specified index', () => {
    const array = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k']
    // implementation of changeValue taken directly from Final Form
    const changeValue = (state: any, name: string, mutate: (value: any) => any) => {
      const before = getIn(state.formState.values, name)
      const after = mutate(before)
      state.formState.values = setIn(state.formState.values, name, after) || {}
    }
    const resetFieldState = (name: string) => {
      state.fields[name].touched = false
    }
    const state: MutableState<any> = {
      formState: {
        values: {
          foo: array
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
          touched: true,
          error: 'B Error'
        } as any,
        'foo[9]': {
          name: 'foo[9]',
          touched: true,
          error: 'J Error'
        } as any,
        'foo[10]': {
          name: 'foo[10]',
          touched: false,
          error: 'K Error'
        } as any
      }
    }
    const returnValue = insert(['foo', 1, 'NEWVALUE'], state, createMockTools({ changeValue, resetFieldState }))
    expect(returnValue).toBeUndefined()
    expect(state.formState.values.foo).not.toBe(array) // copied
    expect(state).toEqual({
      formState: {
        values: {
          foo: [
            'a',
            'NEWVALUE',
            'b',
            'c',
            'd',
            'e',
            'f',
            'g',
            'h',
            'i',
            'j',
            'k'
          ]
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
          error: 'B Error',
          lastFieldState: undefined
        },
        'foo[10]': {
          name: 'foo[10]',
          touched: true,
          error: 'J Error',
          lastFieldState: undefined
        },
        'foo[11]': {
          name: 'foo[11]',
          touched: false,
          error: 'K Error',
          lastFieldState: undefined
        }
      }
    })
  })

  it('should increment other field data from the specified index (nested arrays)', () => {
    const array = ['a', 'b', 'c', 'd']
    // implementation of changeValue taken directly from Final Form
    const changeValue = (state: any, name: string, mutate: (value: any) => any) => {
      const before = getIn(state.formState.values, name)
      const after = mutate(before)
      state.formState.values = setIn(state.formState.values, name, after) || {}
    }
    const resetFieldState = (name: string) => {
      state.fields[name].touched = false
    }
    const state: MutableState<any> = {
      formState: {
        values: {
          foo: [array]
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
          touched: true,
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
        } as any
      }
    }
    const returnValue = insert(['foo[0]', 1, 'NEWVALUE'], state, createMockTools({ changeValue, resetFieldState }))
    expect(returnValue).toBeUndefined()
    expect(state.formState.values.foo).not.toBe(array) // copied
    expect(state).toEqual({
      formState: {
        values: {
          foo: [['a', 'NEWVALUE', 'b', 'c', 'd']]
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
          error: 'B Error',
          lastFieldState: undefined
        },
        'foo[0][3]': {
          name: 'foo[0][3]',
          touched: true,
          error: 'C Error',
          lastFieldState: undefined
        },
        'foo[0][4]': {
          name: 'foo[0][4]',
          touched: false,
          error: 'D Error',
          lastFieldState: undefined
        }
      }
    })
  })
})
