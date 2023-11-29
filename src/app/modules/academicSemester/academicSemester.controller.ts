import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from 'http-status';
import { AcademicSemesterServices } from "./academicSemester.service";

const createAcademicSemester: RequestHandler = catchAsync(async (req, res) => {
    const academicSemester = req.body;
    const result = await AcademicSemesterServices.createAcademicSemesterIntoDB(academicSemester);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Academic Semester is create successfully',
        data: result
    })
});

const getAllAcademicSemester = catchAsync(async (req, res) => {
    const result = await AcademicSemesterServices.getAllAcademicSemesterFromDB();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Academic Semester are Retrived Successfully',
        data: result
    })
});

const getSingleAcademicSemester = catchAsync(async (req, res) => {
    const { semesterId } = req.params;
    const result = await AcademicSemesterServices.getSingleAcademicSemesterFromDB(semesterId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Academic Specfic Semester Retrived Successfully',
        data: result
    })
});

const updateAcademicSemester = catchAsync(async (req, res) => {
    const { semesterId } = req.params;
    const academicSemester = req.body;
    const result = await AcademicSemesterServices.updateAcademicSemesterFromDB(semesterId, academicSemester);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Academic Semester Updated Successfullly.',
        data: result
    })
});

export const AcademicSemesterControllers = {
    createAcademicSemester,
    getAllAcademicSemester,
    getSingleAcademicSemester,
    updateAcademicSemester
}