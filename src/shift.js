// @flow
import type { MutableState, Mutator, Tools } from 'final-form'
import remove from './remove'

const shift: Mutator = ([name]: any[], state: MutableState, tools: Tools) =>
  remove([name, 0], state, tools)

export default shift
