import { Request, Response } from "express";
import { StudentServices } from "./student.service";
import studentValidatoinSchema from "./student.validaton.schema";

const createStudent = async (req: Request, res: Response) => {
    try {
        const { student: studentData } = req.body;
        // zod validation using
        const zodParseData = studentValidatoinSchema.parse(studentData);
        const result = await StudentServices.createStudentIntoDB(zodParseData);

        res.status(200).json({
            success: true,
            message: 'Student create Successfully',
            data: result
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Something went wrong!",
            error: err
        })
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

