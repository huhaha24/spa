var path = require('path');
var node_modules = path.resolve(__dirname, 'node_modules');
 
//  Base配置 打包文件配置
var entry = {
    'header': path.resolve('./src/header.tsx'),
    'display': path.resolve('./src/display.tsx'),
    'screen': path.resolve('./src/screen.tsx'),
};
 
 
module.exports = {
    mode:'development',
    //页面入口文件配置
    entry: entry,
    //入口文件输出配置
    output: {
        path: path.resolve(__dirname, './js'),
        filename: '[name].js'
    },
    module: {
        //加载器配置
        rules: [{
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/
        }, {
            test: /\.html$/,
            loader: 'html-loader',
        },
          {
            test: /\.(css|less)$/,
            loaders: ["style-loader", "css-loader", "less-loader"],
         },
    ]
    },
 
    externals: {
        "react": "React",
        "react-dom": "ReactDOM",
        "redux": "Redux",
        "react-redux": "ReactRedux",
        "nprogress":"NProgress",
        "d3": "d3",
        "lodash": "_",
        "three": "THREE",
        "jquery": "$",
        "moment": "moment",
        "echarts": "echarts",
        "antd":"antd"
    },
    resolve: {
        modules: ['./src', './node_modules', './scss'],
        extensions: ['scss', 'css', '.tsx', '.ts', '.js', '.jsx', '.css', '.less','html'],
    }
 
};