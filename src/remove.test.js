import remove from './remove'

describe('remove', () => {
  it('should call changeValue once', () => {
    const changeValue = jest.fn()
    const state = {}
    const result = remove(['foo', 0], state, { changeValue })
    expect(result).toBeUndefined()
    expect(changeValue).toHaveBeenCalled()
    expect(changeValue).toHaveBeenCalledTimes(1)
    expect(changeValue.mock.calls[0][0]).toBe(state)
    expect(changeValue.mock.calls[0][1]).toBe('foo')
    expect(typeof changeValue.mock.calls[0][2]).toBe('function')
  })

  it('should treat undefined like an empty array', () => {
    const changeValue = jest.fn()
    const returnValue = remove(['foo', 1], {}, { changeValue })
    expect(returnValue).toBeUndefined()
    const op = changeValue.mock.calls[0][2]
    const result = op(undefined)
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(0)
  })

  it('should remove value from the specified index, and return it', () => {
    const array = ['a', 'b', 'c', 'd']
    let result
    const changeValue = jest.fn((args, state, op) => {
      result = op(array)
    })
    const returnValue = remove(['foo', 1], {}, { changeValue })
    expect(returnValue).toBe('b')
    expect(result).not.toBe(array) // copied
    expect(Array.isArray(result)).toBe(true)
    expect(result).toEqual(['a', 'c', 'd'])
  })
})
