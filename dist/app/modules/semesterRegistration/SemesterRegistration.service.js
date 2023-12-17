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
exports.SemesterRegistrationServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const academicSemester_model_1 = require("../academicSemester/academicSemester.model");
const semesterRegistration_model_1 = require("./semesterRegistration.model");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const semesterRegistration_constant_1 = require("./semesterRegistration.constant");
const createSemesterRegistrationIntoDB = (paylaod) => __awaiter(void 0, void 0, void 0, function* () {
    // check if the semester is exist
    const isAcademicSemesterExists = yield academicSemester_model_1.AcademicSemester.findById(paylaod === null || paylaod === void 0 ? void 0 : paylaod.academicSemester);
    if (!isAcademicSemesterExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'This Academic Semester Not Found !');
    }
    // check if ther any registered semester that is already 'UPCOMING'/'ONGOING'
    const isThereAnyUpcomingOrOngoingSemester = yield semesterRegistration_model_1.SemesterRegistration.findOne({
        $or: [{ status: semesterRegistration_constant_1.RegistrationStatus.UPCOMING }, { status: semesterRegistration_constant_1.RegistrationStatus.ONGOING }]
    });
    if (isThereAnyUpcomingOrOngoingSemester) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `There is already an ${isThereAnyUpcomingOrOngoingSemester.status} Register Semester !`);
    }
    // check if the semester is already registered!
    const isSemesterRegistrationExists = yield semesterRegistration_model_1.SemesterRegistration.findOne({ academicSemester: paylaod === null || paylaod === void 0 ? void 0 : paylaod.academicSemester });
    if (isSemesterRegistrationExists) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, 'This Semester is Already Exists !');
    }
    const result = yield semesterRegistration_model_1.SemesterRegistration.create(paylaod);
    return result;
});
const getAllSemesterRegistrationFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const semesterRegistrationQuery = new QueryBuilder_1.default(semesterRegistration_model_1.SemesterRegistration.find().populate('academicSemester'), query).filter().sort().paginate().fields();
    const result = yield semesterRegistrationQuery.modelQuery;
    return result;
});
const getSingleSemesterRegistrationFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield semesterRegistration_model_1.SemesterRegistration.findById(id);
    return result;
});
const updateSemesterRegistrationIntoDB = (id, paylaod) => __awaiter(void 0, void 0, void 0, function* () {
    // check if the semester is already registred!
    const isSemesterRegistrationExists = yield semesterRegistration_model_1.SemesterRegistration.findById(id);
    if (!isSemesterRegistrationExists) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'This Semester is not found !');
    }
    // if the requested semester registred is ended, we will not update anything
    const currentSemesterStatus = isSemesterRegistrationExists === null || isSemesterRegistrationExists === void 0 ? void 0 : isSemesterRegistrationExists.status;
    if (currentSemesterStatus === semesterRegistration_constant_1.RegistrationStatus.ENDED) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `This semester is already ${currentSemesterStatus}`);
    }
    // UPCOMING --> ONGOING --> ENDED
    if (currentSemesterStatus === semesterRegistration_constant_1.RegistrationStatus.UPCOMING && (paylaod === null || paylaod === void 0 ? void 0 : paylaod.status) === semesterRegistration_constant_1.RegistrationStatus.ENDED) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `You can not directly change status from ${currentSemesterStatus} to ${paylaod === null || paylaod === void 0 ? void 0 : paylaod.status}`);
    }
    if (currentSemesterStatus === semesterRegistration_constant_1.RegistrationStatus.ONGOING && (paylaod === null || paylaod === void 0 ? void 0 : paylaod.status) === semesterRegistration_constant_1.RegistrationStatus.UPCOMING) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `You can not directly change status from ${currentSemesterStatus} to ${paylaod === null || paylaod === void 0 ? void 0 : paylaod.status}`);
    }
    const result = yield semesterRegistration_model_1.SemesterRegistration.findByIdAndUpdate(id, paylaod, { new: true, runValidators: true });
    return result;
});
exports.SemesterRegistrationServices = {
    createSemesterRegistrationIntoDB,
    getAllSemesterRegistrationFromDB,
    getSingleSemesterRegistrationFromDB,
    updateSemesterRegistrationIntoDB
};
