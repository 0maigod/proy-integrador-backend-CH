// const { fake } = require('faker');
// const faker = require('faker');
import faker from 'faker';
import { Producto } from '../producto';
import outils from './Outils';

faker.locale = 'es';

const get: any = () => ({
    _id: 0,
    timestamp: faker.datatype.datetime(),
    nombre: faker.commerce.productName(),
    descripcion: faker.lorem.paragraph(),
    precio: faker.commerce.price(),
    codigo: faker.datatype.uuid(),
    stock: faker.datatype.number(),
    foto: faker.image.food()
});

export default {
    get // get : get
};
