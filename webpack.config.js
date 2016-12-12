const path = require('path');
// The HtmlWebpackPlugin will pickup the CSS files and inject them into index.html
// In dev mode they will be extracted and loaded dynamically
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const validate = require('webpack-validator');
const parts = require('./libs/parts');
const pkg = require('./package.json');

const PATHS = {
    app: path.join(__dirname, 'app'),
    style: [
        path.join(__dirname, 'node_modules', 'purecss'),
        path.join(__dirname, 'app', 'main.css')
    ],
    build: path.join(__dirname, 'build')
};


const common = {
    entry: {
        style: PATHS.style,
        app: PATHS.app,
        vendor: Object.keys(pkg.dependencies)
    },
    output: {
        path: PATHS.build,
        filename: '[name].js'
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
case 'stats':
    config = merge(
        common,
        {
            devtool: 'source-map',
            output: {
                path: PATHS.build,
                publicPublic: '/webpack-demo/',
                filename: '[name].[chunkhash].js',
                // This is used for require.ensure. The setup
                // will work without but this is useful to set.
                chunkFilename: '[chunkhash].js'
            }
        },
        parts.clean(PATHS.build),
        parts.setFreeVariable( // this let certain variables be referred to as strings or something, was weird didn't quite understand how it could help
            'process.env.NODE_ENV',
            'production'
        ),
        parts.extractBundle({
            name: 'vendor',
            entries: ['react']
        }),
        parts.minify(),
        parts.extractCSS(PATHS.style),
        parts.purifyCSS([PATHS.app])
    );
    break;
default:
    config = merge(
        common,
        {
            devtool: 'source-map'
        },
        parts.setupCSS(PATHS.style), // note that this is different than build
        parts.devServer({
            host: process.env.HOST,
            port: process.env.PORT
        })
    );
}

module.exports = validate(config, {
    quiet: true
});
