import push from './push'
import { createMockState, createMockTools } from './testUtils'

describe('push', () => {
  const getOp = (value: any) => {
    const changeValue = jest.fn()
    const mockState = createMockState()
    const mockTools = createMockTools({ changeValue })
    push(['foo', value], mockState, mockTools)
    return changeValue.mock.calls[0][2]
  }

  it('should call changeValue once', () => {
    const changeValue = jest.fn()
    const state = createMockState()
    const tools = createMockTools({ changeValue })
    const result = push(['foo', 'bar'], state, tools)
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

  it('should push value to end of array', () => {
    const op = getOp('d')
    const result = op(['a', 'b', 'c'])
    expect(Array.isArray(result)).toBe(true)
    expect(result).toEqual(['a', 'b', 'c', 'd'])
  })
}) 