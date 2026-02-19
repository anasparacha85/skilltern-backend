import express from 'express';
import AuthController from '../Controller/AuthController.js';
import validate from '../Middleware/ValidatorMiddleware.js';
import { Adminsignupvalidate, loginvalidate, signupvalidate } from '../Validation/Validator.js';
import passport from 'passport';
import OTPMiddleware from '../Middleware/OTPMiddleware.js';

const authRouter = express.Router();

authRouter.route('/register').post(validate(signupvalidate), AuthController.UserRegister);
authRouter.route('/Admin/Register').post(validate(Adminsignupvalidate), AuthController.AdminRegister);
authRouter.route('/Login').post(validate(loginvalidate), AuthController.Login);
authRouter.route('/ForgetPassword').post(AuthController.ForgetPassword);
authRouter.route('/VerifyOtp').post(OTPMiddleware, AuthController.VerifyOtp);
authRouter.route('/UpdatePassword').patch(OTPMiddleware, AuthController.UpdatePassword);
authRouter.route('/google').get(passport.authenticate("google", { scope: ["profile", "email"] }));
authRouter.route('/google/callback').get(passport.authenticate("google", { session: false }), AuthController.GoogleLogin);



export default authRouter;
