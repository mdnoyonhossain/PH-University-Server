"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line no-unused-vars
const globalErrorHander = (err, req, res, next) => {
    const statusCode = 500;
    const message = err.message || 'Something went wrong!';
    return res.status(statusCode).json({
        success: false,
        message,
        error: err
    });
};
exports.default = globalErrorHander;
