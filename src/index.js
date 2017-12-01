// @flow
import { Mutator } from 'final-form'
import insert from './insert'
import move from './move'
import pop from './pop'
import push from './push'
import remove from './remove'
import shift from './shift'
import swap from './swap'
import unshift from './unshift'

const mutators: { [string]: Mutator } = {
  insert,
  move,
  pop,
  push,
  remove,
  shift,
  swap,
  unshift
}
export default mutators
