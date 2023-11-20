"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentControllers = void 0;
const student_service_1 = require("./student.service");
const student_validaton_schema_1 = __importDefault(require("./student.validaton.schema"));
const createStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { student: studentData } = req.body;
        // zod validation using
        const zodParseData = student_validaton_schema_1.default.parse(studentData);
        const result = yield student_service_1.StudentServices.createStudentIntoDB(zodParseData);
        res.status(200).json({
            success: true,
            message: 'Student create Successfully',
            data: result
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Something went wrong!",
            error: err
        });
    }
});
const getAllStudens = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield student_service_1.StudentServices.getAllStudentFromDB();
        res.status(200).json({
            success: true,
            message: 'Student are Retrived Successfully',
            data: result
        });
    }
    catch (err) {
        console.log(err);
    }
});
const getSingleStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { studentId } = req.params;
        const result = yield student_service_1.StudentServices.getSingleStudentFromDB(studentId);
        res.status(200).json({
            success: true,
            message: 'Student are Specfic Student Successfully',
            data: result
        });
    }
    catch (err) {
        console.log(err);
    }
});
const deleteStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { studentId } = req.params;
        const result = yield student_service_1.StudentServices.deleteStudentFromDB(studentId);
        res.status(200).json({
            success: true,
            message: 'Student Delete Successfully',
            data: result
        });
    }
    catch (err) {
        res.status(500).json({
            success: true,
            message: "Something went wrong",
            error: err
        });
    }
});
exports.StudentControllers = {
    createStudent,
    getAllStudens,
    getSingleStudent,
    deleteStudent
};
