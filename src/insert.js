// @flow
import type { MutableState, Mutator, Tools } from 'final-form'

const insert: Mutator = (
  [name, index, value]: any[],
  state: MutableState,
  { changeValue }: Tools
) => {
  changeValue(
    state,
    name,
    (array: ?(any[])): any[] => {
      const copy = [...(array || [])]
      copy.splice(index, 0, value)
      return copy
    }
  )
}

export default insert
