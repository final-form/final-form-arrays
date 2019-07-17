// @flow
import type { MutableState, Mutator, Tools } from 'final-form'
import moveFieldState from './moveFieldState'

const swap: Mutator<any> = (
  [name, indexA, indexB]: any[],
  state: MutableState<any>,
  { changeValue }: Tools<any>
) => {
  if (indexA === indexB) {
    return
  }
  changeValue(state, name, (array: ?(any[])): any[] => {
    const copy = [...(array || [])]
    const a = copy[indexA]
    copy[indexA] = copy[indexB]
    copy[indexB] = a
    return copy
  })
  // swap all field state that begin with "name[indexA]" with that under "name[indexB]"
  const aPrefix = `${name}[${indexA}]`
  const bPrefix = `${name}[${indexB}]`
  Object.keys(state.fields).forEach(key => {
    if (key.substring(0, aPrefix.length) === aPrefix) {
      const suffix = key.substring(aPrefix.length)
      const aKey = aPrefix + suffix
      const bKey = bPrefix + suffix
      const fieldA = state.fields[aKey]

      moveFieldState(state, state.fields[bKey], aKey)
      moveFieldState(state, fieldA, bKey)
    }
  })
}

export default swap
