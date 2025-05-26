import { MutableState, Mutator, Tools } from 'final-form'
import copyField from './copyField'
import { escapeRegexTokens } from './utils'

const insert: Mutator<any> = (
  [name, index, value]: any[],
  state: MutableState<any>,
  { changeValue }: Tools<any>
): void => {
  changeValue(state, name, (array?: any[]): any[] => {
    const copy = [...(array || [])]
    copy.splice(index, 0, value)
    return copy
  })

  // now increment any higher indices
  const pattern = new RegExp(`^${escapeRegexTokens(name)}\\[(\\d+)\\](.*)`)
  const newFields: { [key: string]: any } = {}
  Object.keys(state.fields).forEach(key => {
    const tokens = pattern.exec(key)
    if (tokens) {
      const fieldIndex = Number(tokens[1])
      if (fieldIndex >= index) {
        // Shift all higher indices up
        const incrementedKey = `${name}[${fieldIndex + 1}]${tokens[2]}`
        copyField(state.fields, key, newFields, incrementedKey)
        return
      }
    }

    // Keep this field that does not match the name,
    // or has index smaller than what is being inserted
    newFields[key] = state.fields[key]
  })

  state.fields = newFields
}

export default insert 