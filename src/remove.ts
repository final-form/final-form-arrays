import { MutableState, Mutator, Tools } from 'final-form'
import copyField from './copyField'
import { escapeRegexTokens } from './utils'

const remove: Mutator<any> = (
  [name, index]: any[],
  state: MutableState<any>,
  { changeValue, getIn, setIn }: Tools<any>
): any => {
  let returnValue: any
  changeValue(state, name, (array?: any[]): any[] | undefined => {
    if (!array) {
      return array
    }

    const copy = [...array]
    returnValue = copy[index]
    copy.splice(index, 1)
    return copy // Return empty array instead of undefined
  })

  // now we have to remove any subfields for our index,
  // and decrement all higher indexes.
  const pattern = new RegExp(`^${escapeRegexTokens(name)}\\[(\\d+)\\](.*)`)
  const newFields: { [key: string]: any } = {}
  Object.keys(state.fields).forEach(key => {
    const tokens = pattern.exec(key)
    if (tokens) {
      const fieldIndex = Number(tokens[1])
      if (fieldIndex === index) {
        // delete any submitErrors for this array item
        // if the root key of the delete index
        if (key === `${name}[${index}]`) {
          const path = `formState.submitErrors.${name}`
          const submitErrors = getIn(state, path)
          // if has submitErrors for array
          if (Array.isArray(submitErrors)) {
            submitErrors.splice(index, 1)
            setIn(state, path, submitErrors)
          }
        }

        return
      }

      if (fieldIndex > index) {
        // Shift all higher indices down
        const decrementedKey = `${name}[${fieldIndex - 1}]${tokens[2]}`
        copyField(state.fields, key, newFields, decrementedKey)
        return
      }
    }

    // Keep this field that does not match the name,
    // or has index smaller than what is being removed
    newFields[key] = state.fields[key]
  })

  state.fields = newFields
  return returnValue
}

export default remove 