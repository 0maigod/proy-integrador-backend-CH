const { Router } = require('express');
const DBProducto = require('../models/Producto');

const router = Router();
const isAdmin = true;

router
    .get('/:id?', async (req, res) => {
        const { id } = req.params;
        let reqProds;
        if (!id) {
            reqProds = await DBProducto.find();
            return res.status(200).json(reqProds);
        }
        try {
            reqProds = await DBProducto.find({ _id: id });
            return res.status(200).json(reqProds);
        } catch (err) {
            err.stack;
            return res.send(`{error: 'producto no encontrado'}`);
        }
    })
    .get('/precio/:min&&:max', async (req, res) => {
        let min = req.params.min;
        let max = req.params.max;
        if (!min || max) {
            console.log('falta un precio');
            return;
        }
        console.log('precio minimo ' + min);
        console.log('precio maximo ' + max);
    })
    .post('/', async (req, res) => {
        if (isAdmin) {
            let timestamp = Date.now();
            const { nombre, precio, foto, descripcion, codigo, stock } = req.body;
            const prod = new DBProducto({
                timestamp,
                nombre,
                precio: parseInt(precio),
                foto,
                descripcion,
                codigo,
                stock: parseInt(stock)
            });
            await prod.save();
            console.log('Producto agregado a DB');
            res.status(200).json(prod);
            return;
        }
        res.send(`{ error : -1, descripcion: ruta '/productos' método 'agregar' no autorizado }`);
    })
    .put('/:id?', async (req, res) => {
        if (isAdmin) {
            const { id } = req.params;
            let prod = await DBProducto.find({ _id: id });
            if (prod.length == 0) {
                res.send(`{error: 'producto no encontrado'}`);
                return;
            }
            let timestamp = Date.now();
            const { nombre, precio, foto, descripcion, codigo, stock } = req.body;
            let prodNuevo = {
                id: id,
                timestamp,
                nombre,
                precio: parseInt(precio),
                foto,
                descripcion,
                codigo,
                stock: parseInt(stock)
            };
            await DBProducto.updateOne({ _id: id }, prodNuevo);
            console.log('Producto modificado en DB');
            res.status(200).json(prod);

            return;
        }
        res.send(`{ error : -1, descripcion: ruta '/productos' método 'modificar' no autorizado }`);
    })
    .delete('/:id?', async (req, res) => {
        if (isAdmin) {
            const { id } = req.params;
            if (!id) {
                res.send(`{ error : -1, descripcion: debe ingresar el ID del producto }`);
                return;
            }
            let prod = await DBProducto.find({ _id: id });
            if (prod.length == 0) {
                res.send(`{error: 'producto no encontrado'}`);
                return;
            }
            await DBProducto.deleteOne({ _id: id });
            res.send(prod);
            return;
        }
        res.send(`{ error : -1, descripcion: ruta '/productos' método 'borrar' no autorizado }`);
    });

module.exports = router;
