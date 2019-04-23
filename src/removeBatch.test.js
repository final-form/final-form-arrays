import removeBatch from './removeBatch'

describe('merge', () => {
  const getOp = value => {
    const changeValue = jest.fn()
    removeBatch(['foo', value], {}, { changeValue })
    return changeValue.mock.calls[0][2]
  }

  it('should call changeValue once', () => {
    const changeValue = jest.fn()
    const state = {}
    const result = removeBatch(['foo', [1, 2]], state, { changeValue })
    expect(result).toBeUndefined()
    expect(changeValue).toHaveBeenCalled()
    expect(changeValue).toHaveBeenCalledTimes(1)
    expect(changeValue.mock.calls[0][0]).toBe(state)
    expect(changeValue.mock.calls[0][1]).toBe('foo')
    expect(typeof changeValue.mock.calls[0][2]).toBe('function')
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
})
