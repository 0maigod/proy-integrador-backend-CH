const Joi = require('joi')

class Productos {

    constructor(nombre, descripcion, precio, codigo, stock, foto) {
        this.nombre = nombre
        this.descripcion = descripcion
        this.precio = precio
        this.codigo = codigo
        this.stock = stock
        this.foto = foto
    }

    static validar(producto, requerido) {
        const ProductoSchema = Joi.object({
            nombre: requerido ? Joi.string().required() : Joi.string(),
            descripcion: requerido ? Joi.string().required() : Joi.string(),
            precio: requerido ? Joi.number().required() : Joi.number(),
            codigo: requerido ? Joi.string().required() : Joi.string(),
            stock: requerido ? Joi.number().required() : Joi.number(),
            foto: requerido ? Joi.string().required() : Joi.string(),
        })

        const { error } = ProductoSchema.validate(producto)
        if (error) {
            throw error
        }
    }
}

module.exports = Productos