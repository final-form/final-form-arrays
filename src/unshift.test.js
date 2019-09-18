import unshift from './unshift'
import { getIn, setIn } from 'final-form'

describe('unshift', () => {
  const getOp = value => {
    const changeValue = jest.fn()
    const resetFieldState = jest.fn()
    const state = {
      formState: {
        values: {
          foo: ['one', 'two']
        }
      },
      fields: {
        'foo[0]': {
          name: 'foo[0]',
          touched: true,
          error: 'First Error'
        },
        'foo[1]': {
          name: 'foo[1]',
          touched: false,
          error: 'Second Error'
        }
      }
    }
    unshift(['foo', value], state, { changeValue, resetFieldState })
    return changeValue.mock.calls[0][2]
  }

  it('should call changeValue once', () => {
    const changeValue = jest.fn()
    const resetFieldState = jest.fn()
    const state = {
      formState: {
        values: {
          foo: ['one', 'two']
        }
      },
      fields: {
        'foo[0]': {
          name: 'foo[0]',
          touched: true,
          error: 'First Error'
        },
        'foo[1]': {
          name: 'foo[1]',
          touched: false,
          error: 'Second Error'
        }
      }
    }
    const result = unshift(['foo', 'bar'], state, {
      changeValue,
      resetFieldState
    })
    expect(result).toBeUndefined()
    expect(changeValue).toHaveBeenCalled()
    expect(changeValue).toHaveBeenCalledTimes(1)
    expect(changeValue.mock.calls[0][0]).toBe(state)
    expect(changeValue.mock.calls[0][1]).toBe('foo')
    expect(typeof changeValue.mock.calls[0][2]).toBe('function')
  })

  it('should turn undefined into an array with one value', () => {
    const op = getOp('bar')
    const result = op(undefined)
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(1)
    expect(result[0]).toBe('bar')
  })

  it('should insert value to beginning of array', () => {
    const array = ['a', 'b', 'c']
    // implementation of changeValue taken directly from Final Form
    const changeValue = (state, name, mutate) => {
      const before = getIn(state.formState.values, name)
      const after = mutate(before)
      state.formState.values = setIn(state.formState.values, name, after) || {}
    }
    const resetFieldState = name => {
      state.fields[name].touched = false
    }
    const state = {
      formState: {
        values: {
          foo: array
        }
      },
      fields: {
        'foo[0]': {
          name: 'foo[0]',
          touched: true,
          error: 'A Error'
        },
        'foo[1]': {
          name: 'foo[1]',
          touched: false,
          error: 'B Error'
        },
        'foo[2]': {
          name: 'foo[2]',
          touched: true,
          error: 'C Error'
        }
      }
    }
    const returnValue = unshift(['foo', 'NEWVALUE'], state, {
      changeValue,
      resetFieldState
    })
    expect(returnValue).toBeUndefined()
    expect(state.formState.values.foo).not.toBe(array) // copied
    expect(state).toEqual({
      formState: {
        values: {
          foo: ['NEWVALUE', 'a', 'b', 'c']
        }
      },
      fields: {
        'foo[1]': {
          name: 'foo[1]',
          touched: true,
          error: 'A Error',
          lastFieldState: undefined
        },
        'foo[2]': {
          name: 'foo[2]',
          touched: false,
          error: 'B Error',
          lastFieldState: undefined
        },
        'foo[3]': {
          name: 'foo[3]',
          touched: true,
          error: 'C Error',
          lastFieldState: undefined
        }
      }
    })
  })
})
