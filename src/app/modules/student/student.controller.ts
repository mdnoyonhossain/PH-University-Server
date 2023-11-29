import { RequestHandler } from "express";
import { StudentServices } from "./student.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from 'http-status';
import catchAsync from "../../utils/catchAsync";

const getAllStudens = catchAsync(async (req, res) => {
    const result = await StudentServices.getAllStudentFromDB();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Student are Retrived Successfully',
        data: result
    })
});

const getSingleStudent: RequestHandler = catchAsync(async (req, res) => {
    const { studentId } = req.params;
    const result = await StudentServices.getSingleStudentFromDB(studentId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Student are Specfic Student Successfully',
        data: result
    })
});

const deleteStudent: RequestHandler = catchAsync(async (req, res) => {
    const { studentId } = req.params;
    const result = await StudentServices.deleteStudentFromDB(studentId)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Student Delete Successfully',
        data: result
    })
});

export const StudentControllers = {
    getAllStudens,
    getSingleStudent,
    deleteStudent
}

