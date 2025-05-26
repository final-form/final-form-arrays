import { MutableState, Mutator, Tools } from 'final-form'

const update: Mutator<any> = (
  [name, index, value]: any[],
  state: MutableState<any>,
  { changeValue }: Tools<any>
): void => {
  changeValue(state, name, (array?: any[]): any[] => {
    const copy = [...(array || [])]
    copy.splice(index, 1, value)
    return copy
  })
}

export default update 