import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import json from "@rollup/plugin-json";
import pkg from './package.json';

const extensions = [
  '.js', '.jsx', '.ts', '.tsx',
];

const name = 'berkelium';
const globals = {
  '@tensorflow/tfjs': 'tf',
  '@tensorflow/tfjs-node': 'tf',
  'chalk': 'chalk',
  'node-fetch': 'fetch'
};

export default {
  input: './src/index.ts',

  // Specify here external modules which you don't want to include in your bundle (for instance: 'lodash', 'moment' etc.)
  // https://rollupjs.org/guide/en/#external
  external: [
    '@tensorflow/tfjs',
    '@tensorflow/tfjs-node',
    'chalk',
    'node-fetch'
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
    file: pkg.main,
    format: 'cjs',
  }, {
    file: pkg.module,
    format: 'es',
  },{
    file: pkg.browser,
    format: 'umd',
    name: name,
    // https://rollupjs.org/guide/en/#outputglobals
    globals: globals,
  }],
};