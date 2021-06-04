const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const UserModel = require('../models/User');

const strategyOptions = {
  usernameField: 'email',
  passwordField: 'password'
};

const strategyJWT = {
  secretOrKey: 'TOP_SECRET',
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
};

const signup = async (email, password, done) => {
  try {
    const user = await UserModel.create({ email, password });

    return done(null, user);
  } catch (error) {
    done(error);
  }
};

const login = async (email, password, done) => {
  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return done(null, false, { message: 'User not found' });
    }

    const validate = await user.isValidPassword(password);

    if (!validate) {
      return done(null, false, { message: 'Wrong Password' });
    }

    return done(null, user, { message: 'Logged in Successfully' });
  } catch (error) {
    console.log(error);
    return done(error);
  }
};

// Passport middleware to handle user registration

passport.use('signup', new localStrategy(strategyOptions, signup));

// Passport middleware to handle user login

passport.use('login', new localStrategy(strategyOptions, login));


passport.use(
  new JWTstrategy(strategyJWT, async (token, done) => {
    try {
      return done(null, token.user);
    } catch (error) {
      done(error);
    }
  }
  )
);