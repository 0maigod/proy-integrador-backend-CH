const config = require('../config')
// const express = require('express')
// const router = express.Router();

const { graphqlHTTP }  = require('express-graphql');
const { buildSchema }  = require('graphql');
// const passport = require('passport');

const ControladorProductosTienda = require('../controllers/ProductsTiendaController')


// const auth = function (req, res, next) {
    
//     if (!req.session.user) {
//         res.status(200).render('login');
//         return;
//     }

//         username = req.session.user;
//         return next();
// };
class RouterProductosTienda {

    constructor() {
        this.productController = new ControladorProductosTienda()
    }

    start() {

        // 
        const schema = buildSchema(`
            type Query {
                productoId(_id: String!): [Producto]
                productos(nombre: String): [Producto]
                productosAll: [Producto]
            },
            type Mutation {
                updateProductoStock(_id: String!, stock: Int!): Producto
            },
            type Producto {
                _id: String
                nombre: String
                descripcion: String
                precio: Int
                stock: Int
                foto: String
            }    
        `);

        // Root resolver
        const root = {
            productosAll: () => this.productController.obtenerProductos(),
            productoId: _id => this.productController.obtenerProductosById(_id),
            updateProductoStock: (req,cant) => {
                console.log(cant)
                return this.productController.actualizarProducto(_id,cant)},
        };

        return graphqlHTTP({
            schema: schema,
            rootValue: root,
            graphiql: false  //No funciona con el config...
        })

    }
}

module.exports = RouterProductosTienda
