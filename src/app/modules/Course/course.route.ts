import express from 'express';
import { CourseControllers } from './course.controller';
import validateRequest from '../../middlewares/validateRequest';
import { CourseValidations } from './course.validation';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post('/create-course', auth('admin'), validateRequest(CourseValidations.createCourseValidationSchema), CourseControllers.createCourse);

router.get('/', CourseControllers.getAllCourse);

router.get('/:id', auth('admin', 'student', 'faculty'), CourseControllers.getSingleCourse);

router.patch('/:id', validateRequest(CourseValidations.updatePreateCourseValidationSchema), CourseControllers.updateCourse);

router.put('/:courseId/assing-faculties', auth('admin'), validateRequest(CourseValidations.facultyWithCourseValidationSchema), CourseControllers.assignFacultiesWithCourse);

router.delete('/:courseId/remove-faculties', validateRequest(CourseValidations.facultyWithCourseValidationSchema), CourseControllers.removeFacultyWithCourse)

router.delete('/:id', auth('admin'), CourseControllers.deleteCourse);

export const CourseRoutes = router;