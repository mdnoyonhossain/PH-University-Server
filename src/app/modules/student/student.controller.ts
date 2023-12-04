import { StudentServices } from "./student.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from 'http-status';
import catchAsync from "../../utils/catchAsync";

const getAllStudens = catchAsync(async (req, res) => {
    const query = req.query;
    const result = await StudentServices.getAllStudentFromDB(query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Student are Retrived Successfully',
        data: result
    })
});

const getSingleStudent = catchAsync(async (req, res) => {
    const { studentId } = req.params;
    const result = await StudentServices.getSingleStudentFromDB(studentId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Student are Specfic Student Successfully',
        data: result
    })
});

const updateStudent = catchAsync(async (req, res) => {
    const { studentId } = req.params;
    const { student } = req.body;

    const result = await StudentServices.updateStudentIntoDB(studentId, student);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Student is updated Successfully',
        data: result
    })
});

const deleteStudent = catchAsync(async (req, res) => {
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
    updateStudent,
    deleteStudent
}

