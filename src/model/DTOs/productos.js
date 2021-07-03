function productoDTO(producto,_id,timestamp) {
    return {
        ...producto,
        _id,
        timestamp
    }
}

module.exports = productoDTO