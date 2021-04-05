const path = require('path');

module.exports = {
    // entry: './src/index.ts',
    entry: {
        main: {
            import: './src/index.ts',
            filename: 'index.js'
        },
        async: {
            import: './src/lib/async/index.ts',
            filename: 'async/index.js',
            dependOn: 'main'
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
        library: 'inversify-react',
        libraryTarget: 'umd',
    },
    externals: {
        react: {
            commonjs: 'react',
            commonjs2: 'react',
            amd: 'react',
        },
        inversify: {
            commonjs: 'inversify',
            commonjs2: 'inversify',
            amd: 'inversify'
        },
        rxjs: {
            commonjs: 'rxjs',
            commonjs2: 'rxjs',
            amd: 'rxjs',
        },
    }
};