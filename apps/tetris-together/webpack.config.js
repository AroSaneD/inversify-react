const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ReactRefreshTypeScript = require('react-refresh-typescript');

// const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
// const smp = new SpeedMeasurePlugin();

// module.exports = smp.wrap({

// https://github.com/pmmmwh/react-refresh-webpack-plugin
// https://reactnative.dev/docs/fast-refresh

// https://docs.github.com/en/packages

const isDevelopment = true; // process.env.NODE_ENV !== 'production';

module.exports = {
    entry: './src/main.tsx',
    mode: isDevelopment ? 'development' : 'production',
    devtool: 'source-map',
    devServer: {
        liveReload: true,
        host: 'localhost',
        hot: true,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true,
                        experimentalWatchApi: true,
                        getCustomTransformers: () => ({
                            before: isDevelopment ? [ReactRefreshTypeScript()] : [],
                        }),
                    },
                },
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'Development',
            template: 'src/index.html',
        }),
        new ForkTsCheckerWebpackPlugin({
            async: true,
        }),
        isDevelopment && new webpack.HotModuleReplacementPlugin(),
        isDevelopment && new ReactRefreshWebpackPlugin(),
    ].filter(Boolean),
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        path: path.resolve(__dirname, 'dist/'),
        filename: 'index.js',
    },
};
