"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrolledCourseRoutes = void 0;
const express_1 = __importDefault(require("express"));
const enrolledCourse_controller_1 = require("./enrolledCourse.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const enrolledCourse_validation_1 = require("./enrolledCourse.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.post('/create-enrolled-course', (0, auth_1.default)('student'), (0, validateRequest_1.default)(enrolledCourse_validation_1.EnrolledCourseValidations.enrolledCoursValidationSchema), enrolledCourse_controller_1.EnrolledCourseControllers.createEnrolledCourse);
router.patch('/update-enrolled-course-marks', (0, auth_1.default)('faculty'), (0, validateRequest_1.default)(enrolledCourse_validation_1.EnrolledCourseValidations.updateEnrolledCoursValidationSchema), enrolledCourse_controller_1.EnrolledCourseControllers.updateEnrolledCourseMarks);
exports.EnrolledCourseRoutes = router;
