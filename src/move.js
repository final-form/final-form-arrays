// @flow
import type { MutableState, Mutator, Tools } from 'final-form'

type Args = [string, number, number]

const move: Mutator = (
  [name, from, to]: Args,
  state: MutableState,
  { changeValue }: Tools
) => {
  changeValue(state, name, (array: ?(any[])): any[] => {
    const copy = [...(array || [])]
    const value = copy[from]
    copy.splice(from, 1)
    copy.splice(to, 0, value)
    return copy
  })
}

export default move
