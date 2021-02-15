let path = require("path");

module.exports = {
    entry: "./src/main.ts",
    output: {
        path: path.resolve(__dirname, "dist/"),
        filename:"bundle.js",
        publicPath:"/dist"
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|tsx|ts)$/,
                exclude: /node_modules/,
                use:
                [
                    {
                        loader:"babel-loader",
                        options: {
                            presets: [
                                '@babel/preset-env', '@babel/preset-typescript'
                            ],
                            plugins: ['@babel/plugin-proposal-class-properties', '@babel/plugin-proposal-object-rest-spread']
                        }
                    }
                ]
            },
            {
                test: /\.(frag|vert|txt)/,
                use:["raw-loader"]
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx', '.tsx', '.ts'],
    },
    devServer:
    {
        contentBase: path.join(__dirname, '/'),
        compress: true,
        port: 9000
    }
}