// JobRouter.js
import express from 'express';
import multer from 'multer';
import JobController from '../Controller/JobController.js';
import passport from 'passport';
import RoleAccess from '../Middleware/RoleMiddleware.js';
import ApplyEmployee from '../Controller/EmployeeController.js';
import upload from '../Middleware/MulterMiddleware.js';

const jobRouter = express.Router();

jobRouter.route('/post-a-job')
  .post(passport.authenticate('jwt', { session: false }), RoleAccess('Admin'), upload.fields([{ name: "CategoryImage" }, { name: "JobImage" }]), JobController.PostJob);

jobRouter.route('/Internships')
  .get(JobController.getJobsCategories);

jobRouter.route('/jobsbycategories/:Category')
  .get(JobController.getjobsbycategories);

jobRouter.route('/jobsbyid/:id')
  .get(passport.authenticate('jwt', { session: false }), JobController.getjobsbyid);

jobRouter.route('/Apply')
  .post(passport.authenticate('jwt', { session: false }), upload.single('cv'), ApplyEmployee);

jobRouter.route('/findjobs')
  .get(JobController.findjobs);

export default jobRouter;
