import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { TLoginUser } from "./auth.interface";
import config from "../../config";
import bcrypt from 'bcrypt';
import { createToken, verifyToken } from "./auth.utils";
import { JwtPayload } from "jsonwebtoken";
import jwt from 'jsonwebtoken';
import { sendEmail } from "../../utils/sendEmail";

const loginUser = async (payload: TLoginUser) => {
    // checking if the user is exists
    const user = await User.isUserExistsByCustomId(payload?.id)
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'This User is Not Found!');
    }

    // checking if the user is already Deleted
    if (user?.isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, 'This User is Deleted!');
    }

    // checking if the user is blocked
    if (user?.status === 'blocked') {
        throw new AppError(httpStatus.FORBIDDEN, 'This User is Blocked!');
    }

    // checking if the password is correct
    if (!await User.isPasswordMatched(payload?.password, user?.password)) {
        throw new AppError(httpStatus.FORBIDDEN, 'Password do not Matched!');
    }

    // Access Granted: Send AccessToken, RefreshToken
    // Create token and send to the client
    const jwtPayload = {
        userId: user?.id,
        role: user?.role
    }

    const accessToken = createToken(jwtPayload, config.jwt_access_secret as string, config.jwt_access_expires_in as string);

    const refreshToken = createToken(jwtPayload, config.jwt_refresh_secret as string, config.jwt_refresh_expires_in as string)

    return {
        accessToken,
        refreshToken,
        needsPasswordChange: user?.needsPasswordChange
    }
}

const changePassword = async (userData: JwtPayload, payload: { oldPassword: string, newPassword: string }) => {
    // checking if the user is exists
    const user = await User.isUserExistsByCustomId(userData?.userId)
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'This User is Not Found!');
    }

    // checking if the user is already Deleted
    if (user?.isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, 'This User is Deleted!');
    }

    // checking if the user is blocked
    if (user?.status === 'blocked') {
        throw new AppError(httpStatus.FORBIDDEN, 'This User is Blocked!');
    }

    // checking if the password is correct or matched
    if (!await User.isPasswordMatched(payload?.oldPassword, user?.password)) {
        throw new AppError(httpStatus.FORBIDDEN, 'Password do not Matched!');
    }

    // hash new password
    const newHashedPassowrd = await bcrypt.hash(payload?.newPassword, Number(config.bcrypt_salt_rounds));

    await User.findOneAndUpdate(
        {
            id: userData.userId,
            role: userData.role
        },
        {
            password: newHashedPassowrd,
            needsPasswordChange: false,
            passwordChangedAt: new Date()
        },
        { new: true, runValidators: true }
    );

    return null;
}

const refreshToken = async (token: string) => {
    // check if the veryfi token is valid
    const decoded = verifyToken(token, config.jwt_refresh_secret as string);

    const { userId, iat } = decoded;

    // checking if the user is exists
    const user = await User.isUserExistsByCustomId(userId);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'This User is Not Found!');
    }

    // checking if the user is already Deleted
    if (user?.isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, 'This User is Deleted!');
    }

    // checking if the user is blocked
    if (user?.status === 'blocked') {
        throw new AppError(httpStatus.FORBIDDEN, 'This User is Blocked!');
    }

    if (user.passwordChangedAt && User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'You are not Authorized!');
    }

    const jwtPayload = {
        userId: user?.id,
        role: user?.role
    }

    const accessToken = createToken(jwtPayload, config.jwt_access_secret as string, config.jwt_access_expires_in as string);

    return {
        accessToken
    }
}

const forgetPassword = async (userId: string) => {
    // checking if the user is exists
    const user = await User.isUserExistsByCustomId(userId);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'This User is Not Found!');
    }

    // checking if the user is already Deleted
    if (user?.isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, 'This User is Deleted!');
    }

    // checking if the user is blocked
    if (user?.status === 'blocked') {
        throw new AppError(httpStatus.FORBIDDEN, 'This User is Blocked!');
    }

    // access token
    const jwtPayload = {
        userId: user.id,
        role: user.role
    }

    const resetToken = createToken(jwtPayload, config.jwt_access_secret as string, '10m');

    const resetUiLink = `${config.reset_password_ui_link}?id=${user?.id}&token=${resetToken}`;

    sendEmail(user.email, resetUiLink);
}

const resetPassword = async (payload: { id: string, newPassword: string }, token: string) => {
    // checking if the user is exists
    const user = await User.isUserExistsByCustomId(payload.id);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'This User is Not Found!');
    }

    // checking if the user is already Deleted
    if (user?.isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, 'This User is Deleted!');
    }

    // checking if the user is blocked
    if (user?.status === 'blocked') {
        throw new AppError(httpStatus.FORBIDDEN, 'This User is Blocked!');
    }

    // veryfi access token
    const decoded = jwt.verify(token, config.jwt_access_secret as string) as JwtPayload;

    if (payload.id !== decoded.userId) {
        throw new AppError(httpStatus.FORBIDDEN, 'You are Forbidden!');
    }

    const newHashedPassword = await bcrypt.hash(payload.newPassword, Number(config.bcrypt_salt_rounds));
    await User.findOneAndUpdate(
        {
            id: decoded.userId,
            role: decoded.role
        },
        {
            password: newHashedPassword,
            needsPasswordChange: false,
            passwordChangedAt: new Date()
        }
    );
}

export const AuthServices = {
    loginUser,
    changePassword,
    refreshToken,
    forgetPassword,
    resetPassword
}