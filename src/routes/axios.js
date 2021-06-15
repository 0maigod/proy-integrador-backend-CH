const router = require('express').Router();


const axiosController = require('../controllers/AxiosController')
const {listaProd, nuevoProd} = require('../utils/test_module')



router.get('/', listaProd)
    .get('/get', axiosController.get)
    .post('/post', axiosController.post)
    .patch('/patch', axiosController.patch)
    .delete('/delete', axiosController.delete)
    



module.exports = router;