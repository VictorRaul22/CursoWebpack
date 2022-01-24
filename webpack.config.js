const path = require("path"); // Para trabajar con archivos y rutas de directorios
const HTMLWebpackPlugin=require("html-webpack-plugin");//incluye el pluyin para cargar html
const MiniCssExtractPlugin=require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const CssMinimizerPugin=require("css-minimizer-webpack-plugin");
const TerserPlugin=require("terser-webpack-plugin");
const Dotenv=require('dotenv-webpack');
const {CleanWebpackPlugin}=require("clean-webpack-plugin")
module.exports ={
    // mode: "production", // LE INDICO EL MODO EXPLICITAMENTE
    entry: "./src/index.js", // el punto de entrada de mi aplicación
    output: { // Esta es la salida de mi bundle
        path: path.resolve(__dirname, "dist"),
        // resolve lo que hace es darnos la ruta absoluta de el S.O hasta nuestro archivo
        // para no tener conflictos entre Linux, Windows, etc
        filename: "[name].[contenthash].js", 
        // EL NOMBRE DEL ARCHIVO FINAL,
        assetModuleFilename: "assets/images/[hash][ext][query]"
        
    },
    resolve: {
        extensions: [".js"], // LOS ARCHIVOS QUE WEBPACK VA A LEER
        alias:{//Alias de los path para no hacer ../
            "@utils":path.resolve(__dirname,'src/utils/'),
            "@templates":path.resolve(__dirname,'src/templates/'),
            "@styles":path.resolve(__dirname,'src/styles/'),
            "@images":path.resolve(__dirname,'src/assets/images/')
        }
    },
    module:{
        rules:[
            {//user babel-loader
                test:/\.m?js$/,
                exclude:/node_modules/,
                use:{
                    loader:"babel-loader"
                },
            },
            {//reglas para el plugin de css
                test: /\.css|.styl$/i,
                use:[MiniCssExtractPlugin.loader,
                "css-loader",
                "stylus-loader"
                ]
            },
            {//otra forma de trabajar con img
                test: /\.png/,
                type: "asset/resource",
            },
            {//trabajar con fonts
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: "asset/resource",
                generator: {
                  filename: "assets/fonts/[hash][ext]",
                },
            }
        ],
    },
    plugins:[//plugins
        new HTMLWebpackPlugin({
            inject:true,// INYECTA EL BUNDLE AL TEMPLATE HTML
            template:"./public/index.html",// LA RUTA AL TEMPLATE HTML
            filename:"./index.html" // NOMBRE FINAL DEL ARCHIVO
        }),
        new MiniCssExtractPlugin({
            filename:"assets/[name].[contenthash].css"
        }),// INSTANCIAMOS EL PLUGIN
        new CopyPlugin({ // CONFIGURACIÓN DEL COPY PLUGIN
            patterns:[
                {
                    from:path.resolve(__dirname,"src","assets/images"),
                    to:"assets/images"
                }
            ]
        }),//varibales de entorno como url fetch
        new Dotenv(),
        //limpiar los archivos 
        new CleanWebpackPlugin()
    ],
    optimization:{
        minimize:true,
        minimizer:[
            new CssMinimizerPugin(),
            new TerserPlugin()
        ]
    }
}
