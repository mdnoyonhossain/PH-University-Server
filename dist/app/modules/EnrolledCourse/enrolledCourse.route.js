"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrolledCourseRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_constant_1 = require("../User/user.constant");
const enrolledCourse_controller_1 = require("./enrolledCourse.controller");
const enrolledCourse_validaton_1 = require("./enrolledCourse.validaton");
const router = express_1.default.Router();
router.post('/create-enrolled-course', (0, auth_1.default)(user_constant_1.USER_ROLE.student), (0, validateRequest_1.default)(enrolledCourse_validaton_1.EnrolledCourseValidations.createEnrolledCourseValidationZodSchema), enrolledCourse_controller_1.EnrolledCourseControllers.createEnrolledCourse);
router.get('/my-enrolled-courses', (0, auth_1.default)(user_constant_1.USER_ROLE.student), enrolledCourse_controller_1.EnrolledCourseControllers.getMyEnrolledCourses);
router.patch('/update-enrolled-course-marks', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.faculty), (0, validateRequest_1.default)(enrolledCourse_validaton_1.EnrolledCourseValidations.updateEnrolledCourseMarksValidationZodSchema), enrolledCourse_controller_1.EnrolledCourseControllers.updateEnrolledCourseMarks);
exports.EnrolledCourseRoutes = router;
