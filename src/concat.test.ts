import concat from './concat'
import { MutableState } from 'final-form'
import { createMockTools } from './testUtils'

describe('concat', () => {
  const getOp = (value: any) => {
    const changeValue = jest.fn()
    const mockState: MutableState<any> = {
      fieldSubscribers: {},
      fields: {},
      formState: {
        values: {}
      }
    } as any
    concat(['foo', value], mockState, createMockTools({ changeValue }))
    return changeValue.mock.calls[0][2]
  }

  it('should call changeValue once', () => {
    const changeValue = jest.fn()
    const state: MutableState<any> = {
      fieldSubscribers: {},
      fields: {},
      formState: {
        values: {}
      }
    } as any
    const result = concat(['foo', ['bar', 'baz']], state, createMockTools({ changeValue }))
    expect(result).toBeUndefined()
    expect(changeValue).toHaveBeenCalled()
    expect(changeValue).toHaveBeenCalledTimes(1)
    expect(changeValue.mock.calls[0][0]).toBe(state)
    expect(changeValue.mock.calls[0][1]).toBe('foo')
    expect(typeof changeValue.mock.calls[0][2]).toBe('function')
  })

  it('should turn undefined into an array with two values', () => {
    const op = getOp(['bar', 'baz'])
    const result = op(undefined)
    expect(Array.isArray(result)).toBe(true)
    expect(result).toEqual(['bar', 'baz'])
  })

  it('should concat the array at the end of the original array', () => {
    const op = getOp(['d', 'e'])
    const result = op(['a', 'b', 'c'])
    expect(Array.isArray(result)).toBe(true)
    expect(result).toEqual(['a', 'b', 'c', 'd', 'e'])
  })
}) 