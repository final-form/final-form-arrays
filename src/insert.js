// @flow
import type { MutableState, Mutator, Tools } from 'final-form'

const insert: Mutator = (
  [name, index, value]: any[],
  state: MutableState,
  { changeValue }: Tools
) => {
  changeValue(
    state,
    name,
    (array: ?(any[])): any[] => {
      const copy = [...(array || [])]
      copy.splice(index, 0, value)
      return copy
    }
  )

  // now we have increment any higher indexes
  const pattern = new RegExp(`^${name}\\[(\\d+)\\](.*)`)
  const changes = {}
  Object.keys(state.fields).forEach(key => {
    const tokens = pattern.exec(key)
    if (tokens) {
      const fieldIndex = Number(tokens[1])
      if (fieldIndex >= index) {
        // inc index one higher
        const incrementedKey = `${name}[${fieldIndex + 1}]${tokens[2]}`
        changes[incrementedKey] = state.fields[key]
        changes[incrementedKey].name = incrementedKey
      }
      if (fieldIndex === index) {
        delete state.fields[key]
      }
    }
  })
  state.fields = { ...state.fields, ...changes }
}

export default insert
