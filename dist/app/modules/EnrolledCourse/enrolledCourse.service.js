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
exports.EnrolledCourseServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const OfferedCourse_model_1 = require("../OfferedCourse/OfferedCourse.model");
const enrolledCourse_model_1 = require("./enrolledCourse.model");
const student_model_1 = require("../student/student.model");
const mongoose_1 = __importDefault(require("mongoose"));
const semesterRegistration_model_1 = require("../semesterRegistration/semesterRegistration.model");
const course_model_1 = require("../Course/course.model");
const faculty_model_1 = require("../Faculty/faculty.model");
const enrolledCourse_utils_1 = require("./enrolledCourse.utils");
const createEnrolledCourseIntoDB = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    /**
     * Steep1: check if the offered course is exists
     * Steep2: Check if the strudent is alredy existes
     * Steep3: Create an enrolled courses
     */
    const { offeredCourse } = payload;
    const isOfferedCourseExists = yield OfferedCourse_model_1.OfferedCourse.findById(offeredCourse);
    if (!isOfferedCourseExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Offered Course Not Found!');
    }
    const course = yield course_model_1.Course.findById(isOfferedCourseExists.course);
    if (isOfferedCourseExists.maxCapacity <= 0) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Room is Full!');
    }
    const student = yield student_model_1.Student.findOne({ id: userId }, { _id: 1 });
    if (!student) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Student Not Found!');
    }
    const isStudentAlreadyExists = yield enrolledCourse_model_1.EnrolledCourse.findOne({
        semesterRegistration: isOfferedCourseExists.semesterRegistration,
        offeredCourse,
        student: student._id
    });
    if (isStudentAlreadyExists) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, 'Student is Already Enrolled!');
    }
    // check total credits exceeds maxCredit
    const semesterRegistration = yield semesterRegistration_model_1.SemesterRegistration.findById(isOfferedCourseExists.semesterRegistration).select('maxCredit');
    const maxCredit = semesterRegistration === null || semesterRegistration === void 0 ? void 0 : semesterRegistration.maxCredit;
    const enrolledCourse = yield enrolledCourse_model_1.EnrolledCourse.aggregate([
        // Stage1:
        { $match: { semesterRegistration: isOfferedCourseExists.semesterRegistration, student: student._id } },
        // Stage2:
        {
            $lookup: {
                from: 'courses',
                localField: 'course',
                foreignField: '_id',
                as: 'enrolledCourseData'
            }
        },
        // Stage3:
        {
            $unwind: '$enrolledCourseData'
        },
        // Stage4:
        {
            $group: { _id: null, totalEnrolledCredits: { $sum: '$enrolledCourseData.credits' } }
        },
        // Stage5:
        {
            $project: { _id: 0, totalEnrolledCredits: 1 }
        }
    ]);
    // total enrolled credits + new enrolled credites credit > maxcredit
    const totalCredits = enrolledCourse.length > 0 ? enrolledCourse[0].totalEnrolledCredits : 0;
    if (totalCredits && maxCredit && totalCredits + (course === null || course === void 0 ? void 0 : course.credits) > maxCredit) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'You have exceeded Maximum Number of Credits!');
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const result = yield enrolledCourse_model_1.EnrolledCourse.create([{
                semesterRegistration: isOfferedCourseExists.semesterRegistration,
                academicSemester: isOfferedCourseExists.academicSemester,
                academicFaculty: isOfferedCourseExists.academicFaculty,
                academicDepartment: isOfferedCourseExists.academicDepartment,
                offeredCourse: offeredCourse,
                course: isOfferedCourseExists.course,
                student: student._id,
                faculty: isOfferedCourseExists.faculty,
                isEnrolled: true
            }], { session });
        if (!result) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to enroll in this Course!');
        }
        const maxCapacity = isOfferedCourseExists.maxCapacity;
        yield OfferedCourse_model_1.OfferedCourse.findByIdAndUpdate(offeredCourse, { maxCapacity: maxCapacity - 1 });
        yield session.commitTransaction();
        yield session.endSession();
        return result;
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(err);
    }
});
const updateEnrolledCourseMarksIntoDB = (facultyId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { semesterRegistration, offeredCourse, student, courseMarks } = payload;
    const isSemesterRegistrationExists = yield semesterRegistration_model_1.SemesterRegistration.findById(semesterRegistration);
    if (!isSemesterRegistrationExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Semester registration not found !');
    }
    const isOfferedCourseExists = yield OfferedCourse_model_1.OfferedCourse.findById(offeredCourse);
    if (!isOfferedCourseExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Offered course not found !');
    }
    const isStudentExists = yield student_model_1.Student.findById(student);
    if (!isStudentExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Student not found !');
    }
    const faculty = yield faculty_model_1.Faculty.findOne({ id: facultyId }, { _id: 1 });
    if (!faculty) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Faculty not found !');
    }
    const isCourseBelongToFaculty = yield enrolledCourse_model_1.EnrolledCourse.findOne({
        semesterRegistration,
        offeredCourse,
        student,
        faculty: faculty._id,
    });
    if (!isCourseBelongToFaculty) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'You are forbidden! !');
    }
    const modifiedData = Object.assign({}, courseMarks);
    if (courseMarks === null || courseMarks === void 0 ? void 0 : courseMarks.finalTerm) {
        const { classTest1, midTerm, classTest2, finalTerm } = isCourseBelongToFaculty.courseMarks;
        const totalMarks = Math.ceil(classTest1 * 0.1) + Math.ceil(midTerm * 0.3) + Math.ceil(classTest2 * 0.1) + Math.ceil(finalTerm * 0.5);
        const result = (0, enrolledCourse_utils_1.calculateGradenAndPoints)(totalMarks);
        modifiedData.grade = result.grade;
        modifiedData.gradePoints = result.gradePoints;
        modifiedData.isCompleted = true;
    }
    if (courseMarks && Object.keys(courseMarks).length) {
        for (const [key, value] of Object.entries(courseMarks)) {
            modifiedData[`courseMarks.${key}`] = value;
        }
    }
    const result = yield enrolledCourse_model_1.EnrolledCourse.findByIdAndUpdate(isCourseBelongToFaculty._id, modifiedData, {
        new: true,
    });
    return result;
});
exports.EnrolledCourseServices = {
    createEnrolledCourseIntoDB,
    updateEnrolledCourseMarksIntoDB
};
