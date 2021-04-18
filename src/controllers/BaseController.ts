import { Router } from 'express';
import DBProducto from '../models/Producto';
import querystring from 'querystring';

const router = Router();
let isAdmin = false;
let username: string = '';
let sess: any;

const auth = function (req: any, res: any, next: any) {
    if (req.session && sess.username) {
        return next();
    } else {
        return res.sendStatus(401).send('No esta logueado!!!');
    }
};

router
    .get('/login', (req, res) => {
        if (req.session) {
            sess = req.session;
            if (sess.username) {
                return res.redirect('/ingresar');
            }
        }

        res.status(200).render('login');
    })
    .post('/login', (req, res) => {
        sess.username = req.body.username;

        if (!req.body.username) {
            res.send('login failed');
        } else if (req.body.username === 'omar') {
            isAdmin = true;
            username = sess.username;
            res.redirect('../ingresar');
        } else if (req.body.username) {
            isAdmin = false;
            res.redirect('../ingresar');
        }
    })
    .get('/logout', (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
            }
        });
        res.send('Se ha deslogueado');
    })
    .get('/ingresar', auth, async (req, res) => {
        let reqProds = await DBProducto.find();
        let productos = JSON.stringify(reqProds);
        if (reqProds.length == 0) {
            res.status(200).render('ingresar', { productos: reqProds, listExists: false });
        } else {
            res.status(200).render('ingresar', { productos: JSON.parse(productos), listExists: true, userExists: isAdmin, user: username });
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
