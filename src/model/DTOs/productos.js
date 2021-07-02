function productoDTO(producto,_id,fyh) {
    return {
        ...producto,
        _id,
        fyh
    }
}

module.exports = productoDTO