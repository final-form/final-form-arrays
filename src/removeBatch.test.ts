import removeBatch from './removeBatch'
import { getIn, setIn, MutableState } from 'final-form'
import { createMockTools } from './testUtils'

describe('removeBatch', () => {
  const getOp = value => {
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
    removeBatch(['foo', value], state, createMockTools({ changeValue }))
    return changeValue.mock.calls[0][2]
  }

  it('should call changeValue once', () => {
    // implementation of changeValue taken directly from Final Form
    const changeValue = jest.fn((state: any, name: string, mutate: (value: any) => any) => {
      const before = getIn(state.formState.values, name)
      const after = mutate(before)
      state.formState.values = setIn(state.formState.values, name, after) || {} as any
    })
    function blur0() { }
    function change0() { }
    function focus0() { }
    function blur1() { }
    function change1() { }
    function focus1() { }
    function blur2() { }
    function change2() { }
    function focus2() { }
    const state: MutableState<any> = {
      formState: {
        values: {
          foo: ['one', 'two', 'three']
        } as any
      },
      fields: {
        'foo[0]': {
          name: 'foo[0]',
          blur: blur0,
          change: change0,
          focus: focus0,
          touched: true,
          error: 'First Error'
        } as any,
        'foo[1]': {
          name: 'foo[1]',
          blur: blur1,
          change: change1,
          focus: focus1,
          touched: false,
          error: 'Second Error'
        } as any,
        'foo[2]': {
          name: 'foo[2]',
          blur: blur2,
          change: change2,
          focus: focus2,
          touched: true,
          error: 'Third Error'
        } as any
      }
    }
    const result = removeBatch(['foo', [1, 2]], state, createMockTools({ changeValue }))
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
        } as any
      },
      fields: {
        'foo[0]': {
          name: 'foo[0]',
          blur: blur0,
          change: change0,
          focus: focus0,
          touched: true,
          error: 'First Error',
          lastFieldState: undefined
        }
      }
    })
  })

  it('should not matter if indexes are out of order', () => {
    // implementation of changeValue taken directly from Final Form
    const changeValue = jest.fn((state: any, name: string, mutate: (value: any) => any) => {
      const before = getIn(state.formState.values, name)
      const after = mutate(before)
      state.formState.values = setIn(state.formState.values, name, after) || {} as any
    })
    function blur0() { }
    function change0() { }
    function focus0() { }
    function blur1() { }
    function change1() { }
    function focus1() { }
    function blur2() { }
    function change2() { }
    function focus2() { }
    const state: MutableState<any> = {
      formState: {
        values: {
          foo: ['one', 'two', 'three']
        } as any
      },
      fields: {
        'foo[0]': {
          name: 'foo[0]',
          blur: blur0,
          change: change0,
          focus: focus0,
          touched: true,
          error: 'First Error'
        } as any,
        'foo[1]': {
          name: 'foo[1]',
          blur: blur1,
          change: change1,
          focus: focus1,
          touched: false,
          error: 'Second Error'
        } as any,
        'foo[2]': {
          name: 'foo[2]',
          blur: blur2,
          change: change2,
          focus: focus2,
          touched: true,
          error: 'Third Error'
        } as any
      }
    }
    const result = removeBatch(['foo', [2, 0]], state, createMockTools({ changeValue }))
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
        } as any
      },
      fields: {
        'foo[0]': {
          name: 'foo[0]',
          blur: blur0,
          change: change0,
          focus: focus0,
          touched: false,
          error: 'Second Error',
          lastFieldState: undefined
        }
      }
    })
  })

  it('should return undefined if array is undefined', () => {
    const op = getOp([0, 1])
    const result = op(undefined)
    expect(result).toBeUndefined()
  })

  it('should keep the original state if no indexes are specified to be removed', () => {
    const array = ['a', 'b', 'c', 'd', 'e']
    function blur0() { }
    function change0() { }
    function focus0() { }
    const state: MutableState<any> = {
      formState: {
        values: {
          foo: array
        } as any
      },
      fields: {
        'foo[0]': {
          name: 'foo[0]',
          blur: blur0,
          change: change0,
          focus: focus0,
          touched: true,
          error: 'A Error'
        } as any
      }
    }
    const changeValue = jest.fn()
    const returnValue = removeBatch(['foo[0]', []], state, createMockTools({ changeValue }))
    expect(returnValue).toEqual([])
    expect(state.formState.values.foo).toBe(array) // no change
    expect(state).toEqual({
      formState: {
        values: {
          foo: array
        } as any
      },
      fields: {
        'foo[0]': {
          name: 'foo[0]',
          blur: blur0,
          change: change0,
          focus: focus0,
          touched: true,
          error: 'A Error'
        } as any
      }
    })
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
    const changeValue = (state: any, name: string, mutate: (value: any) => any) => {
      const before = getIn(state.formState.values, name)
      const after = mutate(before)
      state.formState.values = setIn(state.formState.values, name, after) || {}
    }
    function blur0() { }
    function blur1() { }
    function blur2() { }
    function blur3() { }
    function blur4() { }
    function change0() { }
    function change1() { }
    function change2() { }
    function change3() { }
    function change4() { }
    function focus0() { }
    function focus1() { }
    function focus2() { }
    function focus3() { }
    function focus4() { }
    const state: MutableState<any> = {
      formState: {
        values: {
          foo: array,
          anotherField: 42
        } as any
      },
      fields: {
        'foo[4]': {
          name: 'foo[4]',
          blur: blur4,
          change: change4,
          focus: focus4,
          touched: true,
          error: 'E Error'
        } as any,
        'foo[0]': {
          name: 'foo[0]',
          blur: blur0,
          change: change0,
          focus: focus0,
          touched: true,
          error: 'A Error'
        } as any,
        'foo[1]': {
          name: 'foo[1]',
          blur: blur1,
          change: change1,
          focus: focus1,
          touched: false,
          error: 'B Error'
        } as any,
        'foo[2]': {
          name: 'foo[2]',
          blur: blur2,
          change: change2,
          focus: focus2,
          touched: true,
          error: 'C Error'
        } as any,
        'foo[3]': {
          name: 'foo[3]',
          blur: blur3,
          change: change3,
          focus: focus3,
          touched: false,
          error: 'D Error'
        } as any,
        anotherField: {
          name: 'anotherField',
          touched: false
        }
      }
    }
    const returnValue = removeBatch(['foo', [1, 3]], state, createMockTools({ changeValue }))
    expect(returnValue).toEqual(['b', 'd'])
    expect(state.formState.values.foo).not.toBe(array) // copied
    expect(state).toEqual({
      formState: {
        values: {
          foo: ['a', 'c', 'e'],
          anotherField: 42
        } as any
      },
      fields: {
        'foo[2]': {
          name: 'foo[2]',
          blur: blur2,
          change: change2,
          focus: focus2,
          touched: true,
          error: 'E Error',
          lastFieldState: undefined
        },
        'foo[0]': {
          name: 'foo[0]',
          blur: blur0,
          change: change0,
          focus: focus0,
          touched: true,
          error: 'A Error',
          lastFieldState: undefined
        },
        'foo[1]': {
          name: 'foo[1]',
          blur: blur1,
          change: change1,
          focus: focus1,
          touched: true,
          error: 'C Error',
          lastFieldState: undefined
        },
        anotherField: {
          name: 'anotherField',
          touched: false
        }
      }
    })
  })

  it('should adjust higher indexes when removing (nested arrays)', () => {
    const array = ['a', 'b', 'c', 'd', 'e']
    // implementation of changeValue taken directly from Final Form
    const changeValue = (state: any, name: string, mutate: (value: any) => any) => {
      const before = getIn(state.formState.values, name)
      const after = mutate(before)
      state.formState.values = setIn(state.formState.values, name, after) || {}
    }
    function blur0() { }
    function blur1() { }
    function blur2() { }
    function blur3() { }
    function blur4() { }
    function change0() { }
    function change1() { }
    function change2() { }
    function change3() { }
    function change4() { }
    function focus0() { }
    function focus1() { }
    function focus2() { }
    function focus3() { }
    function focus4() { }
    const state: MutableState<any> = {
      formState: {
        values: {
          foo: [array],
          anotherField: 42
        } as any
      },
      fields: {
        'foo[0][4]': {
          name: 'foo[0][4]',
          blur: blur4,
          change: change4,
          focus: focus4,
          touched: true,
          error: 'E Error'
        } as any,
        'foo[0][0]': {
          name: 'foo[0][0]',
          blur: blur0,
          change: change0,
          focus: focus0,
          touched: true,
          error: 'A Error'
        } as any,
        'foo[0][1]': {
          name: 'foo[0][1]',
          blur: blur1,
          change: change1,
          focus: focus1,
          touched: false,
          error: 'B Error'
        } as any,
        'foo[0][2]': {
          name: 'foo[0][2]',
          blur: blur2,
          change: change2,
          focus: focus2,
          touched: true,
          error: 'C Error'
        } as any,
        'foo[0][3]': {
          name: 'foo[0][3]',
          blur: blur3,
          change: change3,
          focus: focus3,
          touched: false,
          error: 'D Error'
        } as any,
        anotherField: {
          name: 'anotherField',
          touched: false
        }
      }
    }
    const returnValue = removeBatch(['foo[0]', [1, 3]], state, createMockTools({ changeValue }))
    expect(returnValue).toEqual(['b', 'd'])
    expect(state.formState.values.foo).not.toBe(array) // copied
    expect(state).toEqual({
      formState: {
        values: {
          foo: [['a', 'c', 'e']],
          anotherField: 42
        } as any
      },
      fields: {
        'foo[0][2]': {
          name: 'foo[0][2]',
          blur: blur2,
          change: change2,
          focus: focus2,
          touched: true,
          error: 'E Error',
          lastFieldState: undefined
        },
        'foo[0][0]': {
          name: 'foo[0][0]',
          blur: blur0,
          change: change0,
          focus: focus0,
          touched: true,
          error: 'A Error',
          lastFieldState: undefined
        },
        'foo[0][1]': {
          name: 'foo[0][1]',
          blur: blur1,
          change: change1,
          focus: focus1,
          touched: true,
          error: 'C Error',
          lastFieldState: undefined
        },
        anotherField: {
          name: 'anotherField',
          touched: false
        }
      }
    })
  })

  it('should return undefined when removing all elements', () => {
    const op = getOp([0, 1])
    const result = op(['a', 'b'])
    expect(result).toBeUndefined()
  })
})

describe('removeBatch - Issue #97', () => {
  it('should correctly remove items when indices are double-digit and not pre-sorted', () => {
    const form = makeForm()
    const mutators = createArrayMutators()
    const state = form.getState()

    // Create array with 20 items
    for (let i = 0; i < 20; i++) {
      state.formState.values.foo = state.formState.values.foo || []
      state.formState.values.foo.push({ id: i + 1 })
    }

    // Remove items at indices 4-16 (should keep items with id 1-4 and 17-20)
    const indicesToRemove = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
    
    // Call removeBatch
    mutators.removeBatch(['foo', indicesToRemove], state, form.getTools())

    // Should have 7 items left (indices 0-3 and 17-19)
    expect(state.formState.values.foo).toHaveLength(7)
    expect(state.formState.values.foo.map((item: any) => item.id)).toEqual([
      1, 2, 3, 4, // First 4 kept
      17, 18, 19, 20 // Last 4 kept
    ])
  })
})
