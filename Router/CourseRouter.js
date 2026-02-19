import express from 'express';
import passport from 'passport';
import CourseController from '../Controller/CourseController.js';
import InstructorMiddleware from '../Middleware/InstructorMiddleware.js';

const courseRouter = express.Router();

courseRouter.route('/uploadCourses')
  .post(passport.authenticate('jwt', { session: false }), InstructorMiddleware, CourseController.uploadCourses);

courseRouter.route('/getAllCourses')
  .get(CourseController.getAllCourses);

courseRouter.route('/course/:id')
  .get(CourseController.getcoursebyid);

courseRouter.route('/addlesson/:id')
  .post(passport.authenticate('jwt', { session: false }), InstructorMiddleware, CourseController.addlessonsbycourseid);

courseRouter.route('/course/enroll/:id')
  .post(passport.authenticate('jwt', { session: false }), CourseController.enrolledStudent);

courseRouter.route('/course/student/getCourses')
  .get(passport.authenticate('jwt', { session: false }), CourseController.getEnrolledCourses);

courseRouter.route('/CourseContent')
  .get(CourseController.CoursesCount);

courseRouter.route('/CourseNameCount')
  .get(CourseController.CourseCountbbyName);

courseRouter.route('/CourseCategoryCount')
  .get(CourseController.CourseCountbbyCategory);

courseRouter.route('/DeleteCourse/:id')
  .delete(passport.authenticate('jwt', { session: false }), InstructorMiddleware, CourseController.DeleteCourses);

courseRouter.route('/addFavorites/:id')
  .post(passport.authenticate('jwt', { session: false }), CourseController.AddFavourites);

courseRouter.route('/removeFavorites/:id')
  .delete(passport.authenticate('jwt', { session: false }), CourseController.RemoveFavourites);

courseRouter.route('/getFavorites')
  .get(passport.authenticate('jwt', { session: false }), CourseController.getAllFavourites);

export default courseRouter;
