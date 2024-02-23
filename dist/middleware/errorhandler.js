"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleInvalidFieldsError = exports.handleUserNotFoundError = exports.handleUserExistsError = exports.handleServerError = exports.handleJsonSyntaxError = exports.handleNotFound = void 0;
const handleNotFound = (req, res, next) => {
    res.status(404).json({ success: false, message: 'Route not found' });
};
exports.handleNotFound = handleNotFound;
const handleJsonSyntaxError = (err, req, res, next) => {
    if (err instanceof SyntaxError && 'body' in err) {
        // JSON syntax error detected
        console.error("JSON Syntax Error:", err);
        return res.status(400).json({ success: false, error: 'JSON Syntax Errors', message: 'Invalid JSON format in request body' });
    }
    next(err); // Pass the error to the next error handler
};
exports.handleJsonSyntaxError = handleJsonSyntaxError;
const handleServerError = (err, req, res, next) => {
    console.error("Internal Server Error:", err);
    res.status(500).json({ success: false, error: 'Internal Server Error', message: 'An unexpected error occurred on the server.' });
};
exports.handleServerError = handleServerError;
const handleUserExistsError = (req, res, next) => {
    res.status(400).json({ success: false, message: 'User already exists!' });
};
exports.handleUserExistsError = handleUserExistsError;
const handleUserNotFoundError = (req, res, next) => {
    res.status(404).json({ success: false, message: 'User ID not found!' });
};
exports.handleUserNotFoundError = handleUserNotFoundError;
const handleInvalidFieldsError = (req, res, next, extraFields) => {
    const invalidFields = extraFields.join(', ');
    res.status(400).json({ success: false, message: `Invalid field(s): ${invalidFields}` });
};
exports.handleInvalidFieldsError = handleInvalidFieldsError;
