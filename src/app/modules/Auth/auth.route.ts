import express from 'express';
import { AuthControllers } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidation } from './auth.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post('/login', validateRequest(AuthValidation.loginUserValidationSchema), AuthControllers.loginUser);

router.post('/change-password', auth(USER_ROLE.admin, USER_ROLE.student, USER_ROLE.faculty), validateRequest(AuthValidation.changePasswordValidationSchema), AuthControllers.changePassword);

router.post('/refresh-token', validateRequest(AuthValidation.refreshTokenValidationSchema), AuthControllers.refreshToken);

export const AuthRoutes = router;