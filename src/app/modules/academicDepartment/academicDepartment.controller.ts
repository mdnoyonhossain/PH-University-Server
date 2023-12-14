import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AcademicDepartmentServices } from "./academicDepartment.service";

const createAcademicDepartment = catchAsync(async (req, res) => {
    const academicDepartment = req.body;
    const result = await AcademicDepartmentServices.createAcademicDepartmentIntoDB(academicDepartment);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Academic Department is Created Successfully',
        data: result
    })
});

const getAllAcademicDepartment = catchAsync(async (req, res) => {
    const result = await AcademicDepartmentServices.getAllAcademicDepartmentFromDB();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Academic Department is retrived Successfully',
        data: result
    })
});

const getSingleAcademicDepartment = catchAsync(async (req, res) => {
    const { departmentId } = req.params;
    const result = await AcademicDepartmentServices.getSingleAcademicDepartmentFromDB(departmentId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Academic Department are retrieved Successfully',
        data: result
    })
});

const updateAcademicDepartment = catchAsync(async (req, res) => {
    const { departmentId } = req.params;
    const department = req.body;
    const result = await AcademicDepartmentServices.updateAcademicDepartmentIntoDB(departmentId, department);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Academic Department is Updated Successfully',
        data: result
    })
})

export const AcademicDepartmentControllers = {
    createAcademicDepartment,
    getAllAcademicDepartment,
    getSingleAcademicDepartment,
    updateAcademicDepartment
}