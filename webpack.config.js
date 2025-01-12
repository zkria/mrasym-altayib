const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ThemeWatcher = require('@salla.sa/twilight/watcher.js');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

// دالة لتحديد مسار الأصول
const asset = file => path.resolve('src/assets', file || '');
// دالة لتحديد مسار الملفات العامة
const public = file => path.resolve("public", file || '');

module.exports = {
    entry: './src/assets/js/core/app.js', // نقطة الدخول للتطبيق
    output: {
        filename: 'bundle.js', // اسم ملف الخرج
        path: path.resolve(__dirname, 'public/js'), // مسار الخرج
        clean: true, // تنظيف المجلد قبل البناء
        chunkFilename: "[name].[contenthash].js" // اسم ملفات الشظايا
    },
    stats: {
        modules: false,
        assetsSort: "size",
        assetsSpace: 50
    },
    module: {
        rules: [
            {
                test: /\.js$/, // معالجة ملفات JavaScript
                exclude: /node_modules/, // استبعاد مجلد node_modules
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'] // إعدادات Babel
                    }
                }
            },
            {
                test: /\.scss$/, // معالجة ملفات SCSS
                use: [
                    MiniCssExtractPlugin.loader, // استخراج CSS إلى ملفات منفصلة
                    'css-loader', // تحميل ملفات CSS
                    'postcss-loader', // معالجة CSS باستخدام PostCSS
                    'sass-loader' // تحويل SCSS إلى CSS
                ]
            }
        ]
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src/assets/js'), // إعدادات الاختصار
        },
    },
    devtool: 'source-map', // إنشاء خريطة المصدر
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css', // اسم ملف CSS الناتج
            chunkFilename: '[id].css' // اسم ملفات الشظايا لـ CSS
        }),
        new CopyPlugin({
            patterns: [
                { from: asset('images'), to: public('images') } // نسخ الصور إلى المجلد العام
            ]
        }),
        new ThemeWatcher() // مراقب الثيمات
    ]
};
