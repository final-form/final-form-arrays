// @flow
import type { MutableState, Mutator, Tools } from 'final-form'

const move: Mutator<any> = (
  [name, from, to]: any[],
  state: MutableState<any>,
  { changeValue }: Tools<any>
) => {
  if (from === to) {
    return
  }
  changeValue(state, name, (array: ?(any[])): any[] => {
    const copy = [...(array || [])]
    const value = copy[from]
    copy.splice(from, 1)
    copy.splice(to, 0, value)
    return copy
  })
  const fromPrefix = `${name}[${from}]`
  Object.keys(state.fields).forEach(key => {
    if (key.substring(0, fromPrefix.length) === fromPrefix) {
      const suffix = key.substring(fromPrefix.length)
      const fromKey = fromPrefix + suffix
      const backup = state.fields[fromKey]
      if (from < to) {
        // moving to a higher index
        // decrement all indices between from and to
        for (let i = from; i < to; i++) {
          const destKey = `${name}[${i}]${suffix}`
          moveFieldState({
            destKey,
            source: state.fields[`${name}[${i + 1}]${suffix}`]
          })
        }
      } else {
        // moving to a lower index
        // increment all indices between to and from
        for (let i = from; i > to; i--) {
          const destKey = `${name}[${i}]${suffix}`
          moveFieldState({
            destKey,
            source: state.fields[`${name}[${i - 1}]${suffix}`]
          })
        }
      }
      const toKey = `${name}[${to}]${suffix}`
      moveFieldState({
        destKey: toKey,
        source: backup
      })
    }
  })

  function moveFieldState({ destKey, source }) {
    state.fields[destKey] = {
      ...source,
      name: destKey,
      // prevent functions from being overwritten
      // if the state.fields[destKey] does not exist, it will be created
      // when that field gets registered, with its own change/blur/focus callbacks
      change: state.fields[destKey] && state.fields[destKey].change,
      blur: state.fields[destKey] && state.fields[destKey].blur,
      focus: state.fields[destKey] && state.fields[destKey].focus,
      forceUpdate: true,
      lastFieldState: undefined // clearing lastFieldState forces renotification
    }
  }
}

export default move
