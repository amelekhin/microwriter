import pkg from './package.json';
import rollupTypescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import dts from 'rollup-plugin-dts';

export default [
  // Browser-friendly UMD build
  {
    input: 'src/index.ts',

    output: {
      name: 'microwriter',
      file: pkg.browser,
      format: 'umd',
      sourcemap: true,
    },

    plugins: [rollupTypescript(), resolve(), commonjs()],
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: 'src/index.ts',

    output: [
      { file: pkg.main, format: 'cjs', sourcemap: true },
      { file: pkg.module, format: 'es', sourcemap: true },
    ],

    plugins: [rollupTypescript()],
  },

  // TypeScript declaration file
  {
    input: 'src/index.ts',

    output: {
      name: 'microwriter',
      file: pkg.types,
    },

    plugins: [dts()],
  },
];
