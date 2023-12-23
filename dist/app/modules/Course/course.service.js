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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const course_constant_1 = require("./course.constant");
const course_model_1 = require("./course.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const createCourseIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield course_model_1.Course.create(payload);
    return result;
});
const getAllCourseFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const courseQuery = new QueryBuilder_1.default(course_model_1.Course.find().populate('preRequisiteCourse.course'), query).search(course_constant_1.CourseSearchableFields).filter().sort().paginate().fields();
    const meta = yield courseQuery.countTotal();
    const result = yield courseQuery.modelQuery;
    return {
        meta,
        result
    };
});
const getSingleCourseFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield course_model_1.Course.findById(id).populate('preRequisiteCourse.course');
    return result;
});
const updateCourseIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { preRequisiteCourse } = payload, courseRemainingData = __rest(payload, ["preRequisiteCourse"]);
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // steep:1 Basic Course Info Update
        const updateBasicCourseInfo = yield course_model_1.Course.findByIdAndUpdate(id, courseRemainingData, { new: true, runValidators: true, session });
        if (!updateBasicCourseInfo) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Faild to update course');
        }
        // check if there is any pre requisite course to update
        if (preRequisiteCourse && preRequisiteCourse.length > 0) {
            const deletePreRequisite = preRequisiteCourse.filter(element => element.course && element.isDeleted);
            const deletePullPreRequisiteId = deletePreRequisite.map(element => element.course);
            const deletePreRequisiteCourses = yield course_model_1.Course.findByIdAndUpdate(id, {
                $pull: { preRequisiteCourse: { course: { $in: deletePullPreRequisiteId } } }
            }, { new: true, runValidators: true, session });
            if (!deletePreRequisiteCourses) {
                throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Faild to update Course');
            }
            // filter out the new course fields
            const newPreRequisite = preRequisiteCourse === null || preRequisiteCourse === void 0 ? void 0 : preRequisiteCourse.filter(elm => elm.course && !elm.isDeleted);
            const newPreRequisiteCourse = yield course_model_1.Course.findByIdAndUpdate(id, {
                $addToSet: { preRequisiteCourse: { $each: newPreRequisite } }
            }, { new: true, runValidators: true, session });
            if (!newPreRequisiteCourse) {
                throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Faild to update Course');
            }
            const result = yield course_model_1.Course.findById(id).populate('preRequisiteCourse.course');
            return result;
        }
        yield session.commitTransaction();
        yield session.endSession();
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Faild to update course');
    }
});
const assignFacultyWithCourseIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield course_model_1.CourseFaculty.findByIdAndUpdate(id, {
        course: id,
        $addToSet: { faculties: { $each: payload } }
    }, {
        upsert: true,
        new: true,
        runValidators: true
    });
    return result;
});
const removeFacultyWithCourseFromDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield course_model_1.CourseFaculty.findByIdAndUpdate(id, {
        $pull: { faculties: { $in: payload } }
    }, { new: true });
    return result;
});
const deleteCourseIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield course_model_1.Course.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    return result;
});
exports.CourseServices = {
    createCourseIntoDB,
    getAllCourseFromDB,
    getSingleCourseFromDB,
    updateCourseIntoDB,
    assignFacultyWithCourseIntoDB,
    removeFacultyWithCourseFromDB,
    deleteCourseIntoDB
};
