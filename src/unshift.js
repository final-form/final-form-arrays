// @flow
import type { MutableState, Mutator, Tools } from 'final-form'

const unshift: Mutator = (
  [name, value]: any[],
  state: MutableState,
  { changeValue }: Tools
) => {
  changeValue(
    state,
    name,
    (array: ?(any[])): any[] => (array ? [value, ...array] : [value])
  )
}

export default unshift
