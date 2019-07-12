// @flow
import type { MutableState, Mutator, Tools } from 'final-form'

const remove: Mutator = (
  [name, index]: any[],
  state: MutableState,
  { changeValue }: Tools
) => {
  let returnValue
  changeValue(
    state,
    name,
    (array: ?(any[])): any[] => {
      const copy = [...(array || [])]
      returnValue = copy[index]
      copy.splice(index, 1)
      return copy
    }
  )

  // now we have to remove any subfields for our index,
  // and decrement all higher indexes.
  const pattern = new RegExp(`^${name}\\[(\\d+)\\](.*)`)
  const backup = { ...state.fields }
  Object.keys(state.fields).forEach(key => {
    const tokens = pattern.exec(key)
    if (tokens) {
      const fieldIndex = Number(tokens[1])
      if (fieldIndex === index) {
        // delete any subfields for this array item
        delete state.fields[key]
      } else if (fieldIndex > index) {
        // shift all higher ones down
        delete state.fields[key]
        const decrementedKey = `${name}[${fieldIndex - 1}]${tokens[2]}`
        state.fields[decrementedKey] = backup[key]
        state.fields[decrementedKey].name = decrementedKey
      }
    }
  })
  return returnValue
}

export default remove
