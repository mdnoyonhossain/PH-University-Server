import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { OfferedCourseServices } from "./OfferedCourse.service";

const createOfferedCourse = catchAsync(async (req, res) => {
    const offeredCourse = req.body;
    const result = await OfferedCourseServices.createOfferedCourseIntoDB(offeredCourse);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Offered Course is created sucessfully !',
        data: result
    })
});

const updateOfferedCourse = catchAsync(async (req, res) => {
    const {id} = req.params;
    const offeredCourse = req.body;
    const result = await OfferedCourseServices.updateOfferedCourseIntoDB(id, offeredCourse);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Offered Course is Updated sucessfully !',
        data: result
    })

})

export const OfferedCourseControllers = {
    createOfferedCourse,
    updateOfferedCourse
}