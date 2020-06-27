// @flow
import type { MutableState, Mutator, Tools } from 'final-form'
import moveFieldState from './moveFieldState'
import { escapeRegexTokens } from './utils'

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

  const backup = { ...state, fields: { ...state.fields } }

  // now we have increment any higher indexes
  const pattern = new RegExp(`^${escapeRegexTokens(name)}\\[(\\d+)\\](.*)`)

  // we need to increment high indices first so
  // lower indices won't overlap
  Object.keys(state.fields)
    .sort()
    .reverse()
    .forEach(key => {
      const tokens = pattern.exec(key)
      if (tokens) {
        const fieldIndex = Number(tokens[1])
        if (fieldIndex >= index) {
          // inc index one higher
          const incrementedKey = `${name}[${fieldIndex + 1}]${tokens[2]}`
          moveFieldState(state, backup.fields[key], incrementedKey, backup)
        }
      }
    })
}

export default insert
