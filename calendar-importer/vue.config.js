const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      fallback: {
        stream: require.resolve('stream-browserify'),
        crypto: require.resolve('crypto-browserify'),
        util: require.resolve('util/'),
        assert: require.resolve('assert/'),
        path: require.resolve('path-browserify'),
        url: require.resolve('url/'),
        https: require.resolve('https-browserify'),
        http: require.resolve('stream-http'),
        querystring: require.resolve('querystring-es3'),
        os: require.resolve('os-browserify/browser'),
        fs: false,  // fs wird nicht benötigt in der Browserumgebung
        net: false, // net ebenfalls nicht
        tls: false  // tls ebenfalls nicht
      },
    },
  },
});

module.exports = {
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Dein Express-Server
        changeOrigin: true,
      },
    },
  },
};
