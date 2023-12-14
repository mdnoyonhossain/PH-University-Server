import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CourseServices } from "./course.service";

const createCourse = catchAsync(async (req, res) => {
    const course = req.body;
    const result = await CourseServices.createCourseIntoDB(course);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Course is Created Successfully.',
        data: result
    })
});

const getAllCourse = catchAsync(async (req, res) => {
    const query = req.query;
    const result = await CourseServices.getAllCourseFromDB(query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Course are retrive Successfully.',
        data: result
    })
});

const getSingleCourse = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CourseServices.getSingleCourseFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Course are retrive Successfully.',
        data: result
    })
});

const updateCourse = catchAsync(async (req, res) => {
    const { id } = req.params;
    const course = req.body;
    const result = await CourseServices.updateCourseIntoDB(id, course);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Course is Updated Successfully',
        data: result
    })
});

const assignFacultiesWithCourse = catchAsync(async (req, res) => {
    const { courseId } = req.params;
    const { faculties } = req.body;
    const result = await CourseServices.assignFacultyWithCourseIntoDB(courseId, faculties);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Faculty assigned Successfully',
        data: result
    })
});

const removeFacultyWithCourse = catchAsync(async (req, res) => {
    const { courseId } = req.params;
    const { faculties } = req.body;
    const result = await CourseServices.removeFacultyWithCourseFromDB(courseId, faculties);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Faculty remove Successfully',
        data: result
    })
})

const deleteCourse = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CourseServices.deleteCourseIntoDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Course deleted Successfully.',
        data: result
    })
})

export const CourseControllers = {
    createCourse,
    getAllCourse,
    getSingleCourse,
    updateCourse,
    assignFacultiesWithCourse,
    removeFacultyWithCourse,
    deleteCourse
}
