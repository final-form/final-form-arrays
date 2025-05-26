import { MutableState, Mutator, Tools } from 'final-form'
import remove from './remove'

const shift: Mutator<any> = (
  [name]: any[],
  state: MutableState<any>,
  tools: Tools<any>
): any => remove([name, 0], state, tools)

export default shift 