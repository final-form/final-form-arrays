// @flow
import type { MutableState, Mutator, Tools } from 'final-form'
import { escapeRegexTokens } from './utils'

const pop: Mutator<any> = (
  [name]: any[],
  state: MutableState<any>,
  { changeValue }: Tools<any>
) => {
  let result
  let removedIndex: ?number
  changeValue(state, name, (array: ?(any[])): ?(any[]) => {
    if (array) {
      if (!array.length) {
        return []
      }
      removedIndex = array.length - 1
      result = array[removedIndex]
      return array.slice(0, removedIndex)
    }
  })

  // now we have to remove any subfields for our index,
  if (removedIndex !== undefined) {
    const pattern = new RegExp(
      `^${escapeRegexTokens(name)}\\[${removedIndex}].*`
    )
    Object.keys(state.fields).forEach(key => {
      if (pattern.test(key)) {
        delete state.fields[key]
      }
    })
  }
  return result
}

export default pop
