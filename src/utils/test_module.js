const axios = require('axios')

let url = `http://localhost:${process.env.PORT}/axios`

const nuevoProd = () => {
    let {nombre, descripcion, precio, stock, foto } = json
    console.log(nombre)
    axios.post(url, {numero: Math.random()})
        .then(response => {
            // Obtenemos los datos
            console.log(response.data);
        })
        .catch(error => {
            console.log(error)
        })
}

const listaProd = () => {
    axios(`${url}/get`)
        .then( function(response) {
            console.log(response.data)
            return response.data
        })
        .catch(error => {
        console.log(error)
        })
}

module.exports = {listaProd, nuevoProd}