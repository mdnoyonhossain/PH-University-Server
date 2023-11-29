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
const router = express_1.default.Router();
router.post('/create-student', (0, validateRequest_1.default)(student_validaton_schema_1.StudentValidations.createStudentValidatoinSchema), user_controller_1.UserController.createStudent);
exports.UserRoutes = router;
