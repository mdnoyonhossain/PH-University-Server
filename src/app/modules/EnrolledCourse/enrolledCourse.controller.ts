import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { EnrolledCourseServices } from "./enrolledCourse.service";

const createEnrolledCourse = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const offeredCourse = req.body;
    const result = await EnrolledCourseServices.createEnrolledCourseIntoDB(userId, offeredCourse);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Student is Enrolled Successfullly',
        data: result
    })
});

const updateEnrolledCourseMarks = catchAsync(async (req, res) => {
    const facultyId = req.user.userId;
    const enrolledCourse = req.body;
    const result = await EnrolledCourseServices.updateEnrolledCourseMarksIntoDB(facultyId, enrolledCourse);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Marks is Updated Successfullly',
        data: result
    })
})

export const EnrolledCourseControllers = {
    createEnrolledCourse,
    updateEnrolledCourseMarks
}