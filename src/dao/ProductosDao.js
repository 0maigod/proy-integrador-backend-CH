const CustomError = require('../utils/CustomError')

class ProductosDao {
    async getAll () {
        throw new CustomError(500, 'Falta implementar getAll!!!!')
    }
    async getById () {
        throw new CustomError(500, 'Falta implementar getById!!!!')
    }
    async add () {
        throw new CustomError(500, 'Falta implementar add!!!!')
    }
    async deleteById () {
        throw new CustomError(500, 'Falta implementar deleteById!!!!')
    }
    async deleteAll () {
        throw new CustomError(500, 'Falta implementar deleteAll!!!!')
    }
    async updateById () {
        throw new CustomError(500, 'Falta implementar updateById!!!!')
    }
}

module.exports = ProductosDao