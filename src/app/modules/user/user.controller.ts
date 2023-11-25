import { NextFunction, Request, Response } from "express";
import { UserService } from "./user.service";

const createStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { password, student: studentData } = req.body;
        const result = await UserService.createStudentIntoDB(password, studentData)

        res.status(200).json({
            succcess: true,
            message: 'Student is created successfullly',
            data: result
        });
    } catch (err) {
        next(err)
    }
}

export const UserController = {
    createStudent
}