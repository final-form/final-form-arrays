# This documentation is meant to be read on [final-form.org](https://final-form.org/docs/final-form-arrays/api). Links may not work on Github.com.

# API

This library provides the following Final Form [mutators](/docs/final-form/types/Mutator). They are intended to mimic the array mutations available [`Array.prototype`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/prototype) in JavaScript.

The `name` argument always refers to the field to be mutated.

### `form.mutators.concat`

```ts
(name: string, value: Array<any>) => void
```

Concatenates an array at the end of the field array.

### `form.mutators.insert`

```ts
(name: string, index: number, value: any) => void`
```

Inserts a value into the specified index of the field array.

### `form.mutators.move`

```ts
(name: string, from: number, to: number) => void
```

Moves a value from one index to another index in the field array.

### `form.mutators.pop`

<!-- prettier-ignore -->
```ts
(name: string) => any
```

Pops a value off the end of an field array. Returns the value.

### `form.mutators.push`

```ts
(name: string, value: any) => void
```

Pushes a value onto the end of an field array.

### `form.mutators.remove`

<!-- prettier-ignore -->
```ts
(name: string, index: number) => any
```

Removes a value from the specified index of the field array. Returns the removed value.

### `form.mutators.removeBatch`

```ts
(name: string, indexes: Array<number>) => void
```

Removes the values at the specified indexes of the field array.

### `form.mutators.shift`

<!-- prettier-ignore -->
```ts
(name: string) => any
```

Removes a value from the beginning of the field array. Returns the value.

### `form.mutators.swap`

```ts
(name: string, indexA: number, indexB: number) => void
```

Swaps the position of two values in the field array.

### `form.mutators.unshift`

```ts
(name: string, value: any) => void
```

Inserts a value onto the beginning of the field array.

### `form.mutators.update`

```ts
(name: string, index: number, value: any) => void
```

Updates a value of the specified index of the field array.
