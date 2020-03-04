const path = require('path')
const webpack = require('webpack')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

const relativePath = (dir) => path.resolve(__dirname, dir)

const config = (env) => {
  const ENV = JSON.stringify(env.ENV)
  return {
    entry: "./entry.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: 'bundle.js'
    },
    target: 'web',
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"],
      alias: {
        "App": relativePath("src"),
        "Components": relativePath("src/components"),
        "Screens": relativePath("src/screens"),
        "Remote": relativePath("src/remote"),
        "Proto": relativePath("src/remote/proto"),
        "Reducers": relativePath("src/reducers"),
        "Sagas": relativePath("src/sagas"),
        "Static": relativePath("src/static"),
        "Utils": relativePath("src/utils"),
        "Animated": relativePath("src/components/animated"),
        "Actions": relativePath("src/components/actions"),
      },
    },
    module: {
      rules: [
        {
          test: /\.tsx?/i,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  "@babel/preset-react",
                  [
                    "@emotion/babel-preset-css-prop",
                    {
                      autoLabel: true,
                      labelFormat: "[local]",
                    },
                  ],
                ],
              },
            },
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
              },
            },
          ],
        },
        {
          test: /\.jsx?/i,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  "@babel/preset-react",
                  [
                    "@emotion/babel-preset-css-prop",
                    {
                      autoLabel: true,
                      labelFormat: "[local]",
                    },
                  ],
                ],
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        ENV, // "prod", "dev"
      }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new ForkTsCheckerWebpackPlugin({
        reportFiles: ['src/**/*.{ts,tsx}', '!node_modules/**/*.{ts,tsx}'],
      }),
    ],
    stats: {
      colors: true,
      reasons: true,
      chunks: true,
      warnings: true,
      timings: true,
      builtAt: true,
    },
    devServer: {
      contentBase: path.resolve(__dirname, "dist"),
      historyApiFallback: true,
      disableHostCheck: true,
      hot: true,
      port: 8081,
    }
  }
}

module.exports = config
