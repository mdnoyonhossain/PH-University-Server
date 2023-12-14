import express from 'express';
import { AcademicFacultyControllers } from './academicFaculty.controller';
import validateRequest from '../../middlewares/validateRequest';
import { academicFacultyValidations } from './academicFaculty.validation';

const router = express.Router();

router.post('/create-academic-faculty', validateRequest(academicFacultyValidations.createAcademicFacultyValidationSchema), AcademicFacultyControllers.createAcademicFaculty);

router.get('/', AcademicFacultyControllers.getAllAcademicFaculty);

router.get('/:facultyId', AcademicFacultyControllers.getSingleAcademicFaculty);

router.patch('/:facultyId', validateRequest(academicFacultyValidations.updateAcademicFacultyValidationSchema), AcademicFacultyControllers.updateAcademicFaculty)

export const AcademicFacultyRoutes = router;