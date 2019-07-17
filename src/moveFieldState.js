// @flow
import type { MutableState } from 'final-form'

function moveFieldState(
  state: MutableState<any>,
  source: Object,
  destKey: string,
  oldState: MutableState<any> = state
) {
  state.fields[destKey] = {
    ...source,
    name: destKey,
    // prevent functions from being overwritten
    // if the state.fields[destKey] does not exist, it will be created
    // when that field gets registered, with its own change/blur/focus callbacks
    change: oldState.fields[destKey] && oldState.fields[destKey].change,
    blur: oldState.fields[destKey] && oldState.fields[destKey].blur,
    focus: oldState.fields[destKey] && oldState.fields[destKey].focus,
    lastFieldState: undefined // clearing lastFieldState forces renotification
  }
}

export default moveFieldState
