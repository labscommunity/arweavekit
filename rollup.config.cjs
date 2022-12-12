const typescript = require('rollup-plugin-typescript2');

module.exports = {
  input: './src/index.ts',
  output: [
    {
      file: './dist/index.js',
      format: 'cjs',
      exports: 'named',
      sourcemap: true
    }
  ],
  plugins: [
    typescript({
      typescript: require('typescript')
    })
  ]
};
