import { MutableState, Mutator, Tools } from 'final-form'
import insert from './insert'

const unshift: Mutator<any> = (
  [name, value]: any[],
  state: MutableState<any>,
  tools: Tools<any>
): void => insert([name, 0, value], state, tools)

export default unshift 