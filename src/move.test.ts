import move from './move'
import { getIn, setIn, MutableState } from 'final-form'
import { createMockTools } from './testUtils'

describe('move', () => {
  const getOp = (from: any, to: any) => {
    const changeValue = jest.fn()
    const mockTools = createMockTools({ changeValue })
    move(['foo', from, to], { fields: {} } as any, mockTools)
    return changeValue.mock.calls[0][2]
  }

  it('should do nothing if from and to are equal', () => {
    const changeValue = jest.fn()
    const mockTools = createMockTools({ changeValue })
    const result = move(['foo', 1, 1], { fields: {} } as any, mockTools)
    expect(result).toBeUndefined()
    expect(changeValue).not.toHaveBeenCalled()
  })

  it('should call changeValue once', () => {
    const changeValue = jest.fn()
    const state: MutableState<any> = { fields: {} } as any
    const mockTools = createMockTools({ changeValue })
    const result = move(['foo', 0, 2], state, mockTools)
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

  it('should move field state from low index to high index', () => {
    // implementation of changeValue taken directly from Final Form
    const changeValue = (state: any, name: string, mutate: (value: any) => any) => {
      const before = getIn(state.formState.values, name)
      const after = mutate(before)
      state.formState.values = setIn(state.formState.values, name, after) || {} as any
    }
    const state: MutableState<any> = {
      formState: {
        values: {
          foo: ['apple', 'banana', 'carrot', 'date']
        } as any
      },
      fields: {
        'foo[0]': {
          name: 'foo[0]',
          touched: true,
          error: 'Error A',
          lastFieldState: 'anything'
        },
        'foo[1]': {
          name: 'foo[1]',
          touched: true,
          error: 'Error B',
          lastFieldState: 'anything'
        },
        'foo[2]': {
          name: 'foo[2]',
          touched: false,
          error: 'Error C',
          lastFieldState: 'anything'
        },
        'foo[3]': {
          name: 'foo[3]',
          touched: false,
          error: 'Error D',
          lastFieldState: 'anything'
        }
      }
    }
    move(['foo', 0, 2], state, createMockTools({ changeValue }))
    expect(state).toEqual({
      formState: {
        values: {
          foo: ['banana', 'carrot', 'apple', 'date']
        } as any
      },
      fields: {
        'foo[0]': {
          name: 'foo[0]',
          touched: true,
          error: 'Error B',
          lastFieldState: undefined
        },
        'foo[1]': {
          name: 'foo[1]',
          touched: false,
          error: 'Error C',
          lastFieldState: undefined
        },
        'foo[2]': {
          name: 'foo[2]',
          touched: true,
          error: 'Error A',
          lastFieldState: undefined
        },
        'foo[3]': {
          name: 'foo[3]',
          touched: false,
          error: 'Error D',
          lastFieldState: 'anything' // unchanged
        }
      }
    })
  })

  it('should move field state from high index to low index', () => {
    // implementation of changeValue taken directly from Final Form
    const changeValue = (state: any, name: string, mutate: (value: any) => any) => {
      const before = getIn(state.formState.values, name)
      const after = mutate(before)
      state.formState.values = setIn(state.formState.values, name, after) || {} as any
    }
    const state: MutableState<any> = {
      formState: {
        values: {
          foo: ['apple', 'banana', 'carrot', 'date']
        } as any
      },
      fields: {
        'foo[0]': {
          name: 'foo[0]',
          touched: true,
          error: 'Error A',
          lastFieldState: 'anything'
        },
        'foo[1]': {
          name: 'foo[1]',
          touched: true,
          error: 'Error B',
          lastFieldState: 'anything'
        },
        'foo[2]': {
          name: 'foo[2]',
          touched: false,
          error: 'Error C',
          lastFieldState: 'anything'
        },
        'foo[3]': {
          name: 'foo[3]',
          touched: false,
          error: 'Error D',
          lastFieldState: 'anything'
        }
      }
    }
    move(['foo', 2, 0], state, createMockTools({ changeValue }))
    expect(state).toEqual({
      formState: {
        values: {
          foo: ['carrot', 'apple', 'banana', 'date']
        } as any
      },
      fields: {
        'foo[0]': {
          name: 'foo[0]',
          touched: false,
          error: 'Error C',
          lastFieldState: undefined
        },
        'foo[1]': {
          name: 'foo[1]',
          touched: true,
          error: 'Error A',
          lastFieldState: undefined
        },
        'foo[2]': {
          name: 'foo[2]',
          touched: true,
          error: 'Error B',
          lastFieldState: undefined
        },
        'foo[3]': {
          name: 'foo[3]',
          touched: false,
          error: 'Error D',
          lastFieldState: 'anything' // unchanged
        }
      }
    })
  })

  it('should move deep field state from low index to high index', () => {
    // implementation of changeValue taken directly from Final Form
    const changeValue = (state: any, name: string, mutate: (value: any) => any) => {
      const before = getIn(state.formState.values, name)
      const after = mutate(before)
      state.formState.values = setIn(state.formState.values, name, after) || {} as any
    }
    const state: MutableState<any> = {
      formState: {
        values: {
          foo: [
            { dog: 'apple dog', cat: 'apple cat' },
            { dog: 'banana dog', cat: 'banana cat' },
            { dog: 'carrot dog', cat: 'carrot cat' },
            { dog: 'date dog', cat: 'date cat' }
          ]
        }
      },
      fields: {
        'foo[0].dog': {
          name: 'foo[0].dog',
          touched: true,
          error: 'Error A Dog'
        } as any,
        'foo[0].cat': {
          name: 'foo[0].cat',
          touched: false,
          error: 'Error A Cat'
        } as any,
        'foo[1].dog': {
          name: 'foo[1].dog',
          touched: true,
          error: 'Error B Dog'
        } as any,
        'foo[1].cat': {
          name: 'foo[1].cat',
          touched: true,
          error: 'Error B Cat'
        } as any,
        'foo[2].dog': {
          name: 'foo[2].dog',
          touched: true,
          error: 'Error C Dog'
        } as any,
        'foo[2].cat': {
          name: 'foo[2].cat',
          touched: false,
          error: 'Error C Cat'
        } as any,
        'foo[3].dog': {
          name: 'foo[3].dog',
          touched: false,
          error: 'Error D Dog'
        } as any,
        'foo[3].cat': {
          name: 'foo[3].cat',
          touched: true,
          error: 'Error D Cat'
        } as any
      }
    }
    move(['foo', 0, 2], state, createMockTools({ changeValue }))
    expect(state).toMatchObject({
      formState: {
        values: {
          foo: [
            { dog: 'banana dog', cat: 'banana cat' },
            { dog: 'carrot dog', cat: 'carrot cat' },
            { dog: 'apple dog', cat: 'apple cat' },
            { dog: 'date dog', cat: 'date cat' }
          ]
        }
      },
      fields: {
        'foo[0].dog': {
          name: 'foo[0].dog',
          touched: true,
          error: 'Error B Dog',
          lastFieldState: undefined
        },
        'foo[0].cat': {
          name: 'foo[0].cat',
          touched: true,
          error: 'Error B Cat'
        } as any,
        'foo[1].dog': {
          name: 'foo[1].dog',
          touched: true,
          error: 'Error C Dog'
        } as any,
        'foo[1].cat': {
          name: 'foo[1].cat',
          touched: false,
          error: 'Error C Cat'
        } as any,
        'foo[2].dog': {
          name: 'foo[2].dog',
          touched: true,
          error: 'Error A Dog',
          lastFieldState: undefined
        },
        'foo[2].cat': {
          name: 'foo[2].cat',
          touched: false,
          error: 'Error A Cat',
          lastFieldState: undefined
        },
        'foo[3].dog': {
          name: 'foo[3].dog',
          touched: false,
          error: 'Error D Dog'
        } as any,
        'foo[3].cat': {
          name: 'foo[3].cat',
          touched: true,
          error: 'Error D Cat'
        } as any
      }
    })
  })

  it('should move deep field state from high index to low index', () => {
    // implementation of changeValue taken directly from Final Form
    const changeValue = (state: any, name: string, mutate: (value: any) => any) => {
      const before = getIn(state.formState.values, name)
      const after = mutate(before)
      state.formState.values = setIn(state.formState.values, name, after) || {} as any
    }
    const state: MutableState<any> = {
      formState: {
        values: {
          foo: [
            { dog: 'apple dog', cat: 'apple cat' },
            { dog: 'banana dog', cat: 'banana cat' },
            { dog: 'carrot dog', cat: 'carrot cat' },
            { dog: 'date dog', cat: 'date cat' }
          ]
        }
      },
      fields: {
        'foo[0].dog': {
          name: 'foo[0].dog',
          touched: true,
          error: 'Error A Dog'
        } as any,
        'foo[0].cat': {
          name: 'foo[0].cat',
          touched: false,
          error: 'Error A Cat'
        } as any,
        'foo[1].dog': {
          name: 'foo[1].dog',
          touched: true,
          error: 'Error B Dog'
        } as any,
        'foo[1].cat': {
          name: 'foo[1].cat',
          touched: true,
          error: 'Error B Cat'
        } as any,
        'foo[2].dog': {
          name: 'foo[2].dog',
          touched: true,
          error: 'Error C Dog'
        } as any,
        'foo[2].cat': {
          name: 'foo[2].cat',
          touched: false,
          error: 'Error C Cat'
        } as any,
        'foo[3].dog': {
          name: 'foo[3].dog',
          touched: false,
          error: 'Error D Dog'
        } as any,
        'foo[3].cat': {
          name: 'foo[3].cat',
          touched: true,
          error: 'Error D Cat'
        } as any
      }
    }
    move(['foo', 2, 0], state, createMockTools({ changeValue }))
    expect(state).toMatchObject({
      formState: {
        values: {
          foo: [
            { dog: 'carrot dog', cat: 'carrot cat' },
            { dog: 'apple dog', cat: 'apple cat' },
            { dog: 'banana dog', cat: 'banana cat' },
            { dog: 'date dog', cat: 'date cat' }
          ]
        }
      },
      fields: {
        'foo[0].dog': {
          name: 'foo[0].dog',
          touched: true,
          error: 'Error C Dog',
          lastFieldState: undefined
        },
        'foo[0].cat': {
          name: 'foo[0].cat',
          touched: false,
          error: 'Error C Cat',
          lastFieldState: undefined
        },
        'foo[1].dog': {
          name: 'foo[1].dog',
          touched: true,
          error: 'Error A Dog'
        } as any,
        'foo[1].cat': {
          name: 'foo[1].cat',
          touched: false,
          error: 'Error A Cat'
        } as any,
        'foo[2].dog': {
          name: 'foo[2].dog',
          touched: true,
          error: 'Error B Dog',
          lastFieldState: undefined
        },
        'foo[2].cat': {
          name: 'foo[2].cat',
          touched: true,
          error: 'Error B Cat',
          lastFieldState: undefined
        },
        'foo[3].dog': {
          name: 'foo[3].dog',
          touched: false,
          error: 'Error D Dog'
        } as any,
        'foo[3].cat': {
          name: 'foo[3].cat',
          touched: true,
          error: 'Error D Cat'
        } as any
      }
    })
  })

  it('should move fields with different shapes', () => {
    // implementation of changeValue taken directly from Final Form
    const changeValue = (state: any, name: string, mutate: (value: any) => any) => {
      const before = getIn(state.formState.values, name)
      const after = mutate(before)
      state.formState.values = setIn(state.formState.values, name, after) || {} as any
    }
    const state: MutableState<any> = {
      formState: {
        values: {
          foo: [{ dog: 'apple dog', cat: 'apple cat' }, { dog: 'banana dog' }]
        } as any
      },
      fields: {
        'foo[0].dog': {
          name: 'foo[0].dog',
          touched: true,
          error: 'Error A Dog'
        } as any,
        'foo[0].cat': {
          name: 'foo[0].cat',
          touched: false,
          error: 'Error A Cat'
        } as any,
        'foo[1].dog': {
          name: 'foo[1].dog',
          touched: true,
          error: 'Error B Dog'
        } as any
      }
    }
    move(['foo', 0, 1], state, createMockTools({ changeValue }))
    expect(state).toMatchObject({
      formState: {
        values: {
          foo: [{ dog: 'banana dog' }, { dog: 'apple dog', cat: 'apple cat' }]
        } as any
      },
      fields: {
        'foo[0].dog': {
          name: 'foo[0].dog',
          touched: true,
          error: 'Error B Dog',
          lastFieldState: undefined
        },
        'foo[1].dog': {
          name: 'foo[1].dog',
          touched: true,
          error: 'Error A Dog',
          lastFieldState: undefined
        },
        'foo[1].cat': {
          name: 'foo[1].cat',
          touched: false,
          error: 'Error A Cat',
          lastFieldState: undefined
        }
      }
    })
  })
  it('should move fields with different complex not matching shapes', () => {
    // implementation of changeValue taken directly from Final Form
    const changeValue = (state: any, name: string, mutate: (value: any) => any) => {
      const before = getIn(state.formState.values, name)
      const after = mutate(before)
      state.formState.values = setIn(state.formState.values, name, after) || {} as any
    }
    const state: MutableState<any> = {
      formState: {
        values: {
          foo: [{ dog: 'apple dog', cat: 'apple cat', colors: [{ name: 'red' }, { name: 'blue' }], deep: { inside: { rock: 'black' } } },
          { dog: 'banana dog', mouse: 'mickey', deep: { inside: { axe: 'golden' } } }]
        }
      },
      fields: {
        'foo[0].dog': {
          name: 'foo[0].dog',
          touched: true,
          error: 'Error A Dog'
        } as any,
        'foo[0].cat': {
          name: 'foo[0].cat',
          touched: false,
          error: 'Error A Cat'
        } as any,
        'foo[0].colors[0].name': {
          name: 'foo[0].colors[0].name',
          touched: true,
          error: 'Error A Colors Red'
        } as any,
        'foo[0].colors[1].name': {
          name: 'foo[0].colors[1].name',
          touched: true,
          error: 'Error A Colors Blue'
        } as any,
        'foo[0].deep.inside.rock': {
          name: 'foo[0].deep.inside.rock',
          touched: true,
          error: 'Error A Deep Inside Rock Black'
        } as any,
        'foo[1].dog': {
          name: 'foo[1].dog',
          touched: true,
          error: 'Error B Dog'
        } as any,
        'foo[1].mouse': {
          name: 'foo[1].mouse',
          touched: true,
          error: 'Error B Mickey'
        } as any,
        'foo[1].deep.inside.axe': {
          name: 'foo[1].deep.inside.axe',
          touched: true,
          error: 'Error B Deep Inside Axe Golden'
        } as any,
      }
    }
    move(['foo', 0, 1], state, createMockTools({ changeValue }))
    expect(state).toMatchObject({
      formState: {
        values: {
          foo: [{ dog: 'banana dog', mouse: 'mickey', deep: { inside: { axe: 'golden' } } },
          { dog: 'apple dog', cat: 'apple cat', colors: [{ name: 'red' }, { name: 'blue' }], deep: { inside: { rock: 'black' } } }]
        }
      },
      fields: {
        'foo[0].dog': {
          name: 'foo[0].dog',
          touched: true,
          error: 'Error B Dog',
          lastFieldState: undefined
        },
        'foo[0].mouse': {
          name: 'foo[0].mouse',
          touched: true,
          error: 'Error B Mickey',
          lastFieldState: undefined
        },
        'foo[0].deep.inside.axe': {
          name: 'foo[0].deep.inside.axe',
          touched: true,
          error: 'Error B Deep Inside Axe Golden'
        } as any,
        'foo[1].dog': {
          name: 'foo[1].dog',
          touched: true,
          error: 'Error A Dog',
          lastFieldState: undefined
        },
        'foo[1].cat': {
          name: 'foo[1].cat',
          touched: false,
          error: 'Error A Cat',
          lastFieldState: undefined
        },
        'foo[1].colors[0].name': {
          name: 'foo[1].colors[0].name',
          touched: true,
          error: 'Error A Colors Red',
          lastFieldState: undefined
        },
        'foo[1].colors[1].name': {
          name: 'foo[1].colors[1].name',
          touched: true,
          error: 'Error A Colors Blue',
          lastFieldState: undefined
        },
        'foo[1].deep.inside.rock': {
          name: 'foo[1].deep.inside.rock',
          touched: true,
          error: 'Error A Deep Inside Rock Black'
        } as any,
      }
    })
  })

  it('should preserve functions in field state', () => {
    // implementation of changeValue taken directly from Final Form
    const changeValue = (state: any, name: string, mutate: (value: any) => any) => {
      const before = getIn(state.formState.values, name)
      const after = mutate(before)
      state.formState.values = setIn(state.formState.values, name, after) || {} as any
    }
    const state: MutableState<any> = {
      formState: {
        values: {
          foo: ['apple', 'banana', 'carrot', 'date']
        } as any
      },
      fields: {
        'foo[0]': {
          name: 'foo[0]',
          touched: true,
          error: 'Error A',
          lastFieldState: 'anything',
          change: () => 'foo[0]'
        },
        'foo[1]': {
          name: 'foo[1]',
          touched: true,
          error: 'Error B',
          lastFieldState: 'anything',
          change: () => 'foo[1]'
        },
        'foo[2]': {
          name: 'foo[2]',
          touched: false,
          error: 'Error C',
          lastFieldState: 'anything',
          change: () => 'foo[2]'
        },
        'foo[3]': {
          name: 'foo[3]',
          touched: false,
          error: 'Error D',
          lastFieldState: 'anything',
          change: () => 'foo[3]'
        }
      }
    }
    move(['foo', 0, 2], state, createMockTools({ changeValue }))
    expect(state.fields['foo[0]'].change()).toBe('foo[0]')
    expect(state.fields['foo[1]'].change()).toBe('foo[1]')
    expect(state.fields['foo[2]'].change()).toBe('foo[2]')
    expect(state.fields['foo[3]'].change()).toBe('foo[3]')
  })
})
