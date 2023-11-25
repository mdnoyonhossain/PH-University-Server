import { NextFunction, Request, Response } from "express";
import { StudentServices } from "./student.service";

const getAllStudens = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await StudentServices.getAllStudentFromDB();

        res.status(200).json({
            success: true,
            message: 'Student are Retrived Successfully',
            data: result
        })
    } catch (err) {
        next(err);
    }
}

const getSingleStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { studentId } = req.params;
        const result = await StudentServices.getSingleStudentFromDB(studentId);

        res.status(200).json({
            success: true,
            message: 'Student are Specfic Student Successfully',
            data: result
        })
    } catch (err) {
        next(err);
    }
}

const deleteStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { studentId } = req.params;
        const result = await StudentServices.deleteStudentFromDB(studentId)

        res.status(200).json({
            success: true,
            message: 'Student Delete Successfully',
            data: result
        })
    } catch (err) {
        next(err)
    }
}

export const StudentControllers = {
    getAllStudens,
    getSingleStudent,
    deleteStudent
}

