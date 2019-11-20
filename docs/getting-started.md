# This documentation is meant to be read on [final-form.org](https://final-form.org/docs/final-form-arrays/getting-started). Links may not work on Github.com.

# Getting Started

This library provides field array management functionality as a plugin [mutator](/docs/final-form/types/Mutator) to Final Form.

## Installation

```bash
npm install --save final-form final-form-arrays
```

or

```bash
yarn add final-form final-form-arrays
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

## Mutators

Check out the [API](api) to see all the mutators provided.
