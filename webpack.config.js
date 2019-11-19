const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const path = require("path")

module.exports = {
    entry: {
        main: "./src/index.js"
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "bundle"),
        libraryTarget: "umd",
        library: "Jhaystack",
        umdNamedDefine: true,
        libraryExport: "default"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    }
}
