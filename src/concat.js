// @flow
import type { MutableState, Mutator, Tools } from 'final-form'

const concat: Mutator<any> = (
  [name, value]: any[],
  state: MutableState<any>,
  { changeValue }: Tools<any>
) => {
  changeValue(state, name, (array: ?(any[])): any[] =>
    array ? [...array, ...value] : value
  )
}

export default concat
