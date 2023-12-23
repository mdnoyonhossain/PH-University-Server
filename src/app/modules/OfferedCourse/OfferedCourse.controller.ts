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

const getAllOfferedCourses = catchAsync(async (req, res) => {
    const result = await OfferedCourseServices.getAllOfferedCoursesFromDB(
        req.query,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'OfferedCourses retrieved successfully !',
        data: result,
    });
});

const getSingleOfferedCourses = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await OfferedCourseServices.getSingleOfferedCourseFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'OfferedCourse fetched successfully',
        data: result,
    });
},
);

const updateOfferedCourse = catchAsync(async (req, res) => {
    const { id } = req.params;
    const offeredCourse = req.body;
    const result = await OfferedCourseServices.updateOfferedCourseIntoDB(id, offeredCourse);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Offered Course is Updated sucessfully !',
        data: result
    })
});

const deleteOfferedCourseFromDB = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await OfferedCourseServices.deleteOfferedCourseFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'OfferedCourse deleted successfully',
        data: result,
    });
},
);

export const OfferedCourseControllers = {
    createOfferedCourse,
    getAllOfferedCourses,
    getSingleOfferedCourses,
    updateOfferedCourse,
    deleteOfferedCourseFromDB,
}