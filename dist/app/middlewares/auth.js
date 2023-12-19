"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const user_model_1 = require("../modules/user/user.model");
const auth = (...requiredRoles) => {
    return (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const token = req.headers.authorization;
        // if the token is sent from the client
        if (!token) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not Authorized!');
        }
        // check if the veryfi token is valid
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
        const { userId, role, iat } = decoded;
        // checking if the user is exists
        const user = yield user_model_1.User.isUserExistsByCustomId(userId);
        if (!user) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'This User is Not Found!');
        }
        // checking if the user is already Deleted
        if (user === null || user === void 0 ? void 0 : user.isDeleted) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'This User is Deleted!');
        }
        // checking if the user is blocked
        if ((user === null || user === void 0 ? void 0 : user.status) === 'blocked') {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'This User is Blocked!');
        }
        if (user.passwordChangedAt && user_model_1.User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat)) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not Authorized!');
        }
        if (requiredRoles && !requiredRoles.includes(role)) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not Authorized!');
        }
        req.user = decoded;
        next();
    }));
};
exports.default = auth;
