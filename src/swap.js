// @flow
import type { MutableState, Mutator, Tools } from 'final-form'

type Args = [string, number, number]

const swap: Mutator = (
  [name, indexA, indexB]: Args,
  state: MutableState,
  { changeValue }: Tools
) => {
  changeValue(state, name, (array: ?(any[])): any[] => {
    const copy = [...(array || [])]
    const a = copy[indexA]
    copy[indexA] = copy[indexB]
    copy[indexB] = a
    return copy
  })
}

export default swap
