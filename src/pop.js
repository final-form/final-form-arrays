// @flow
import type { MutableState, Mutator, Tools } from 'final-form'

const pop: Mutator<any> = (
  [name]: any[],
  state: MutableState<any>,
  { changeValue }: Tools<any>
) => {
  let result
  changeValue(state, name, (array: ?(any[])): ?(any[]) => {
    if (array) {
      if (!array.length) {
        return []
      }
      result = array[array.length - 1]
      return array.slice(0, array.length - 1)
    }
  })
  return result
}

export default pop
