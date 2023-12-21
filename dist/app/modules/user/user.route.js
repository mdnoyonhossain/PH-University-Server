"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const student_validaton_schema_1 = require("../student/student.validaton.schema");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const faculty_validation_1 = require("../Faculty/faculty.validation");
const admin_validation_1 = require("../Admin/admin.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("./user.constant");
const user_validation_1 = require("./user.validation");
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const router = express_1.default.Router();
router.post('/create-student', (0, auth_1.default)(user_constant_1.USER_ROLE.admin), sendImageToCloudinary_1.upload.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(student_validaton_schema_1.StudentValidations.createStudentValidatoinSchema), user_controller_1.UserController.createStudent);
router.post('/create-faculty', (0, auth_1.default)(user_constant_1.USER_ROLE.admin), (0, validateRequest_1.default)(faculty_validation_1.facultyValidations.createFacultyValidationSchema), user_controller_1.UserController.createFaculty);
router.post('/create-admin', /*auth(USER_ROLE.admin),*/ (0, validateRequest_1.default)(admin_validation_1.AdminValidations.createAdminValidationSchema), user_controller_1.UserController.createAdmin);
router.post('/change-status/:id', (0, auth_1.default)('admin'), (0, validateRequest_1.default)(user_validation_1.UserValidation.changeStatusValidationSchema), user_controller_1.UserController.changeStatus);
router.get('/me', (0, auth_1.default)('admin', 'student', 'faculty'), user_controller_1.UserController.getMe);
exports.UserRoutes = router;
