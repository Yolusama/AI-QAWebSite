const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer:{
    port:5245
  },
  configureWebpack:{
    resolve:{
      extensions:['.ts', '.tsx', '.js', '.vue', '.json']
    }
  }
});
