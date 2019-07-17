// @flow
import type { MutableState, Mutator, Tools } from 'final-form'
import moveFieldState from './moveFieldState'

const insert: Mutator<any> = (
  [name, index, value]: any[],
  state: MutableState<any>,
  { changeValue, resetFieldState }: Tools<any>
) => {
  changeValue(state, name, (array: ?(any[])): any[] => {
    const copy = [...(array || [])]
    copy.splice(index, 0, value)
    return copy
  })

  // now we have increment any higher indexes
  const pattern = new RegExp(`^${name}\\[(\\d+)\\](.*)`)
  const backup = { ...state.fields }
  Object.keys(state.fields).forEach(key => {
    const tokens = pattern.exec(key)
    if (tokens) {
      const fieldIndex = Number(tokens[1])
      if (fieldIndex >= index) {
        // inc index one higher
        const incrementedKey = `${name}[${fieldIndex + 1}]${tokens[2]}`
        moveFieldState(state, backup[key], incrementedKey)
      }
      if (fieldIndex === index) {
        resetFieldState(key)
      }
    }
  })
}

export default insert
