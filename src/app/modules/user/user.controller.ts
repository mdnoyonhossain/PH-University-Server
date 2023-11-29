import { RequestHandler } from "express";
import { UserService } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";

const createStudent: RequestHandler = catchAsync(async (req, res) => {
    const { password, student: studentData } = req.body;
    const result = await UserService.createStudentIntoDB(password, studentData)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Student is created Successfully',
        data: result
    })
})

export const UserController = {
    createStudent
}