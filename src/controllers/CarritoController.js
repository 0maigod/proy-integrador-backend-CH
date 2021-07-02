const DBProducto = require('../model/models/Producto');

const loggerInfo = require('pino')();
const loggerWarn = require('pino')('warn.log');
const loggerError = require('pino')('error.log');

const controller = {};
const isAdmin = true;

const titulo = process.env.TITULO || 'Coderhouse desafio Final';

controller.get = async (req, res) => {
    req.session.touch();
    req.session.save((err) => {
        if (err) {
            loggerError.error('Error al ingresar: ' + err);
        }
    });
        res.status(200).render('tienda', { listExists: true, user: username, titulo: titulo });
}

controller.lista = async (req, res) => {
    let reqProds = await DBProducto.find();
    let productos = JSON.stringify(reqProds);
        res.status(200).json(productos);
}

controller.patch = async (req, res) => {
    let compra = req.body.cierreCompra
    for (let clave in compra){
        let prod = await DBProducto.find({ _id: clave });
        if (prod[0].stock == 0) {
            res.send(`{error: 'producto id: ${clave}. sin stock'}`);
            return;
        }
        
        const filter = { _id: clave }
        const update = {
            stock: (prod[0].stock - parseInt(compra[clave])),
            timestamp: (prod[0].timestamp = Date.now())
        }

        await DBProducto.findOneAndUpdate(filter, update,
            {
                useFindAndModify: false,
                returnOriginal: false
            }) ;
  
        console.log('Producto modificado en DB');
      }

        res.status(200).json(`{success: 'compra realizada'}`);

        return;
}


module.exports = controller;
