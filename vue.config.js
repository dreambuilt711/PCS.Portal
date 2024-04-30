module.exports = {
  configureWebpack: { devtool: 'source-map' },
  chainWebpack: (config) => {
    // Remove hot module reloading
    // webpackDevMiddleware is already doing this
    config.mode('development').plugins.delete('hmr')

    // Remove production prefetching (any async chunks are included otherwise)
    if (process.env.npm_lifecycle_event === 'build') {
      config.plugins.delete('prefetch')
    }
  },
  pluginOptions: {
    i18n: {
      locale: 'en-US',
      fallbackLocale: 'en-US',
      localeDir: 'locales',
      enableInSFC: false
    }
  }
}
