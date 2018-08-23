// @flow
import type { MutableState, Mutator, Tools } from 'final-form'

const remove: Mutator = (
  [name, index]: any[],
  state: MutableState,
  { changeValue }: Tools
) => {
  let returnValue
  changeValue(
    state,
    name,
    (array: ?(any[])): any[] => {
      const copy = [...(array || [])]
      returnValue = copy[index]
      copy.splice(index, 1)
      return copy
    }
  )
  return returnValue
}

export default remove
