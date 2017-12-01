// @flow
import type { MutableState, Mutator, Tools } from 'final-form'

type Args = [string, any]

const push: Mutator = (
  [name, value]: Args,
  state: MutableState,
  { changeValue }: Tools
) => {
  changeValue(
    state,
    name,
    (array: ?(any[])): any[] => (array ? [...array, value] : [value])
  )
}

export default push
