// StripeRouter.js
import express from 'express';
import passport from 'passport';
import createCheckoutSession from '../Controller/Stripecontroller.js'
import RoleAccess from '../Middleware/RoleMiddleware.js';

const stripeRouter = express.Router();

stripeRouter.route('/create-checkout-session')
  .post(passport.authenticate('jwt', { session: false }), createCheckoutSession);

export default stripeRouter;
