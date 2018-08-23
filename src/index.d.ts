import { Mutator } from 'final-form'

export const insert: Mutator
export const move: Mutator
export const pop: Mutator
export const push: Mutator
export const remove: Mutator
export const shift: Mutator
export const swap: Mutator
export const update: Mutator
export const unshift: Mutator

export interface DefaultType {
  insert: Mutator
  move: Mutator
  pop: Mutator
  push: Mutator
  remove: Mutator
  shift: Mutator
  swap: Mutator
  update: Mutator
  unshift: Mutator
}

declare const d: DefaultType
export default d

/** The shape of the mutators once final-form has bound them to state */
export interface Mutators {
  insert: (name: string, index: number, value: any) => void
  move: (name: string, from: number, to: number) => void
  pop: (name: string) => any
  push: (name: string, value: any) => void
  remove: (name: string, index: number) => any
  shift: (name: string) => any
  swap: (name: string, indexA: number, indexB: number) => void
  update: (name: string, index: number, value: any) => void
  unshift: (name: string, value: any) => void
}
