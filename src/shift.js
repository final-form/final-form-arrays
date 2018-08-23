// @flow
import type { MutableState, Mutator, Tools } from 'final-form'

const shift: Mutator = (
  [name]: any[],
  state: MutableState,
  { changeValue }: Tools
) => {
  let result
  changeValue(
    state,
    name,
    (array: ?(any[])): ?(any[]) => {
      if (array) {
        if (!array.length) {
          return []
        }
        result = array[0]
        return array.slice(1, array.length)
      }
    }
  )
  return result
}

export default shift
