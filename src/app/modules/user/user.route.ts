import express from 'express';
import { UserController } from './user.controller';
import { StudentValidations } from '../student/student.validaton.schema';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

router.post('/create-student', validateRequest(StudentValidations.createStudentValidatoinSchema), UserController.createStudent);

export const UserRoutes = router;