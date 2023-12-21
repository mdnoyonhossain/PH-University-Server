import express, { NextFunction, Request, Response } from 'express';
import { UserController } from './user.controller';
import { StudentValidations } from '../student/student.validaton.schema';
import validateRequest from '../../middlewares/validateRequest';
import { facultyValidations } from '../Faculty/faculty.validation';
import { AdminValidations } from '../Admin/admin.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';
import { UserValidation } from './user.validation';
import { upload } from '../../utils/sendImageToCloudinary';

const router = express.Router();

router.post('/create-student', auth(USER_ROLE.admin), upload.single('file'), (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
}, validateRequest(StudentValidations.createStudentValidatoinSchema), UserController.createStudent);

router.post('/create-faculty', auth(USER_ROLE.admin), validateRequest(facultyValidations.createFacultyValidationSchema), UserController.createFaculty);

router.post('/create-admin', /*auth(USER_ROLE.admin),*/ validateRequest(AdminValidations.createAdminValidationSchema), UserController.createAdmin);

router.post('/change-status/:id', auth('admin'), validateRequest(UserValidation.changeStatusValidationSchema), UserController.changeStatus);

router.get('/me', auth('admin', 'student', 'faculty'), UserController.getMe);


export const UserRoutes = router;