import { Response } from "express";

type TSucessResponse<T> = {
    statusCode: number;
    success: boolean;
    message: string;
    data: T
}

const sendResponse = <T>(res: Response, data: TSucessResponse<T>) => {
    res.status(data.statusCode).json({
        sucess: data.success,
        message: data.message,
        data: data.data
    })
}

export default sendResponse;