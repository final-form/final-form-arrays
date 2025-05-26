import update from './update'
import { MutableState } from 'final-form'
import { createMockTools } from './testUtils'

describe('update', () => {
  const getOp = (index: number, value: any) => {
    const changeValue = jest.fn()
    const mockState: MutableState<any> = {
      fieldSubscribers: {},
      fields: {},
      formState: {
        values: {}
      }
    } as any
    update(['foo', index, value], mockState, createMockTools({ changeValue }))
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
    const result = update(['foo', 0, 'bar'], state, createMockTools({ changeValue }))
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

  it('should update value of the specified index', () => {
    const op = getOp(1, 'd')
    const array = ['a', 'b', 'c']
    const result = op(array)
    expect(result).not.toBe(array) // copied
    expect(Array.isArray(result)).toBe(true)
    expect(result).toEqual(['a', 'd', 'c'])
  })
}) 