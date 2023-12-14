import express from 'express';
import { AcademicDepartmentControllers } from './academicDepartment.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicDepartmentValidations } from './academicDepartment.validation';

const router = express.Router();

router.post('/create-academic-department', validateRequest(AcademicDepartmentValidations.createAcademicDepartmentValidationSchema), AcademicDepartmentControllers.createAcademicDepartment);

router.get('/', AcademicDepartmentControllers.getAllAcademicDepartment);

router.get('/:departmentId', AcademicDepartmentControllers.getSingleAcademicDepartment);

router.patch('/:departmentId', validateRequest(AcademicDepartmentValidations.updateAcademicDepartmentValidationSchema), AcademicDepartmentControllers.updateAcademicDepartment);

export const AcademicDepartmentRoutes = router;