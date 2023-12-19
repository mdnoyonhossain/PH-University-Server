import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { FacultyServices } from "./faculty.service";

const getAllFaculty = catchAsync(async (req, res) => {
    console.log(req.cookies);
    const query = req.query;
    const result = await FacultyServices.getAllFacultyFromDB(query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Faculties are retrieved succesfully',
        data: result
    })
});

const getSingleFaculty = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await FacultyServices.getSingleFacultyFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Faculty is retrieved succesfully',
        data: result,
    });
});

const updateFaculty = catchAsync(async (req, res) => {
    const { id } = req.params;
    const faculty = req.body;
    const result = await FacultyServices.updateFacultyIntoDB(id, faculty);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Faculty is updated succesfully',
        data: result
    })
});

const deletedFaculty = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await FacultyServices.deleteFacultyFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Faculty is deleted succesfully',
        data: result,
    });
})

export const FacultyControllers = {
    getAllFaculty,
    getSingleFaculty,
    updateFaculty,
    deletedFaculty
}