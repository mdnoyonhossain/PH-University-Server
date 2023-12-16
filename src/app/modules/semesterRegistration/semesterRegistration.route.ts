import express from 'express';
import { SemesterRegistrationControllers } from './SemesterRegistration.controller';
import validateRequest from '../../middlewares/validateRequest';
import { SemesterRegistrationValidations } from './semesterRegistration.validation';

const router = express.Router();

router.post('/create-semester-registration', validateRequest(SemesterRegistrationValidations.createSemesterRegistrationValidationSchema), SemesterRegistrationControllers.createSemesterRegistration);

router.get('/', SemesterRegistrationControllers.getAllSemesterRegistration);

router.get('/:id', SemesterRegistrationControllers.getSingleSemesterRegistration);

router.patch('/:id', validateRequest(SemesterRegistrationValidations.updateSemesterRegistrationValidationSchema), SemesterRegistrationControllers.updateSemesterRegistration);

export const SemesterRegistrationRoutes = router;