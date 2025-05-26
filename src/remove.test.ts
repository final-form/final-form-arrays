import remove from './remove'
import { getIn, setIn, MutableState, Tools } from 'final-form'

describe('remove', () => {
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
    const result = remove(['foo', 0], state, { changeValue, getIn, setIn } as unknown as Tools<any>)
    expect(result).toBeUndefined()
    expect(changeValue).toHaveBeenCalled()
    expect(changeValue).toHaveBeenCalledTimes(1)
    expect(changeValue.mock.calls[0][0]).toBe(state)
    expect(changeValue.mock.calls[0][1]).toBe('foo')
    expect(typeof changeValue.mock.calls[0][2]).toBe('function')
  })

  it('should treat undefined like an empty array', () => {
    const changeValue = jest.fn()
    const state: MutableState<any> = {
      formState: {
        values: {
          foo: undefined
        } as any
      },
      fields: {}
    } as any
    const returnValue = remove(['foo', 1], state, { changeValue, getIn, setIn } as unknown as Tools<any>)
    expect(returnValue).toBeUndefined()
    const op = changeValue.mock.calls[0][2]
    const result = op(undefined)
    expect(result).toBeUndefined()
  })

  it('should return undefined when removing last element from array', () => {
    const changeValue = jest.fn()
    const state: MutableState<any> = {
      formState: {
        values: {
          foo: ['only']
        } as any
      },
      fields: {}
    } as any
    remove(['foo', 0], state, { changeValue, getIn, setIn } as unknown as Tools<any>)
    const op = changeValue.mock.calls[0][2]
    const result = op(['only'])
    expect(result).toBeUndefined()
  })

  it('should remove value from the specified index, and return it', () => {
    const array = ['a', 'b', 'c', 'd']
    // implementation of changeValue taken directly from Final Form
    const changeValue = (state: any, name: string, mutate: (value: any) => any) => {
      const before = getIn(state.formState.values, name)
      const after = mutate(before)
      state.formState.values = setIn(state.formState.values, name, after) || {}
    }
    function blur0() { }
    function change0() { }
    function focus0() { }
    function blur1() { }
    function change1() { }
    function focus1() { }
    function blur2() { }
    function change2() { }
    function focus2() { }
    function blur3() { }
    function change3() { }
    function focus3() { }
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
        'foo[3]': {
          name: 'foo[3]',
          blur: blur3,
          change: change3,
          focus: focus3,
          touched: false,
          error: 'D Error'
        } as any,
        'foo[2]': {
          name: 'foo[2]',
          blur: blur2,
          change: change2,
          focus: focus2,
          touched: true,
          error: 'C Error'
        } as any,
        anotherField: {
          name: 'anotherField',
          touched: false
        }
      }
    }
    const returnValue = remove(['foo', 1], state, { changeValue, getIn, setIn } as unknown as Tools<any>)
    expect(returnValue).toBe('b')
    expect(state.formState.values.foo).not.toBe(array) // copied
    expect(state).toEqual({
      formState: {
        values: {
          foo: ['a', 'c', 'd'],
          anotherField: 42
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
        } as any,
        'foo[2]': {
          name: 'foo[2]',
          blur: blur2,
          change: change2,
          focus: focus2,
          touched: false,
          error: 'D Error',
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

  it('should remove value from the specified index, and return it (nested arrays)', () => {
    const array = ['a', 'b', 'c', 'd']
    // implementation of changeValue taken directly from Final Form
    const changeValue = (state: any, name: string, mutate: (value: any) => any) => {
      const before = getIn(state.formState.values, name)
      const after = mutate(before)
      state.formState.values = setIn(state.formState.values, name, after) || {}
    }
    function blur0() { }
    function change0() { }
    function focus0() { }
    function blur1() { }
    function change1() { }
    function focus1() { }
    function blur2() { }
    function change2() { }
    function focus2() { }
    function blur3() { }
    function change3() { }
    function focus3() { }
    const state: MutableState<any> = {
      formState: {
        values: {
          foo: [array],
          anotherField: 42
        } as any
      },
      fields: {
        'foo[0][3]': {
          name: 'foo[0][3]',
          blur: blur3,
          change: change3,
          focus: focus3,
          touched: false,
          error: 'D Error'
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
        anotherField: {
          name: 'anotherField',
          touched: false
        }
      }
    }
    const returnValue = remove(['foo[0]', 1], state, {
      changeValue,
      getIn,
      setIn
    } as unknown as Tools<any>)
    expect(returnValue).toBe('b')
    expect(state.formState.values.foo).not.toBe(array) // copied
    expect(state).toEqual({
      formState: {
        values: {
          foo: [['a', 'c', 'd']],
          anotherField: 42
        } as any
      },
      fields: {
        'foo[0][2]': {
          name: 'foo[0][2]',
          blur: blur2,
          change: change2,
          focus: focus2,
          touched: false,
          error: 'D Error',
          lastFieldState: undefined
        },
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

  it('should remove value from the specified index with submitError if one error in array', () => {
    const array = ['a', { key: 'val' }]
    const changeValue = jest.fn()
    const renameField = jest.fn()
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
          foo: array,
          anotherField: 42
        },
        submitErrors: {
          foo: [
            {
              key: 'A Submit Error'
            }
          ]
        }
      } as any,
      fields: {
        'foo[0]': {
          name: 'foo[0]',
          blur: blur0,
          change: change0,
          focus: focus0,
          touched: true,
          error: 'A Error'
        } as any,
        'foo[0].key': {
          name: 'foo[0].key',
          blur: blur2,
          change: change2,
          focus: focus2,
          touched: false,
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
        'foo[1].key': {
          name: 'foo[1].key',
          blur: blur2,
          change: change2,
          focus: focus2,
          touched: false,
          error: 'B Error'
        } as any,
        anotherField: {
          name: 'anotherField',
          touched: false
        }
      }
    } as any

    const returnValue = remove(['foo', 0], state, {
      renameField,
      changeValue,
      getIn,
      setIn
    } as unknown as Tools<any>)
    expect(returnValue).toBeUndefined()
    expect(getIn(state, 'formState.submitErrors')).toEqual({ foo: [] })
  })

  it('should remove value from the specified index with submitError if two errors in array', () => {
    const array = ['a', { key: 'val' }]
    const changeValue = jest.fn()
    const renameField = jest.fn()
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
          foo: array,
          anotherField: 42
        },
        submitErrors: {
          foo: [
            {
              key: 'A Submit Error'
            },
            {
              key: 'B Submit Error'
            }
          ]
        }
      } as any,
      fields: {
        'foo[0]': {
          name: 'foo[0]',
          blur: blur0,
          change: change0,
          focus: focus0,
          touched: true,
          error: 'A Error'
        } as any,
        'foo[0].key': {
          name: 'foo[0].key',
          blur: blur2,
          change: change2,
          focus: focus2,
          touched: false,
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
        'foo[1].key': {
          name: 'foo[1].key',
          blur: blur2,
          change: change2,
          focus: focus2,
          touched: false,
          error: 'B Error'
        } as any,
        anotherField: {
          name: 'anotherField',
          touched: false
        }
      }
    } as any

    const returnValue = remove(['foo', 0], state, {
      renameField,
      changeValue,
      getIn,
      setIn
    } as unknown as Tools<any>)
    expect(returnValue).toBeUndefined()
    expect(getIn(state, 'formState.submitErrors')).toEqual({
      foo: [{ key: 'B Submit Error' }]
    })
  })
})
