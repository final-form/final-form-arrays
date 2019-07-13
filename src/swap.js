// @flow
import type { MutableState, Mutator, Tools } from 'final-form'

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

      moveFieldState({
        destKey: aKey,
        source: state.fields[bKey]
      })
      moveFieldState({
        destKey: bKey,
        source: fieldA
      })
    }
  })

  function moveFieldState({ destKey, source }) {
    state.fields[destKey] = {
      ...source,
      name: destKey,
      change: state.fields[destKey].change, // prevent functions from being overwritten
      blur: state.fields[destKey].blur,
      focus: state.fields[destKey].focus,
      lastFieldState: undefined // clearing lastFieldState forces renotification
    }
  }
}

export default swap
