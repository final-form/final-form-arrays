import move from './move'

describe('move', () => {
  const getOp = (from, to) => {
    const changeValue = jest.fn()
    move(['foo', from, to], {}, { changeValue })
    return changeValue.mock.calls[0][2]
  }

  it('should call changeValue once', () => {
    const changeValue = jest.fn()
    const state = {}
    const result = move(['foo', 0, 2], state, { changeValue })
    expect(result).toBeUndefined()
    expect(changeValue).toHaveBeenCalled()
    expect(changeValue).toHaveBeenCalledTimes(1)
    expect(changeValue.mock.calls[0][0]).toBe(state)
    expect(changeValue.mock.calls[0][1]).toBe('foo')
    expect(typeof changeValue.mock.calls[0][2]).toBe('function')
  })

  it('should treat undefined like an empty array', () => {
    const op = getOp(0, 1)
    const result = op(undefined)
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(1)
    expect(result[0]).toBeUndefined()
    expect(result[1]).toBeUndefined()
  })

  it('should move value from one index to another', () => {
    const op = getOp(0, 2)
    const array = ['a', 'b', 'c', 'd']
    const result = op(array)
    expect(result).not.toBe(array) // copied
    expect(Array.isArray(result)).toBe(true)
    expect(result).toEqual(['b', 'c', 'a', 'd'])
  })
})
