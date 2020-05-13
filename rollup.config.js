import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import sourcesmaps from 'rollup-plugin-sourcemaps'
import injectProcess from './rollup-plugin-inject-process'

export default {
  input: 'sw-src/sw.js',
  output: [
    {
      sourcemap: true,
      file: 'dist/sw-needsinjecting.js',
      format: 'iife',
      name: 'wowSw', // just to silence the warning, you never need to access this
    },
  ],
  plugins: [
    nodeResolve(), // lets us find dependencies in node_modules
    commonjs(),
    injectProcess(['NODE_ENV', /VUE_APP_.*/]),
    sourcesmaps(),
  ],
}
