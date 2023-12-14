"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleDuplicateError = (err) => {
    const statusCode = 400;
    const match = err.message.match(/"([^"]*)"/);
    const extractedMessage = match && match[1];
    const errorSources = [
        {
            path: '',
            message: `${extractedMessage} is already exists!`
        }
    ];
    return {
        statusCode,
        message: 'Duplicate Error',
        errorSources
    };
};
exports.default = handleDuplicateError;
