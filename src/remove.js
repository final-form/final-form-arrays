// @flow
import type { MutableState, Mutator, Tools } from 'final-form'
import moveFieldState from './moveFieldState'
import { escapeRegexTokens } from './utils'

const remove: Mutator<any> = (
  [name, index]: any[],
  state: MutableState<any>,
  { changeValue, renameField, getIn, setIn }: Tools<any>
) => {
  let returnValue
  changeValue(state, name, (array: ?(any[])): any[] => {
    const copy = [...(array || [])]
    returnValue = copy[index]
    copy.splice(index, 1)
    return copy
  })

  // now we have to remove any subfields for our index,
  // and decrement all higher indexes.
  const pattern = new RegExp(`^${escapeRegexTokens(name)}\\[(\\d+)\\](.*)`)
  const backup = { ...state, fields: { ...state.fields } }
  Object.keys(state.fields).forEach(key => {
    const tokens = pattern.exec(key)
    if (tokens) {
      const fieldIndex = Number(tokens[1])
      if (fieldIndex === index) {
        // delete any subfields for this array item
        delete state.fields[key]
        // delete any submitErrors for this array item
        // if the root key of the delete index
        if (key === `${name}[${index}]`) {
          const path = `formState.submitErrors.${name}`
          const submitErrors = getIn(state, path)
          // if has submitErrors for array
          if (Array.isArray(submitErrors)) {
            submitErrors.splice(index, 1)
            state = setIn(state, path, submitErrors)
          }
        }
      } else if (fieldIndex > index) {
        // shift all higher ones down
        delete state.fields[key]
        const decrementedKey = `${name}[${fieldIndex - 1}]${tokens[2]}`
        if (backup.fields[decrementedKey]) {
          moveFieldState(state, backup.fields[key], decrementedKey)
        } else {
          // take care of setting the correct change, blur, focus, validators on new field
          renameField(state, key, decrementedKey)
        }
      }
    }
  })
  return returnValue
}

export default remove
