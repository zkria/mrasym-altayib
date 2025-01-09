const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ThemeWatcher = require('@salla.sa/twilight/watcher.js');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

const asset = file => path.resolve('src/assets', file || '');
const public = file => path.resolve("public", file || '');

module.exports = {
    entry  : {
        app     : [asset('styles/app.scss'), asset('js/core/app.js'), asset('js/pages/wishlist.js'), asset('js/pages/blog.js')],
        home    : asset('js/pages/home.js'),
        'product-card' : asset('js/partials/product-card.js'),
        'main-menu' : asset('js/partials/main-menu.js'),
        'wishlist-card': asset('js/partials/wishlist-card.js'),
        checkout: [asset('js/pages/cart.js'), asset('js/pages/thankyou.js')],
        pages   : [asset('js/pages/loyalty.js'), asset('js/pages/brands.js')],
        product : [asset('js/pages/product.js'), asset('js/pages/products.js')],
        order   : asset('js/pages/order.js'),
        testimonials   : asset('js/pages/testimonials.js')
    },
    output : {
        path: public(),
        clean: true,
        chunkFilename: "[name].[contenthash].js"
    },
    stats  : {modules: false, assetsSort: "size", assetsSpace: 50},
    module : {
        rules: [
            {
                test   : /\.js$/,
                exclude: [
                    /(node_modules)/,
                    asset('js/twilight.js')
                ],
                use    : {
                    loader : 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css'
        }),
        new CopyPlugin({
            patterns: [
                { from: asset('images'), to: public('images') }
            ]
        }),
        new ThemeWatcher()
    ]
};
