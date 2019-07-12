import shift from './shift'
import { getIn, setIn } from 'final-form'

describe('shift', () => {
  it('should call changeValue once', () => {
    const changeValue = jest.fn()
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
    const result = shift(['foo'], state, { changeValue })
    expect(result).toBeUndefined()
    expect(changeValue).toHaveBeenCalled()
    expect(changeValue).toHaveBeenCalledTimes(1)
    expect(changeValue.mock.calls[0][0]).toBe(state)
    expect(changeValue.mock.calls[0][1]).toBe('foo')
    expect(typeof changeValue.mock.calls[0][2]).toBe('function')
  })

  it('should treat undefined like an empty array', () => {
    const changeValue = jest.fn()
    const state = {
      formState: {
        values: {}
      },
      fields: {}
    }
    const returnValue = shift(['foo'], state, { changeValue })
    const op = changeValue.mock.calls[0][2]
    expect(returnValue).toBeUndefined()
    const result = op(undefined)
    expect(result).toEqual([])
  })

  it('should return empty array if array is empty', () => {
    const changeValue = jest.fn()
    const state = {
      formState: {
        values: {
          foo: []
        }
      },
      fields: {}
    }
    const returnValue = shift(['foo'], state, { changeValue })
    const op = changeValue.mock.calls[0][2]
    expect(returnValue).toBeUndefined()
    const result = op([])
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(0)
  })

  it('should remove value from start of array, and return it', () => {
    const array = ['a', 'b', 'c']
    // implementation of changeValue taken directly from Final Form
    const changeValue = (state, name, mutate) => {
      const before = getIn(state.formState.values, name)
      const after = mutate(before)
      state.formState.values = setIn(state.formState.values, name, after) || {}
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
    const returnValue = shift(['foo'], state, { changeValue })
    expect(state.formState.values.foo).not.toBe(array) // copied
    expect(returnValue).toBe('a')
    expect(Array.isArray(state.formState.values.foo)).toBe(true)
    expect(state).toEqual({
      formState: {
        values: {
          foo: ['b', 'c']
        }
      },
      fields: {
        'foo[0]': {
          name: 'foo[0]',
          touched: false,
          error: 'B Error'
        },
        'foo[1]': {
          name: 'foo[1]',
          touched: true,
          error: 'C Error'
        }
      }
    })
  })

  it('should shift field state, too', () => {
    // implementation of changeValue taken directly from Final Form
    const changeValue = (state, name, mutate) => {
      const before = getIn(state.formState.values, name)
      const after = mutate(before)
      state.formState.values = setIn(state.formState.values, name, after) || {}
    }
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
    shift(['foo'], state, { changeValue })
    expect(state).toEqual({
      formState: {
        values: {
          foo: ['two']
        }
      },
      fields: {
        'foo[0]': {
          name: 'foo[0]',
          touched: false,
          error: 'Second Error'
        }
      }
    })
  })
})
