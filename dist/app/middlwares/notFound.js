"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
const notFound = (req, res, next) => {
    res.status().json({
        success: false,
        message: 'API Not Found!',
        error: ''
    });
};
