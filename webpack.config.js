const path                          = require('path'),
  HTMLWebpackPlugin                 = require('html-webpack-plugin'),
  { CleanWebpackPlugin }            = require('clean-webpack-plugin'),
  CopyWebpackPlugin                 = require('copy-webpack-plugin'),
  MiniCssExtractPlugin              = require('mini-css-extract-plugin'),
  ImageminPlugin                    = require('imagemin-webpack-plugin').default,
  imageminWebp                      = require('imagemin-webp'),
  SpriteLoaderPlugin                = require('svg-sprite-loader/plugin'),
  BundleAnalyzerPlugin              = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const isDev = process.env.NODE_ENV === 'development';

const PATHS = {
  src: path.resolve(__dirname, 'src'),
  dist: path.resolve(__dirname, 'dist')
};

const postcssLoader = function() {
  const config = {
    loader: 'postcss-loader',
    options: {
      sourceMap: true,
      config: {
        path: './postcss.config.js'
      }
    }
  }
  return config;
};

const optimization = function () {
  let config;

  if (isDev) {
    return config = {
      minimize: false
    }
  }

  if (!isDev) {
    return config = {
      splitChunks: {
        chunks: 'all'
      }
    }
  }

}

module.exports = {
  mode: isDev === true ? 'development' : 'production',
  //context: PATHS.src, // Папка разработки
  entry: {
    index: `${PATHS.src}/js/pages/index.js`,
    404: `${PATHS.src}/js/pages/404.js`
  },
  output: {
    filename: './js/[name].js',
    path: PATHS.dist, // - по умолчанию dist
  },
  resolve: {
    extensions: ['.js', '.json', '.css'], // Разрешения по умолчанию
    alias: {
      '@': `${PATHS.src}`,
      '@myput': `${PATHS.src}/myput`,
      '@img': `${PATHS.src}/img`,
    }
  },
  optimization: optimization(),
  devServer: {
    contentBase: PATHS.dist,
    port: 8081,
    overlay: true,
    index: 'index.html',
    open: 'firefox',
    liveReload: true,
  },
  devtool: isDev === true ? 'source-map' : 'none',
  plugins: [
    new HTMLWebpackPlugin({
      inject: false,
      minify: false,
      filename: 'index.html',
      template: `${PATHS.src}/index.html`,
    }),
    new HTMLWebpackPlugin({
      inject: false,
      minify: false,
      filename: '404.html',
      template: `${PATHS.src}/404.html`,
    }),
    new CleanWebpackPlugin(), // Удаляет кешированные файлы
    new CopyWebpackPlugin([
      {
        from: `${PATHS.src}/fonts`,
        to: './fonts'
      },
      {
        from: `${PATHS.src}/images`,
        to: './images',
      },
      // {
      //   from: `${PATHS.src}/php`,
      //   to: './php'
      // },
      {
        from: `${PATHS.src}/ht.access`,
        to: './.ht[ext]'
      },
      {
        from: `${PATHS.src}/configfile.xml`,
        to: './configfile.[ext]'
      },
      {
        from: `${PATHS.src}/manifest.json`,
        to: './manifest.[ext]'
      },
      {
        from: `${PATHS.src}/robots.txt`,
        to: './robots.[ext]'
      },
      {
        from: `${PATHS.src}/js`,
        to: './js',
        ignore: [
          'fontfaceobserver.js',
          '**/pages/**',
          '**/_module/**',
        ],
      },
    ]),
    new ImageminPlugin({
      disable: isDev === true ? true : false,
      //destination: path.resolve(__dirname, 'dist/images'),
      test: /\.webp$/i,
      plugins: [
        imageminWebp({
          quality: 75
        }),
      ]
    }),
    new ImageminPlugin({
      disable: isDev === true ? true : false,
      test: /\.(jpe?g|png|gif|svg)$/i,
      pngquant: {
        quality: '75-80'
      }
    }),
    new MiniCssExtractPlugin({
      filename: './css/style.css',
      //chunkFilename: '[id].css',
    }),
    new SpriteLoaderPlugin({
      plainSprite: true
    }),
    //new BundleAnalyzerPlugin(),
  ],
  module: {
    rules: [
      // CSS
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: './',
            }
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          postcssLoader(),
        ]
      },
      // Images
      {
        test: /\.(png|jpe?g|gif|webp)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'images',
              name: '[name].[ext]',
            },
          },

        ]
      },
      // Fonts
      // {
      //   test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
      //   loader: "file-loader",
      //   options: {
      //     name: "[name].[ext]"
      //   }
      // },
      // JS
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', {
              debug: isDev === true ? true : false,
              corejs: 3,
              useBuiltIns: 'usage'
            }]]
          }
        }
      },
      // Sass or SCSS
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              url: false
            }
          },
          postcssLoader(),
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              sassOptions: {
                indentWidth: 2,
              },
            },
          },

        ]

      },
      // HTML
      {
        test: /\.html$/i,
        //include: /(header|footer|_elements|_menu)/,
        include: [
          path.resolve(__dirname, 'src/includes/'),
          //`${PATHS.src}/includes/`
        ],
        use: [
          {
            loader: 'raw-loader',
            options: {
              esModule: false,
            },
          },

        ],
      },
      // SVG Sprite
      {
        //test: /\.\/srс\/images\/SVG\/\.*\.svg$/,
        test: /\.svg/i,
        use: [
          {
            loader: 'svg-sprite-loader',
            options: {
              extract: true,
              spriteFilename: 'svg-sprite.svg',
              outputPath: './images/SVG/',
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              disable: isDev === true ? true : false
            },
          },

        ]
      }

    ]
  }
};



