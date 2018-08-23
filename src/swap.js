// @flow
import type { MutableState, Mutator, Tools } from 'final-form'

const swap: Mutator = (
  [name, indexA, indexB]: any[],
  state: MutableState,
  { changeValue }: Tools
) => {
  if (indexA === indexB) {
    return
  }
  changeValue(
    state,
    name,
    (array: ?(any[])): any[] => {
      const copy = [...(array || [])]
      const a = copy[indexA]
      copy[indexA] = copy[indexB]
      copy[indexB] = a
      return copy
    }
  )
  // swap all field state that begin with "name[indexA]" with that under "name[indexB]"
  const aPrefix = `${name}[${indexA}]`
  const bPrefix = `${name}[${indexB}]`
  Object.keys(state.fields).forEach(key => {
    if (key.substring(0, aPrefix.length) === aPrefix) {
      const suffix = key.substring(aPrefix.length)
      const aKey = aPrefix + suffix
      const bKey = bPrefix + suffix
      const fieldA = state.fields[aKey]
      state.fields[aKey] = {
        ...state.fields[bKey],
        name: aKey,
        lastFieldState: undefined // clearing lastFieldState forces renotification
      }
      state.fields[bKey] = {
        ...fieldA,
        name: bKey,
        lastFieldState: undefined // clearing lastFieldState forces renotification
      }
    }
  })
}

export default swap
