import express from 'express';
import { CourseControllers } from './course.controller';
import validateRequest from '../../middlewares/validateRequest';
import { CourseValidations } from './course.validation';

const router = express.Router();

router.post('/create-course', validateRequest(CourseValidations.createCourseValidationSchema), CourseControllers.createCourse);

router.get('/', CourseControllers.getAllCourse);

router.get('/:id', CourseControllers.getSingleCourse);

router.patch('/:id', validateRequest(CourseValidations.updatePreateCourseValidationSchema), CourseControllers.updateCourse);

router.put('/:courseId/assing-faculties', validateRequest(CourseValidations.facultyWithCourseValidationSchema), CourseControllers.assignFacultiesWithCourse);

router.delete('/:courseId/remove-faculties', validateRequest(CourseValidations.facultyWithCourseValidationSchema), CourseControllers.removeFacultyWithCourse)

router.delete('/:id', CourseControllers.deleteCourse);

export const CourseRoutes = router;