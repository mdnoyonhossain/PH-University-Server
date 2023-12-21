"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createToken = (jwtPayload, secrete, expiresIn) => {
    return jsonwebtoken_1.default.sign(jwtPayload, secrete, { expiresIn });
};
exports.createToken = createToken;
const verifyToken = (token, secrete) => {
    return jsonwebtoken_1.default.verify(token, secrete);
};
exports.verifyToken = verifyToken;
