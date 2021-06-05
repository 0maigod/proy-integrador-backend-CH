const express = require('express');
const passport = require('passport');

const router = express.Router();
const routes = require('../routes/routes');
const secureRoute = require('../routes/secure-routes');

router.use('/', routes);

// Plug in the JWT strategy as a middleware so only verified users can access this route.
router.use('/user', passport.authenticate('jwt', { session: false }), secureRoute);
router.use('/tienda', passport.authenticate('jwt', { session: false }), secureRoute);

// Handle errors.
router.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({ error: err });
});

module.exports = router;