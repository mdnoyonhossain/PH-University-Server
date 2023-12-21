import { UserService } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";

const createStudent = catchAsync(async (req, res) => {
    const file = req.file;
    const { password, student: studentData } = req.body;
    const result = await UserService.createStudentIntoDB(file, password, studentData)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Student is created Successfully',
        data: result
    })
});

const createFaculty = catchAsync(async (req, res) => {
    const { password, faculty: facultyData } = req.body;

    const result = await UserService.createFacultyIntoDB(password, facultyData);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Faculty is created succesfully',
        data: result,
    });
});

const createAdmin = catchAsync(async (req, res) => {
    const { password, admin: adminData } = req.body;

    const result = await UserService.createAdminIntoDB(password, adminData);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Admin is created succesfully',
        data: result,
    });
});

const getMe = catchAsync(async (req, res) => {
    const { userId, role } = req.user;
    const result = await UserService.getMe(userId, role);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User is Retrived succesfully',
        data: result,
    });
});

const changeStatus = catchAsync(async (req, res) => {
    const id = req.params.id;
    const status = req.body;
    const result = await UserService.changeStatus(id, status);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Status is Updated succesfully',
        data: result,
    });
})

export const UserController = {
    createStudent,
    createFaculty,
    createAdmin,
    getMe,
    changeStatus
}