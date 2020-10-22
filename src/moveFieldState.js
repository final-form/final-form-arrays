// @flow
import type { MutableState } from 'final-form'

function moveFieldState(
  state: MutableState<any>,
  source: Object,
  destKey: string
) {
  delete state.fields[source.name]
  state.fields[destKey] = {
    ...source,
    name: destKey,
    // we want to preserve the source functions so they do not copy from the wrong state value
    // ie if we are moving foo[0] from 0 to 1, foo[0].change should be correctly moved under foo[1].change
    // if foo[0].change returned a specific hash statically we want foo[1].change to return the same hash not what foo[1].change previously returned
    change: source.change,
    blur: source.blur,
    focus: source.focus,
    lastFieldState: undefined // clearing lastFieldState forces renotification
  }
  if (!state.fields[destKey].change) {
    delete state.fields[destKey].change
  }
  if (!state.fields[destKey].blur) {
    delete state.fields[destKey].blur
  }
  if (!state.fields[destKey].focus) {
    delete state.fields[destKey].focus
  }
}

export default moveFieldState
