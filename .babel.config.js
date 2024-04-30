module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
    {
      useBuiltIns: 'usage',
      corejs: 3
    },
    '@babel/preset-env'
  ],
  plugins: ['@babel/plugin-proposal-optional-chaining']
}
