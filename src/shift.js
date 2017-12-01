// @flow
import type { MutableState, Mutator, Tools } from 'final-form'

type Args = [string]

const shift: Mutator = (
  [name]: Args,
  state: MutableState,
  { changeValue }: Tools
) => {
  let result
  changeValue(state, name, (array: ?(any[])): ?(any[]) => {
    if (array) {
      if (!array.length) {
        return []
      }
      result = array[0]
      return array.slice(1, array.length)
    }
  })
  return result
}

export default shift
