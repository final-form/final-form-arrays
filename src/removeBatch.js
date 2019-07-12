// @flow
import type { MutableState, Mutator, Tools } from 'final-form'

const removeBatch: Mutator = (
  [name, indexes]: any[],
  state: MutableState,
  { changeValue }: Tools
) => {
  changeValue(
    state,
    name,
    (array: ?(any[])): ?(any[]) => {
      if (!array || !indexes) {
        return array
      }

      let mask = new Array(indexes.length)
      for (let i = 0; i < indexes.length; i++) {
        mask[indexes[i]] = true
      }

      let offset = 0
      for (let i = 0; i < array.length; i++) {
        if (mask[i] === undefined) {
          array[offset] = array[i]
          offset++
        }
      }

      array.length = offset
      return array
    }
  )
}

export default removeBatch
