const DBProducto = require('../model/models/ProductoMongo');
const { buildSchema } = require('graphql');

// GraphQL schema
//https://graphql.org/graphql-js/basic-types/
const schema = buildSchema(`
    type Query {
        message: String,
        messages: [String],
        numero: Int,
        numeros: [Int],
        producto(_id: String!): Producto
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

const getProducto = async function(args) { 
    let productos = await DBProducto.find()
    var id = args.id;
    return productos.filter(producto => {
        return producto.id == id;
    })[0];
}
const getProductos = async function(args) {
    let productos = await DBProducto.find()
    console.log(productos)
    if (args.nombre) {
        var nombre = args.nombre;
        return productos.filter(producto => producto.nombre === nombre);
    } else {
        return productos;
    }
}

const getAllProductos = async function() {
    let productos = await DBProducto.find()
    return productos
}

const updateProductoStock = async function({id, cant}) {
    let productos = await DBProducto.find()
    productos.map(producto => {
        if (producto._id === id) {
            producto.stock = (producto.stock - cant);
            return producto;
        }
    });
    return productos.filter(producto => producto._id === id) [0];
}

// Root resolver
const root = {
    message: () => 'Hola Mundo!',
    messages: () => 'Hola Mundo!'.split(' '),
    numero: () => 123,
    numeros: () => [1,2,3],
    producto: getProducto,
    productos: getProductos,
    productosAll: getAllProductos,
    updateProductoStock: updateProductoStock
};

module.exports = {schema, root};