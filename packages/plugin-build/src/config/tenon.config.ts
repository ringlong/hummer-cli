import { Configuration } from 'webpack'
import {TenonStylePlugin} from '@hummer/tenon-style-loader'
import {VueLoaderPlugin} from '@hummer/tenon-loader'
import JsccPlugin from 'webpack-plugin-jscc'
import {ProjectConfig} from '@hummer/cli-utils'

import * as path from 'path'

export default function getDefaultTenonConfiguration(isProduction: boolean, hmConfig?:ProjectConfig): Configuration {
  let plugins:any = []
  if(hmConfig){
    // TODO 自定义插件的配置，在这里进行拓展
    // TODO Validate Jscc Config
    if(hmConfig.jscc){
      plugins.push(new JsccPlugin(hmConfig.jscc))
    }
  }

  return {
    mode: isProduction?'production':'development',
    devtool: isProduction ? 'hidden-source-map' : 'cheap-module-source-map',
    output: {
      publicPath: './'
    },
    resolve: {
      alias: {
      },
      extensions: [".js",'.json',".jsx",".vue", ".css" ]
    },
    externals: {
      '@hummer/hummer-front': '__GLOBAL__',
      '@didi/hummer-front': '__GLOBAL__' // 兼容老版 CLI
    },
    module: {
      rules: [{
        test: /\.vue$/,
        use: {
          loader: require.resolve('@hummer/tenon-loader')
        }
      }, {
        test: /\.less$/,
        use: [require.resolve('less-loader')]
      },{
        test: /\.(png|jpg|jpeg|gif)$/i,
        use: [
          {
            loader: require.resolve('file-loader'),
            options: {
              name: '[name].[ext]',
              outputPath: 'images'
            }
          }
        ],
      }, {
        test: /\.js$/,
        use: {
          loader: require.resolve('babel-loader'),
          options: {
            presets: [
              [
                require.resolve('@babel/preset-env'), 
                {
                  targets: {
                    "ios": "9"
                  }
                }
              ]
            ],
            plugins: [
              [require.resolve('@babel/plugin-transform-runtime'), {
                useESModules: true,
                absoluteRuntime: require.resolve('@babel/runtime/package.json'),
                // Undocumented option that lets us encapsulate our runtime, ensuring
                // the correct version is used
                // https://github.com/babel/babel/blob/090c364a90fe73d36a30707fc612ce037bdbbb24/packages/babel-plugin-transform-runtime/src/index.js#L35-L42
                version: require('@babel/runtime/package.json').version,
              }]
            ]
          }
        }
      }, {
        test: /\.css$/,
        use: {
          loader: path.join(require.resolve('@hummer/tenon-style-loader'))
        }
      },]
    },
    plugins: [new TenonStylePlugin(),new VueLoaderPlugin(), ...plugins]
  }
}
