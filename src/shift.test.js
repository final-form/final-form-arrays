import shift from './shift'

describe('shift', () => {
  it('should call changeValue once', () => {
    const changeValue = jest.fn()
    const state = {}
    const result = shift(['foo'], state, { changeValue })
    expect(result).toBeUndefined()
    expect(changeValue).toHaveBeenCalled()
    expect(changeValue).toHaveBeenCalledTimes(1)
    expect(changeValue.mock.calls[0][0]).toBe(state)
    expect(changeValue.mock.calls[0][1]).toBe('foo')
    expect(typeof changeValue.mock.calls[0][2]).toBe('function')
  })

  it('should return undefined if array is undefined', () => {
    const changeValue = jest.fn()
    const returnValue = shift(['foo'], {}, { changeValue })
    const op = changeValue.mock.calls[0][2]
    expect(returnValue).toBeUndefined()
    const result = op(undefined)
    expect(result).toBeUndefined()
  })

  it('should return empty array if array is empty', () => {
    const changeValue = jest.fn()
    const returnValue = shift(['foo'], {}, { changeValue })
    const op = changeValue.mock.calls[0][2]
    expect(returnValue).toBeUndefined()
    const result = op([])
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(0)
  })

  it('should remove value from start of array, and return it', () => {
    const array = ['a', 'b', 'c']
    let result
    const changeValue = jest.fn((args, state, op) => {
      result = op(array)
    })
    const returnValue = shift(['foo'], {}, { changeValue })
    expect(result).not.toBe(array) // copied
    expect(returnValue).toBe('a')
    expect(Array.isArray(result)).toBe(true)
    expect(result).toEqual(['b', 'c'])
  })
})
