// InstructorRouter.js
import express from 'express';
import passport from 'passport';
import InstructorController from '../Controller/UnstructorController.js'
import upload from '../Middleware/MulterMiddleware.js';

const instructorRouter = express.Router();

instructorRouter.route('/apply')
  .post(passport.authenticate('jwt', { session: false }), upload.single('document'), InstructorController.BecomeInsrtuctor);

instructorRouter.route('/getApplies')
  .get(passport.authenticate('jwt', { session: false }), InstructorController.getAppliedInstructors);

export default instructorRouter;
