import { Router } from 'express';
import DBProducto from '../models/Producto';
import querystring from 'querystring';
import { Producto } from '../producto';

const router = Router();
const isAdmin = true;

router
    .get('/login', async (req, res) => {
        res.status(200).render('login', {});
    })
    .get('/ingresar', async (req, res) => {
        let reqProds = await DBProducto.find();
        let productos = JSON.stringify(reqProds);
        if (reqProds.length == 0) {
            res.status(200).render('ingresar', { productos: reqProds, listExists: false });
        } else {
            res.status(200).render('ingresar', { productos: JSON.parse(productos), listExists: true, userExists: true });
        }
    })
    .post('/ingresar', (req, res) => {
        let respuesta = '';
        let formulario: any;
        if (isAdmin) {
            req.on('data', function (data) {
                respuesta += data;
            }).on('end', async () => {
                formulario = querystring.parse(respuesta);
                let timestamp = Date.now();
                const { nombre, precio, foto, descripcion, codigo, stock } = formulario;
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
                let reqProds = await DBProducto.find();
                let productos = JSON.stringify(reqProds);
                console.log('Producto agregado a DB');
                return res.status(200).render('ingresar', { productos: JSON.parse(productos), listExists: true, userExists: true });
            });
        } else {
            res.send(`{ error : -1, descripcion: ruta '/productos' método 'agregar' no autorizado }`);
        }
    });

export default router;
