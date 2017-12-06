# 🏁 Final Form Arrays

[![NPM Version](https://img.shields.io/npm/v/final-form-arrays.svg?style=flat)](https://www.npmjs.com/package/final-form-arrays)
[![NPM Downloads](https://img.shields.io/npm/dm/final-form-arrays.svg?style=flat)](https://www.npmjs.com/package/final-form-arrays)
[![Build Status](https://travis-ci.org/final-form/final-form-arrays.svg?branch=master)](https://travis-ci.org/final-form/final-form-arrays)
[![codecov.io](https://codecov.io/gh/final-form/final-form-arrays/branch/master/graph/badge.svg)](https://codecov.io/gh/final-form/final-form-arrays)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

Mutators for updating array fields in
[🏁 Final Form](https://github.com/final-form/final-form).

---

## Installation

```bash
npm install --save final-form-arrays
```

or

```bash
yarn add final-form-arrays
```

## Usage

```js
import { createForm } from 'final-form'
import arrayMutators from 'final-form-arrays'

// Create Form
const form = createForm({
  mutators: { ...arrayMutators },
  onSubmit
})

// push
form.mutators.push('customers', { firstName: '', lastName: '' })

// pop
const customer = form.mutators.pop('customers')
```

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->

<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

* [Mutators](#mutators)
  * [`form.mutators.insert(name: string, index:number, value: any) => undefined`](#formmutatorsinsertname-string-indexnumber-value-any--undefined)
  * [`form.mutators.move(name: string, from: number, to: number) => undefined`](#formmutatorsmovename-string-from-number-to-number--undefined)
  * [`form.mutators.pop(name: string) => any`](#formmutatorspopname-string--any)
  * [`form.mutators.push(name: string, value: any) => void`](#formmutatorspushname-string-value-any--void)
  * [`form.mutators.remove(name: string, index: number) => any`](#formmutatorsremovename-string-index-number--any)
  * [`form.mutators.shift(name: string) => any`](#formmutatorsshiftname-string--any)
  * [`form.mutators.swap(name: string, indexA: number, indexB: number) => void`](#formmutatorsswapname-string-indexa-number-indexb-number--void)
  * [`form.mutators.unshift(name: string, value: any) => void`](#formmutatorsunshiftname-string-value-any--void)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Mutators

### `form.mutators.insert(name: string, index:number, value: any) => undefined`

Inserts a value into the specified index of the array field.

### `form.mutators.move(name: string, from: number, to: number) => undefined`

Moves a value from one index to another index in the array field.

### `form.mutators.pop(name: string) => any`

Pops a value off the end of an array field. Returns the value.

### `form.mutators.push(name: string, value: any) => void`

Pushes a value onto the end of an array field.

### `form.mutators.remove(name: string, index: number) => any`

Removes a value from the specified index of the array field. Returns the removed
value.

### `form.mutators.shift(name: string) => any`

Removes a value from the beginning of the array field. Returns the value.

### `form.mutators.swap(name: string, indexA: number, indexB: number) => void`

Swaps the position of two values in the array field.

### `form.mutators.unshift(name: string, value: any) => void`

Inserts a value onto the beginning of the array field.
