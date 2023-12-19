import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import config from "../../config";

const loginUser = catchAsync(async (req, res) => {
    const loginUser = req.body;
    const result = await AuthServices.loginUser(loginUser);
    const { accessToken, refreshToken, needsPasswordChange } = result;

    // set Cookie
    res.cookie('refreshToken', refreshToken, {
        secure: config.NODE_ENV === 'production',
        httpOnly: true
    })

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User is logged in Successfully',
        data: {
            accessToken,
            needsPasswordChange
        }
    })
});

const changePassword = catchAsync(async (req, res) => {
    const user = req.user;
    const { ...passwordData } = req.body;
    const result = await AuthServices.changePassword(user, passwordData);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Password is Updated Successfully',
        data: result
    })
});

const refreshToken = catchAsync(async (req, res) => {
    const { refreshToken } = req.cookies;
    const result = await AuthServices.refreshToken(refreshToken);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Access Token is Retived Successfully',
        data: result
    })
});

export const AuthControllers = {
    loginUser,
    changePassword,
    refreshToken
}