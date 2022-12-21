import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import json from "@rollup/plugin-json";

const extensions = [
  '.js', '.jsx', '.ts', '.tsx',
];

const name = 'bk_utils';
const globals = {
  '@tensorflow/tfjs': 'tf',
  '@tensorflow/tfjs-node': 'tf',
};

export default {
  input: './src/utils/node-utilities.ts',

  // Specify here external modules which you don't want to include in your bundle (for instance: 'lodash', 'moment' etc.)
  // https://rollupjs.org/guide/en/#external
  external: [
    '@tensorflow/tfjs',
    '@tensorflow/tfjs-node',
    'chalk',
    'fs',
    'path'
  ],

  plugins: [
    // Allows node_modules resolution
    resolve({ extensions }),

    // Allow bundling cjs modules. Rollup doesn't understand cjs
    commonjs(),

    // Compile TypeScript/JavaScript files
    babel({
      extensions,
      babelHelpers: 'bundled',
      include: ['src/**/*'],
    }),

    json(),
  ],

  output: [{
    file: './dist/utils/utils.cjs',
    format: 'cjs',
  }, {
    file: './dist/utils/utils.mjs',
    format: 'es',
  },],
};