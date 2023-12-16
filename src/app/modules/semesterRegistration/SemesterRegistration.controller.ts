import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { SemesterRegistrationServices } from "./SemesterRegistration.service";

const createSemesterRegistration = catchAsync(async (req, res) => {
    const semester = req.body;
    const result = await SemesterRegistrationServices.createSemesterRegistrationIntoDB(semester);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Semester Registration is Created Successfully',
        data: result
    })
});

const getAllSemesterRegistration = catchAsync(async (req, res) => {
    const query = req.query;
    const result = await SemesterRegistrationServices.getAllSemesterRegistrationFromDB(query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Semester Registration is Retrived Successfully',
        data: result
    })
});

const getSingleSemesterRegistration = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await SemesterRegistrationServices.getSingleSemesterRegistrationFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Semester Registration is Retrived Successfully',
        data: result
    })
});

const updateSemesterRegistration = catchAsync(async (req, res) => {
    const { id } = req.params;
    const semester = req.body;
    const result = await SemesterRegistrationServices.updateSemesterRegistrationIntoDB(id, semester);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Semester Registration is Updated Successfully',
        data: result
    })
})

export const SemesterRegistrationControllers = {
    createSemesterRegistration,
    getAllSemesterRegistration,
    getSingleSemesterRegistration,
    updateSemesterRegistration
}