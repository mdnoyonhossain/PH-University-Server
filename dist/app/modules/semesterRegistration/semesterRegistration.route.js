"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SemesterRegistrationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const SemesterRegistration_controller_1 = require("./SemesterRegistration.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const semesterRegistration_validation_1 = require("./semesterRegistration.validation");
const router = express_1.default.Router();
router.post('/create-semester-registration', (0, validateRequest_1.default)(semesterRegistration_validation_1.SemesterRegistrationValidations.createSemesterRegistrationValidationSchema), SemesterRegistration_controller_1.SemesterRegistrationControllers.createSemesterRegistration);
router.get('/', SemesterRegistration_controller_1.SemesterRegistrationControllers.getAllSemesterRegistration);
router.get('/:id', SemesterRegistration_controller_1.SemesterRegistrationControllers.getSingleSemesterRegistration);
router.patch('/:id', (0, validateRequest_1.default)(semesterRegistration_validation_1.SemesterRegistrationValidations.updateSemesterRegistrationValidationSchema), SemesterRegistration_controller_1.SemesterRegistrationControllers.updateSemesterRegistration);
exports.SemesterRegistrationRoutes = router;
