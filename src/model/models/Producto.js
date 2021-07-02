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

    static validar(producto) {
        //console.log(producto,requerido)
        const ProductoSchema = Joi.object({
            nombre: Joi.string().required(),
            descripcion: Joi.string().required(),
            precio: Joi.number().required(),
            codigo: Joi.string().required(),
            stock: Joi.number().required(),
            foto: Joi.boolean().required()
        })

        const { error } = ProductoSchema.validate(producto)
        if (error) {
            throw error
        }
    }
}

module.exports = Productos