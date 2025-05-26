import { Mutator } from 'final-form'
import insert from './insert'
import concat from './concat'
import move from './move'
import pop from './pop'
import push from './push'
import remove from './remove'
import removeBatch from './removeBatch'
import shift from './shift'
import swap from './swap'
import unshift from './unshift'
import update from './update'

export interface DefaultType<FormValues = any> {
  insert: Mutator<FormValues>
  concat: Mutator<FormValues>
  move: Mutator<FormValues>
  pop: Mutator<FormValues>
  push: Mutator<FormValues>
  removeBatch: Mutator<FormValues>
  remove: Mutator<FormValues>
  shift: Mutator<FormValues>
  swap: Mutator<FormValues>
  update: Mutator<FormValues>
  unshift: Mutator<FormValues>
}

const mutators: DefaultType = {
  insert,
  concat,
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

// Export individual mutators
export {
  insert,
  concat,
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

/** The shape of the mutators once final-form has bound them to state */
export interface Mutators {
  insert: (name: string, index: number, value: any) => void
  concat: (name: string, value: Array<any>) => void
  move: (name: string, from: number, to: number) => void
  pop: (name: string) => any
  push: (name: string, value: any) => void
  remove: (name: string, index: number) => any
  removeBatch: (name: string, indexes: Array<number>) => any
  shift: (name: string) => any
  swap: (name: string, indexA: number, indexB: number) => void
  update: (name: string, index: number, value: any) => void
  unshift: (name: string, value: any) => void
} 