import { Producto } from '../producto';

const getIndex = (id: Number, productos: Producto[]) =>
    productos.findIndex((producto: Producto) => {
        //console.log(usuario.id, id)
        return producto._id === id;
    });

const getFecha = () => new Date().toLocaleString();
const getNextId = (productos: Producto[]) => (productos.length ? productos[productos.length - 1]._id + 1 : 1);

export default {
    getIndex,
    getFecha,
    getNextId
};
