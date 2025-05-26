import { MutableState, Mutator, Tools } from 'final-form'

const push: Mutator<any> = (
  [name, value]: any[],
  state: MutableState<any>,
  { changeValue }: Tools<any>
): void => {
  changeValue(state, name, (array?: any[]): any[] =>
    array ? [...array, value] : [value]
  )
}

export default push 