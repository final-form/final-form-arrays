// tslint:disable no-console

import { Config, createForm, AnyObject } from 'final-form'
import arrayMutators from './index'
import { Mutators } from './index'

const onSubmit: Config['onSubmit'] = (values, callback) => {}

const form = createForm({
  mutators: { ...arrayMutators },
  onSubmit
})

// Get form.mutators (default as object) and cast to Mutators
const mutators: Mutators = (form.mutators as any) as Mutators

mutators.insert('customers', 0, { firstName: '', lastName: '' })
mutators.move('customers', 0, 1)
const customer = mutators.pop('customers')
mutators.push('customers', { firstName: '', lastName: '' })
const removed = mutators.remove('customers', 0)
const shifted = mutators.shift('customers')
mutators.swap('customers', 0, 1)
mutators.unshift('customers', { firstName: '', lastName: '' })
