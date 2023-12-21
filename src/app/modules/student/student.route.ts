import express from 'express';
import { StudentControllers } from './student.controller';
import validateRequest from '../../middlewares/validateRequest';
import { StudentValidations } from './student.validaton.schema';
import auth from '../../middlewares/auth';

const router = express.Router();

router.get('/', StudentControllers.getAllStudens);

router.get('/:id', auth('admin', 'faculty'), StudentControllers.getSingleStudent);

router.patch('/:id', validateRequest(StudentValidations.updateStudentValidationSchema), StudentControllers.updateStudent);

router.delete('/:id', StudentControllers.deleteStudent);

export const StudentRoutes = router;