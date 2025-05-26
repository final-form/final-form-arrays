import resolve from 'rollup-plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'
import commonjs from 'rollup-plugin-commonjs'
import { uglify } from 'rollup-plugin-uglify'
import replace from 'rollup-plugin-replace'
import ts from 'typescript'

const minify = process.env.MINIFY
const format = process.env.FORMAT
const es = format === 'es'
const umd = format === 'umd'
const cjs = format === 'cjs'

let output

if (es) {
  output = { file: `dist/final-form-arrays.es.js`, format: 'es' }
} else if (umd) {
  if (minify) {
    output = {
      file: `dist/final-form-arrays.umd.min.js`,
      format: 'umd'
    }
  } else {
    output = { file: `dist/final-form-arrays.umd.js`, format: 'umd' }
  }
} else if (cjs) {
  output = { file: `dist/final-form-arrays.cjs.js`, format: 'cjs' }
} else if (format) {
  throw new Error(`invalid format specified: "${format}".`)
} else {
  throw new Error('no format specified. --environment FORMAT:xxx')
}

export default {
  input: 'src/index.ts',
  output: Object.assign(
    {
      name: 'final-form-arrays',
      exports: 'named'
    },
    output
  ),
  external: [],
  plugins: [
    resolve({
      mainFields: ['module', 'jsnext:main', 'main'],
      browser: true,
      preferBuiltins: false
    }),
    typescript({
      typescript: ts,
      clean: true,
      tsconfigOverride: {
        compilerOptions: {
          declaration: false,
          declarationMap: false
        }
      }
    }),
    commonjs({ include: 'node_modules/**' }),
    umd
      ? replace({
          'process.env.NODE_ENV': JSON.stringify(
            minify ? 'production' : 'development'
          )
        })
      : null,
    minify ? uglify() : null
  ].filter(Boolean)
}
