// @flow
import type { Mutator } from 'final-form'
import insert from './insert'
import merge from './merge'
import move from './move'
import pop from './pop'
import push from './push'
import remove from './remove'
import removeBatch from './removeBatch'
import shift from './shift'
import swap from './swap'
import unshift from './unshift'
import update from './update'

const mutators: { [string]: Mutator } = {
  insert,
  merge,
  move,
  pop,
  push,
  remove,
  removeBatch,
  shift,
  swap,
  unshift,
  update
}
export default mutators
