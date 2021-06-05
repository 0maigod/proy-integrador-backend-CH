const passport = require('passport');
const jwt = require('jsonwebtoken');

const login = async (req, res, next) => {
  console.log(req.body)
  res.json({
    message: 'Signup successful',
    user: req.user
  });
}

const autorizar = async (req, res, next) => {
  // console.log(req)
  passport.authenticate('login', async (err, user, info) => {
      try {
        if (err) {
          const error = new Error('An error occurred.');
          return next(error);
        }

        if (!user && info) {
          return res.status(401).json({ message: info.message });
        }

        req.login(
          user,
          { session: false },
          async (error) => {
            if (error) return next(error);

            const body = { _id: user._id, email: user.email };
            const token = jwt.sign({ user: body }, 'TOP_SECRET');
            body.token = token
            return res.redirect('/api/tienda')
            // return res.json({token});
          }
        );
      } catch (error) {
        return next(error);
      }
    }
  )(req, res, next);
};

module.exports = { login, autorizar };