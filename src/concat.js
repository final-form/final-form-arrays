// @flow
import type { MutableState, Mutator, Tools } from 'final-form'

const concat: Mutator = (
  [name, value]: any[],
  state: MutableState,
  { changeValue }: Tools
) => {
  changeValue(
    state,
    name,
    (array: ?(any[])): any[] => (array ? [...array, ...value] : value)
  )
}

export default concat
