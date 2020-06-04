const path = require("path")

module.exports = {
    mode: "production",
    entry: {
        main: "./src/index.ts"
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "bundle"),
        libraryTarget: "umd",
        library: "Jhaystack",
        globalObject: `(() => {
          if(typeof self !== "undefined") {
              return self
          }
          else if(typeof window !== "undefined") {
              return window
          }
          else if(typeof global !== "undefined") {
              return global
          }
          else {
              return Function('return this')()
          }
        })`
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    },
    resolve: {
        extensions: [".js", ".ts"],
    }
}
