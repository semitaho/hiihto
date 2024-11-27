const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { type } = require("os");
const CopyPlugin = require("copy-webpack-plugin");

const appDirectory = fs.realpathSync(process.cwd());

module.exports = {
    entry: path.resolve(appDirectory, "src/core/app.ts"), //path to the main .ts file
    output: {
        filename: "js/hiihtoBundle.js", //name for the javascript file that is created/compiled in memory
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    devServer: {
        host: "0.0.0.0",
        open: true,
        port: 8080, //port that we're using for local host (localhost:8080)
        static: path.resolve(appDirectory, "public"), //tells webpack to serve from the public folder
        hot: true,
        devMiddleware: {
            publicPath: "/",
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },

            {
                test: /\.(png|svg|jpg|tga|babylon|jpeg|gif)$/i,
                type: 'asset/resource'
             }
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "src/assets/environment", to: "assets/environment",  },
                { from: "src/assets/skybox", to: "assets/skybox",  },
                { from: "src/assets/player", to: "assets/player",  },


            ],
        }),
        new HtmlWebpackPlugin({
            inject: true,
            template: path.resolve(appDirectory, "public/index.html"),
        })
    ],
    mode: "development",
};