import express from 'express';
import { StudentControllers } from './student.controller';
import validateRequest from '../../middlewares/validateRequest';
import { StudentValidations } from './student.validaton.schema';

const router = express.Router();

router.get('/', StudentControllers.getAllStudens);

router.get('/:id', StudentControllers.getSingleStudent);

router.patch('/:id', validateRequest(StudentValidations.updateStudentValidationSchema), StudentControllers.updateStudent);

router.delete('/:id', StudentControllers.deleteStudent);

export const StudentRoutes = router;