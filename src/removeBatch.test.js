import removeBatch from './removeBatch'
import { getIn, setIn } from 'final-form'

describe('removeBatch', () => {
  const getOp = value => {
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
    removeBatch(['foo', value], state, { changeValue })
    return changeValue.mock.calls[0][2]
  }

  it('should call changeValue once', () => {
    // implementation of changeValue taken directly from Final Form
    const changeValue = jest.fn((state, name, mutate) => {
      const before = getIn(state.formState.values, name)
      const after = mutate(before)
      state.formState.values = setIn(state.formState.values, name, after) || {}
    })
    const state = {
      formState: {
        values: {
          foo: ['one', 'two', 'three']
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
        },
        'foo[2]': {
          name: 'foo[2]',
          touched: true,
          error: 'Third Error'
        }
      }
    }
    const result = removeBatch(['foo', [1, 2]], state, { changeValue })
    expect(Array.isArray(result)).toBe(true)
    expect(result).toEqual(['two', 'three'])
    expect(changeValue).toHaveBeenCalled()
    expect(changeValue).toHaveBeenCalledTimes(1)
    expect(changeValue.mock.calls[0][0]).toBe(state)
    expect(changeValue.mock.calls[0][1]).toBe('foo')
    expect(typeof changeValue.mock.calls[0][2]).toBe('function')
    expect(state).toEqual({
      formState: {
        values: {
          foo: ['one']
        }
      },
      fields: {
        'foo[0]': {
          name: 'foo[0]',
          touched: true,
          error: 'First Error',
          forceUpdate: true
        }
      }
    })
  })

  it('should not matter if indexes are out of order', () => {
    // implementation of changeValue taken directly from Final Form
    const changeValue = jest.fn((state, name, mutate) => {
      const before = getIn(state.formState.values, name)
      const after = mutate(before)
      state.formState.values = setIn(state.formState.values, name, after) || {}
    })
    const state = {
      formState: {
        values: {
          foo: ['one', 'two', 'three']
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
        },
        'foo[2]': {
          name: 'foo[2]',
          touched: true,
          error: 'Third Error'
        }
      }
    }
    const result = removeBatch(['foo', [2, 0]], state, { changeValue })
    expect(Array.isArray(result)).toBe(true)
    expect(result).toEqual(['three', 'one'])
    expect(changeValue).toHaveBeenCalled()
    expect(changeValue).toHaveBeenCalledTimes(1)
    expect(changeValue.mock.calls[0][0]).toBe(state)
    expect(changeValue.mock.calls[0][1]).toBe('foo')
    expect(typeof changeValue.mock.calls[0][2]).toBe('function')
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
          error: 'Second Error',
          forceUpdate: true
        }
      }
    })
  })

  it('should return undefined if array is undefined', () => {
    const op = getOp([0, 1])
    const result = op(undefined)
    expect(result).toBeUndefined()
  })

  it('should return the original array if no indexes are specified to be removed', () => {
    const op = getOp([])
    const result = op(['a', 'b', 'c', 'd', 'e'])
    expect(Array.isArray(result)).toBe(true)
    expect(result).toEqual(['a', 'b', 'c', 'd', 'e'])
  })

  it('should remove the values at the specified indexes', () => {
    const op = getOp([1, 3])
    const result = op(['a', 'b', 'c', 'd', 'e'])
    expect(Array.isArray(result)).toBe(true)
    expect(result).toEqual(['a', 'c', 'e'])
  })

  it('should ignore duplicate indexes', () => {
    const op = getOp([1, 1, 1, 3])
    const result = op(['a', 'b', 'c', 'd', 'e'])
    expect(Array.isArray(result)).toBe(true)
    expect(result).toEqual(['a', 'c', 'e'])
  })

  it('should adjust higher indexes when removing', () => {
    const array = ['a', 'b', 'c', 'd', 'e']
    // implementation of changeValue taken directly from Final Form
    const changeValue = (state, name, mutate) => {
      const before = getIn(state.formState.values, name)
      const after = mutate(before)
      state.formState.values = setIn(state.formState.values, name, after) || {}
    }
    const state = {
      formState: {
        values: {
          foo: array,
          anotherField: 42
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
        },
        'foo[3]': {
          name: 'foo[3]',
          touched: false,
          error: 'D Error'
        },
        'foo[4]': {
          name: 'foo[4]',
          touched: true,
          error: 'E Error'
        },
        anotherField: {
          name: 'anotherField',
          touched: false
        }
      }
    }
    const returnValue = removeBatch(['foo', [1, 2]], state, { changeValue })
    expect(returnValue).toEqual(['b', 'c'])
    expect(state.formState.values.foo).not.toBe(array) // copied
    expect(state).toEqual({
      formState: {
        values: {
          foo: ['a', 'd', 'e'],
          anotherField: 42
        }
      },
      fields: {
        'foo[0]': {
          name: 'foo[0]',
          touched: true,
          error: 'A Error',
          forceUpdate: true
        },
        'foo[1]': {
          name: 'foo[1]',
          touched: false,
          error: 'D Error',
          forceUpdate: true
        },
        'foo[2]': {
          name: 'foo[2]',
          touched: true,
          error: 'E Error',
          forceUpdate: true
        },
        anotherField: {
          name: 'anotherField',
          touched: false
        }
      }
    })
  })
})
