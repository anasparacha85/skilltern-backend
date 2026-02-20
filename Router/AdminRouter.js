import express from 'express';
import AdminController from '../Controller/AdminController.js';
import passport from 'passport';
import RoleAccess from '../Middleware/RoleMiddleware.js';

const adminRouter = express.Router();

adminRouter.route('/ViewJobApplication')
  .get(passport.authenticate('jwt', { session: false }), RoleAccess('Admin'), AdminController.ViewJobApplications);

adminRouter.route('/delete-a-job/:id')
  .delete(passport.authenticate('jwt', { session: false }), RoleAccess('Admin'), AdminController.deletejob);

adminRouter.route('/AppliedInstructors')
  .get(passport.authenticate('jwt', { session: false }), RoleAccess('Admin'), AdminController.AppliedInstructors);

adminRouter.route('/getallJobs')
  .get(passport.authenticate('jwt', { session: false }), RoleAccess('Admin'), AdminController.alljobs);

adminRouter.route('/makeInstructor/:email')
  .patch(passport.authenticate('jwt', { session: false }), RoleAccess('Admin'), AdminController.makeInstructor);

adminRouter.route('/removeInstructor/:email')
  .patch(passport.authenticate('jwt', { session: false }), RoleAccess('Admin'), AdminController.removeinstructor);

adminRouter.route('/getAllUsers')
  .get(passport.authenticate('jwt',{session:false}),RoleAccess('Admin'),AdminController.getAllUsers)

adminRouter.route('/ToggleStatus')
  .patch(passport.authenticate('jwt',{session:false}),RoleAccess('Admin'),AdminController.ToggleActivate)

adminRouter.route('/GetEnrolledStudents')
  .get(passport.authenticate('jwt',{session:false}),RoleAccess('Admin'),AdminController.GetEnrolledStudents)

adminRouter.route('/GetRoles')
.get(passport.authenticate('jwt',{session:false}),RoleAccess('Admin'),AdminController.getRoles)

adminRouter.route('/ChangeRole')
.patch(passport.authenticate('jwt',{session:false}),RoleAccess('Admin'),AdminController.ChangeRole)

export default adminRouter;
