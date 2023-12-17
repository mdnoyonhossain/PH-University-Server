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
exports.OfferedCourseServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const semesterRegistration_model_1 = require("../semesterRegistration/semesterRegistration.model");
const OfferedCourse_model_1 = require("./OfferedCourse.model");
const academicFaculty_model_1 = require("../academicFaculty/academicFaculty.model");
const academicDepartment_model_1 = require("../academicDepartment/academicDepartment.model");
const course_model_1 = require("../Course/course.model");
const faculty_model_1 = require("../Faculty/faculty.model");
const OfferedCourse_utils_1 = require("./OfferedCourse.utils");
const createOfferedCourseIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { semesterRegistration, academicFaculty, academicDepartment, course, faculty, section, days, startTime, endTime } = payload;
    // check if the semester registred id is exists!
    const isSemesterRegistrationExists = yield semesterRegistration_model_1.SemesterRegistration.findById(semesterRegistration);
    if (!isSemesterRegistrationExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Semester Registration Not Found !');
    }
    // academic Semester
    const academicSemester = isSemesterRegistrationExists.academicSemester;
    // check if the academic Faculty id is exists!
    const isAcademicFacultyExists = yield academicFaculty_model_1.AcademicFaculty.findById(academicFaculty);
    if (!isAcademicFacultyExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Academic Faculty Not Found !');
    }
    // check if the academic Department id is exists!
    const isAcademicDepartmentExists = yield academicDepartment_model_1.AcademicDepartment.findById(academicDepartment);
    if (!isAcademicDepartmentExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Academic Department Not Found !');
    }
    // check if the Course id is exists!
    const isCourseExists = yield course_model_1.Course.findById(course);
    if (!isCourseExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Academic Department Not Found !');
    }
    // check if the faculty id is exists!
    const isFacultyExists = yield faculty_model_1.Faculty.findById(faculty);
    if (!isFacultyExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Faculty Not Found !');
    }
    // check if the department is belont to the faculty
    const isDepartmentBelongToFaculty = yield academicDepartment_model_1.AcademicDepartment.findOne({ academicFaculty, _id: academicDepartment });
    if (!isDepartmentBelongToFaculty) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `This ${isAcademicDepartmentExists.name} is not belong to this ${isAcademicFacultyExists.name}`);
    }
    const isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection = yield OfferedCourse_model_1.OfferedCourse.findOne({ semesterRegistration, course, section });
    if (isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Offered course with same section is already exists !`);
    }
    // get the schedules of the facultyies
    const assignedSchedules = yield OfferedCourse_model_1.OfferedCourse.find({ semesterRegistration, faculty, days: { $in: days } }).select('days startTime endTime');
    const newSchedule = {
        days,
        startTime,
        endTime
    };
    if ((0, OfferedCourse_utils_1.hasTimeConflict)(assignedSchedules, newSchedule)) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, `This Faculty is not available at that time! Choose other time or day`);
    }
    const result = yield OfferedCourse_model_1.OfferedCourse.create(Object.assign(Object.assign({}, payload), { academicSemester }));
    return result;
});
const updateOfferedCourseIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { faculty, days, startTime, endTime } = payload;
    // check Offered Course
    const isOfferedCourseExists = yield OfferedCourse_model_1.OfferedCourse.findById(id);
    if (!isOfferedCourseExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Offered Course Not Found!');
    }
    // check faculty
    const isFacultyExists = yield faculty_model_1.Faculty.findById(faculty);
    if (!isFacultyExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Faculty Not Found!');
    }
    const semesterRegistration = isOfferedCourseExists.semesterRegistration;
    // check semester status 'UPCOMING'
    const semesterRegistrationStatus = yield semesterRegistration_model_1.SemesterRegistration.findById(semesterRegistration);
    if ((semesterRegistrationStatus === null || semesterRegistrationStatus === void 0 ? void 0 : semesterRegistrationStatus.status) !== 'UPCOMING') {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `You can not update this Offered Course as it is ${semesterRegistrationStatus === null || semesterRegistrationStatus === void 0 ? void 0 : semesterRegistrationStatus.status}`);
    }
    // get the schedules of the facultyies
    const assignedSchedules = yield OfferedCourse_model_1.OfferedCourse.find({ semesterRegistration, faculty, days: { $in: days } }).select('days startTime endTime');
    const newSchedule = {
        days,
        startTime,
        endTime
    };
    if ((0, OfferedCourse_utils_1.hasTimeConflict)(assignedSchedules, newSchedule)) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, `This Faculty is not available at that time! Choose other time or day`);
    }
    const result = yield OfferedCourse_model_1.OfferedCourse.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    return result;
});
exports.OfferedCourseServices = {
    createOfferedCourseIntoDB,
    updateOfferedCourseIntoDB
};
