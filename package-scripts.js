const npsUtils = require('nps-utils')

const series = npsUtils.series
const concurrent = npsUtils.concurrent
const rimraf = npsUtils.rimraf
const crossEnv = npsUtils.crossEnv

module.exports = {
  scripts: {
    test: {
      default: crossEnv('NODE_ENV=test jest --env=node --coverage'),
      update: crossEnv(
        'NODE_ENV=test jest --env=node --coverage --updateSnapshot'
      ),
      watch: crossEnv('NODE_ENV=test jest --env=node --watch'),
      codeCov: crossEnv(
        'cat ./coverage/lcov.info | ./node_modules/codecov.io/bin/codecov.io.js'
      ),
      size: {
        description: 'check the size of the bundle',
        script: 'bundlesize'
      }
    },
    build: {
      description: 'delete the dist directory and run all builds',
      default: series(
        rimraf('dist'),
        concurrent.nps(
          'build.es',
          'build.cjs',
          'build.umd.main',
          'build.umd.min',
          'copyTypes'
        )
      ),
      es: {
        description: 'run the build with rollup (uses rollup.config.mjs)',
        script: 'rollup --config --environment FORMAT:es'
      },
      cjs: {
        description: 'run rollup build with CommonJS format',
        script: 'rollup --config --environment FORMAT:cjs'
      },
      umd: {
        min: {
          description: 'run the rollup build with sourcemaps',
          script: 'rollup --config --sourcemap --environment MINIFY,FORMAT:umd'
        },
        main: {
          description: 'builds the cjs and umd files',
          script: 'rollup --config --sourcemap --environment FORMAT:umd'
        }
      },
      andTest: series.nps('build', 'test.size')
    },
    docs: {
      description: 'Generates table of contents in README',
      script: 'doctoc README.md'
    },
    prettier: {
      description: 'Runs prettier on everything',
      script: 'prettier --write "**/*.([jt]s*)"'
    },
    copyTypes: series('tsc --declaration --emitDeclarationOnly --outDir dist'),
    lint: {
      description: 'lint the entire project',
      script: 'eslint .'
    },
    typescript: {
      description: 'typescript check the entire project',
      script: 'tsc --noEmit'
    },
    validate: {
      description:
        'This runs several scripts to make sure things look good before committing or on clean install',
      default: concurrent.nps('lint', 'typescript', 'build.andTest', 'test')
    }
  },
  options: {
    silent: false
  }
}
