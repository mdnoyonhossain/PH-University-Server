import { Request, Response } from "express";
import { StudentServices } from "./student.service";

const createStudent = async (req: Request, res: Response) => {
    try {
        const { student: studentData } = req.body;
        const result = await StudentServices.createStudentIntoDB(studentData);

        res.status(200).json({
            success: true,
            message: 'Student create Successfully',
            data: result
        })
    } catch (err) {
        console.log(err);
    }
}

const getAllStudens = async (req: Request, res: Response) => {
    try {
        const result = await StudentServices.getAllStudentFromDB();

        res.status(200).json({
            success: true,
            message: 'Student are Retrived Successfully',
            data: result
        })
    } catch (err) {
        console.log(err);
    }
}

const getSingleStudent = async (req: Request, res: Response) => {
    try {
        const { studentId } = req.params;
        const result = await StudentServices.getSingleStudentFromDB(studentId);

        res.status(200).json({
            success: true,
            message: 'Student are Specfic Student Successfully',
            data: result
        })
    } catch (err) {
        console.log(err);
    }
}

export const StudentControllers = {
    createStudent,
    getAllStudens,
    getSingleStudent
}

