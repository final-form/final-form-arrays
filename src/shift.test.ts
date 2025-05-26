import shift from './shift'
import { getIn, setIn, MutableState, Tools } from 'final-form'

describe('shift', () => {
  it('should call changeValue once', () => {
    const changeValue = jest.fn()
    const state: MutableState<any> = {
      formState: {
        values: {
          foo: ['one', 'two']
        }
      } as any,
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
    } as any
    const result = shift(['foo'], state, { changeValue, getIn, setIn } as unknown as Tools<any>)
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
        }
      } as any,
      fields: {}
    } as any
    const returnValue = shift(['foo'], state, { changeValue, getIn, setIn } as unknown as Tools<any>)
    expect(returnValue).toBeUndefined()
    const op = changeValue.mock.calls[0][2]
    const result = op(undefined)
    expect(result).toBeUndefined()
  })

  it('should remove first value from array and return it', () => {
    const array = ['a', 'b', 'c', 'd']
    // implementation of changeValue taken directly from Final Form
    const changeValue = (state: any, name: string, mutate: (value: any) => any) => {
      const before = getIn(state.formState.values, name)
      const after = mutate(before)
      state.formState.values = setIn(state.formState.values, name, after) || {}
    }
    const state: MutableState<any> = {
      formState: {
        values: {
          foo: array,
          anotherField: 42
        }
      } as any,
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
        } as any
      }
    } as any
    const returnValue = shift(['foo'], state, { changeValue, getIn, setIn } as unknown as Tools<any>)
    expect(returnValue).toBe('a')
    expect(state.formState.values.foo).not.toBe(array) // copied
    expect(state).toEqual({
      formState: {
        values: {
          foo: ['b', 'c', 'd'],
          anotherField: 42
        }
      },
      fields: {
        'foo[0]': {
          name: 'foo[0]',
          touched: false,
          error: 'B Error',
          lastFieldState: undefined
        },
        'foo[1]': {
          name: 'foo[1]',
          touched: true,
          error: 'C Error',
          lastFieldState: undefined
        },
        'foo[2]': {
          name: 'foo[2]',
          touched: false,
          error: 'D Error',
          lastFieldState: undefined
        },
        anotherField: {
          name: 'anotherField',
          touched: false
        }
      }
    })
  })
}) 