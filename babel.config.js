module.exports = {
  plugins: ['@babel/plugin-transform-runtime'],
  presets: [
    // '@vue/app',
    ['@babel/preset-env', { targets: { node: true } }]
  ]
};
