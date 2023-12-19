import { NextFunction, Request, Response } from "express"
import catchAsync from "../utils/catchAsync"
import AppError from "../errors/AppError";
import httpStatus from "http-status";
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from "../config";
import { TUserRole } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";

const auth = (...requiredRoles: TUserRole[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization;

        // if the token is sent from the client
        if (!token) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'You are not Authorized!');
        }

        // check if the veryfi token is valid
        const decoded = jwt.verify(token, config.jwt_access_secret as string) as JwtPayload;

        const { userId, role, iat } = decoded;

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

        if (requiredRoles && !requiredRoles.includes(role)) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'You are not Authorized!');
        }

        req.user = decoded as JwtPayload;
        next();
    })
}

export default auth;