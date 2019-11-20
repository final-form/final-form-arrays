// @flow
import type { MutableState, Mutator, Tools } from 'final-form'
import moveFieldState from './moveFieldState'
import moveFields from './moveFields';
import restoreFunctions from './restoreFunctions';

const TMP: string = 'tmp'

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

  //make a copy of a state for further functions restore
  const backupState = { ...state, fields: { ...state.fields } }

  // swap all field state that begin with "name[indexA]" with that under "name[indexB]"
  const aPrefix = `${name}[${indexA}]`
  const bPrefix = `${name}[${indexB}]`
  const tmpPrefix = `${name}[${TMP}]`

  moveFields(name, aPrefix, TMP, state)
  moveFields(name, bPrefix, indexA, state)
  moveFields(name, tmpPrefix, indexB, state)

  restoreFunctions(state, backupState)
}

export default swap
