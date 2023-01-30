import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';

module.exports = {
  input: 'src/index.ts',
  external: ['@execution-machine/sdk', 'arweave', 'arweave-mnemonic-keys', 'warp-contracts', 'dotenv', '@bundlr-network/client'],
  output: [
    {
      file: './dist/index.js',
      format: 'es',
      exports: 'named',
      sourcemap: true,
    }
  ],
  plugins: [
    typescript({
      clean: true,
      typescript: require('typescript')
    }),
    commonjs(),
  ]
};
