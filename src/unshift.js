// @flow
import type { MutableState, Mutator, Tools } from 'final-form'

type Args = [string, any]

const unshift: Mutator = (
  [name, value]: Args,
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
