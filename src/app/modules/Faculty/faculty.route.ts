import express from 'express';
import { FacultyControllers } from './faculty.controller';
import validateRequest from '../../middlewares/validateRequest';
import { facultyValidations } from './faculty.validation';

const router = express.Router();

router.get('/', FacultyControllers.getAllFaculty);

router.get('/:id', FacultyControllers.getSingleFaculty);

router.patch('/:id', validateRequest(facultyValidations.updateFacultyValidationSchema), FacultyControllers.updateFaculty);

router.delete('/:id', FacultyControllers.deletedFaculty)

export const FacultyRoutes = router;