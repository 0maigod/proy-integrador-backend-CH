const express = require('express');
const router = express.Router();
const { ingresar } = require('../controllers/tienda');

router.get( '/profile', (req, res, next) => {
    res.json({
      message: 'You made it to the secure route',
      user: req.user,
      token: req.query.secret_token
    })
  }
);

router
  .get( '/ingresar', (req, res, next) => {
    res.json({
      message: 'Estas en la ruta de ingresar productos',
      user: req.user,
      token: req.query.secret_token
    })
  }
  )
  .post('/ingresar', ingresar)

module.exports = router;