// @flow
import type { MutableState, Mutator, Tools } from 'final-form'
import insert from './insert'

const unshift: Mutator = (
  [name, value]: any[],
  state: MutableState,
  tools: Tools
) => insert([name, 0, value], state, tools)

export default unshift
