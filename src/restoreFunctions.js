// @flow
import type { MutableState } from 'final-form'

function restoreFunctions(
  state: MutableState<any>,
  backupState: MutableState<any>
) {
  Object.keys(state.fields).forEach(key => {
    state.fields[key] = {
      ...state.fields[key],
      change: state.fields[key].change || (backupState.fields[key] && backupState.fields[key].change),
      blur: state.fields[key].blur || (backupState.fields[key] && backupState.fields[key].blur),
      focus: state.fields[key].focus || (backupState.fields[key] && backupState.fields[key].focus)
    }
    if (!state.fields[key].change) {
      delete state.fields[key].change;
    }
    if (!state.fields[key].blur) {
      delete state.fields[key].blur;
    }
    if (!state.fields[key].focus) {
      delete state.fields[key].focus;
    }
  })
}
export default restoreFunctions
