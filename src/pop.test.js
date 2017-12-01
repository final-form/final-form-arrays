import pop from './pop'

describe('pop', () => {
  it('should call changeValue once', () => {
    const changeValue = jest.fn()
    const state = {}
    const result = pop(['foo'], state, { changeValue })
    expect(result).toBeUndefined()
    expect(changeValue).toHaveBeenCalled()
    expect(changeValue).toHaveBeenCalledTimes(1)
    expect(changeValue.mock.calls[0][0]).toBe(state)
    expect(changeValue.mock.calls[0][1]).toBe('foo')
    expect(typeof changeValue.mock.calls[0][2]).toBe('function')
  })

  it('should return undefined if array is undefined', () => {
    const changeValue = jest.fn()
    const returnValue = pop(['foo'], {}, { changeValue })
    const op = changeValue.mock.calls[0][2]
    expect(returnValue).toBeUndefined()
    const result = op(undefined)
    expect(result).toBeUndefined()
  })

  it('should return empty array if array is empty', () => {
    const changeValue = jest.fn()
    const returnValue = pop(['foo'], {}, { changeValue })
    const op = changeValue.mock.calls[0][2]
    expect(returnValue).toBeUndefined()
    const result = op([])
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(0)
  })

  it('should pop value off the end of array and return it', () => {
    let result
    const changeValue = jest.fn((args, state, op) => {
      result = op(['a', 'b', 'c'])
    })
    const returnValue = pop(['foo'], {}, { changeValue })
    expect(returnValue).toBe('c')
    expect(Array.isArray(result)).toBe(true)
    expect(result).toEqual(['a', 'b'])
  })
})
