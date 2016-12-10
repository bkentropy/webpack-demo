const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const validate = require('webpack-validator');
const parts = require('./libs/parts');
const pkg = require('./package.json');

const PATHS = {
    app: path.join(__dirname, 'app'),
    build: path.join(__dirname, 'build')
};


const common = {
    entry: {
        app: PATHS.app,
        vendor: Object.keys(pkg.dependencies)
    },
    output: {
        path: PATHS.build
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Webpack demo'
        })
    ]
};

var config;
switch (process.env.npm_lifecycle_event) {
case 'build':
    config = merge(
        common,
        {
            devtool: 'source-map',
            output: {
                path: PATHS.build,
                filename: '[name].[chunkhash].js',
                // This is used for require.ensure. The setup
                // will work without but this is useful to set.
                chunkFilename: '[chunkhash].js'
            }
        },
        parts.setFreeVariable(
            'process.env.NODE_ENV',
            'production'
        ),
        parts.extractBundle({
            name: 'vendor',
            entries: ['react']
        }),
        parts.minify(),
        parts.setupCSS(PATHS.app)
    );
    break;
default:
    config = merge(
        common,
        {
            devtool: 'source-map'
        },
        parts.setupCSS(PATHS.app),
        parts.devServer({
            host: process.env.HOST,
            port: process.env.PORT
        })
    );
}

module.exports = validate(config);
