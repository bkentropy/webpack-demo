const webpack = require('webpack');

const CleanWebpackPlugin = require('clean-webpack-plugin');
/*
================================================================================
Random Notes:
I think I would rename a file like this. Libs directory makes sense, I thought
I would also like libs/lib.js, but then I realized there could be other
libraries, potentially 3rd party ones. But this file is a collection of plugins
and loaders. These seem like good things to focus on.

================================================================================
*/

exports.devServer = function(options) {
    return {
        devServer: {
            historyApiFallback: true,
            hot: true,
            inline: true,
            stats: 'errors-only',
            host: options.host,
            port: options.port
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin({
                multiStep: true
            })
        ]
    };
};

exports.setupCSS = function(paths) {
    return {
        module: {
            loaders: [
                {
                    test: /\.css$/,
                    loaders: ['style', 'css'],
                    include: paths
                }
            ]
        }
    };
};

exports.minify = function() {
    return {
        plugins: [
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            })
        ]
    };
};

exports.setFreeVariable = function(key, value) {
    const env = {};
    env[key] = JSON.stringify(value);

    return {
        plugins: [
            new webpack.DefinePlugin(env)
        ]
    };
};

exports.extractBundle = function(options) {
    const entry = {};
    entry[options.name] = options.entries;

    return {
        entry: entry,
        plugins: [
            new webpack.optimize.CommonsChunkPlugin({
                names: [options.name, 'manifest']
            })
        ]
    };
};

// Note about this plugin. It IS NOT a webpack plugin but something else. I am
// liking the others better because they are more directly webpack related. I
// think I should write an npm script that will `rm -rf ./build && wepack`
exports.clean = function(path) {
    return {
        plugins: [
            new CleanWebpackPlugin([path], {
                root: process.cwd()
            })
        ]
    };
};
