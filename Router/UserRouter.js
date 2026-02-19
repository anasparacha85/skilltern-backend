// UserRouter.js
import express from 'express';
import passport from 'passport';
import userController from '../Controller/UserController.js';
import upload from '../Middleware/MulterMiddleware.js';

const userRouter = express.Router();

userRouter.route('/userprofile')
  .get(passport.authenticate('jwt', { session: false }), userController.getUserProfile);

userRouter.route('/UpdateUserProfile')
  .post(passport.authenticate('jwt', { session: false }), userController.updateUserProfile);

userRouter.route('/UpdateUserPassword')
  .post(passport.authenticate('jwt', { session: false }), userController.UpdateUserpassword);

userRouter.route('/UploadProfilePicture')
  .post(passport.authenticate('jwt', { session: false }), upload.single('image'), userController.UpdateProfilePicture);

export default userRouter;
