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
exports.SemesterRegistrationControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const SemesterRegistration_service_1 = require("./SemesterRegistration.service");
const createSemesterRegistration = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const semester = req.body;
    const result = yield SemesterRegistration_service_1.SemesterRegistrationServices.createSemesterRegistrationIntoDB(semester);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Semester Registration is Created Successfully',
        data: result
    });
}));
const getAllSemesterRegistration = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield SemesterRegistration_service_1.SemesterRegistrationServices.getAllSemesterRegistrationFromDB(query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Semester Registration is Retrived Successfully',
        data: result
    });
}));
const getSingleSemesterRegistration = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield SemesterRegistration_service_1.SemesterRegistrationServices.getSingleSemesterRegistrationFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Semester Registration is Retrived Successfully',
        data: result
    });
}));
const updateSemesterRegistration = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const semester = req.body;
    const result = yield SemesterRegistration_service_1.SemesterRegistrationServices.updateSemesterRegistrationIntoDB(id, semester);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Semester Registration is Updated Successfully',
        data: result
    });
}));
exports.SemesterRegistrationControllers = {
    createSemesterRegistration,
    getAllSemesterRegistration,
    getSingleSemesterRegistration,
    updateSemesterRegistration
};
