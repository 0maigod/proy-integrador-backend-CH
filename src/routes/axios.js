const router = require('express').Router();

const axiosController = require('../controllers/AxiosController')



router.get('/', axiosController.get)
    .post('/', axiosController.post)
    .patch('/', axiosController.patch)
    .delete('/', axiosController.delete)
    .get('/by_id', axiosController.by_id)
    



module.exports = router;