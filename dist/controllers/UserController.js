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
exports.DeleteUserById = exports.UpdateUserById = exports.GetUserById = exports.GetUser = exports.CreateUser = exports.Finduser = void 0;
const models_1 = require("../models");
const mongoose_1 = require("mongoose");
const errorhandler_1 = require("../middleware/errorhandler");
const logger_1 = __importDefault(require("../service/logger"));
const Finduser = (id, username, count) => __awaiter(void 0, void 0, void 0, function* () {
    if (username) {
        // Use guard clause to handle specific condition first
        return yield models_1.User.findOne({ username: username });
    }
    else if (count) {
        // Use ternary operator for concise conditional expression
        return yield models_1.User.countDocuments({ username: count }); // Assuming you want to count documents based on the username
    }
    else {
        // Default case, handle if none of the above conditions are met
        return yield models_1.User.findById(id);
    }
});
exports.Finduser = Finduser;
const CreateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, age, hobbies } = req.body;
        //Check if any extra fields are present in the request body
        const extraFields = Object.keys(req.body).filter(key => !['username', 'age', 'hobbies'].includes(key));
        if (extraFields.length > 0) {
            const invalidFields = extraFields.join(', ');
            const errorMessage = `Invalid field(s): ${invalidFields}`;
            return res.status(400).json({ error: 'INVALID_FIELDS', message: errorMessage });
        }
        // Check if user with the same username already exists
        const existingUser = yield (0, exports.Finduser)('', username);
        if (existingUser !== null) {
            return res.status(400).json({ error: "A user with this username already exists" });
        }
        // Create a new user
        const newUser = yield models_1.User.create({
            username: username,
            age: age,
            hobbies: hobbies
        });
        return res.status(201).json(newUser);
    }
    catch (error) {
        console.error("Error creating user:", error);
        // Parse the error and define error codes based on the type of error
        let statusCode = 500;
        let errorCode = "UNKNOWN_ERROR";
        let errorMessage = "An unexpected error occurred.";
        if (error instanceof mongoose_1.Error.ValidationError) {
            // Validation error from Mongoose
            statusCode = 400;
            errorCode = "VALIDATION_ERROR";
            errorMessage = "Validation failed. Please check your input data.";
        }
        else if (error.name === 'CastError') {
            // Cast error from Mongoose
            statusCode = 400;
            errorCode = "CAST_ERROR";
            errorMessage = "Invalid data type. Please provide valid input data.";
        }
        return res.status(statusCode).json({ success: false, error: errorCode, message: errorMessage });
    }
});
exports.CreateUser = CreateUser;
const GetUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const Getuser = yield models_1.User.find();
    if (Getuser !== null) {
        return res.json([{ success: true, data: Getuser }]);
    }
    return res.json([{ success: false, message: "User data Not Available" }]);
});
exports.GetUser = GetUser;
const GetUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const Getuser = yield (0, exports.Finduser)(id);
        if (Getuser !== null) {
            return res.json({ success: true, data: Getuser });
        }
        return res.json({ success: false, message: "User data not available" });
    }
    catch (error) {
        console.error("Error fetching user by ID:", error);
        let statusCode = 500;
        let errorCode = "UNKNOWN_ERROR";
        let errorMessage = "An unexpected error occurred.";
        // Customize error handling based on the function name
        if (error instanceof mongoose_1.Error.ValidationError) {
            // Validation error from Mongoose
            statusCode = 400;
            errorCode = "VALIDATION_ERROR";
            errorMessage = "Validation failed. Please check your input data.";
        }
        else if (error.name === 'CastError') {
            // Cast error from Mongoose
            statusCode = 400;
            errorCode = "CAST_ERROR";
            errorMessage = "Invalid data type. Please provide valid input data.";
        }
        return res.status(statusCode).json({ success: false, error: errorCode, message: errorMessage });
    }
});
exports.GetUserById = GetUserById;
const UpdateUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { username } = req.body;
    const updateData = req.body;
    try {
        const getUserById = yield (0, exports.Finduser)(id);
        const getUsernameCount = yield (0, exports.Finduser)('', '', username);
        if (typeof getUsernameCount === 'number' && getUsernameCount > 0) {
            const result = (0, errorhandler_1.handleUserExistsError)(req, res, next);
            logger_1.default.error("Error Msg"); // Log the error using the logger
            return result;
        }
        if (!getUserById) {
            const result = (0, errorhandler_1.handleUserNotFoundError)(req, res, next);
            logger_1.default.error("Error Msg");
            return result;
        }
        //Check if any extra fields are present in the request body
        const extraFields = Object.keys(req.body).filter(key => !['username', 'age', 'hobbies'].includes(key));
        if (extraFields.length > 0) {
            const result = (0, errorhandler_1.handleUserNotFoundError)(req, res, next);
            logger_1.default.error("Error Msg"); // Log the error using the logger
            return result;
        }
        const updatedUser = yield models_1.User.findByIdAndUpdate(id, updateData, { new: true });
        return res.status(200).json({ success: true, message: "User updated successfully!", data: updatedUser });
    }
    catch (error) {
        logger_1.default.error(error.message); // Log the error using the logger
        next(error); // Pass the error to the next middleware
    }
});
exports.UpdateUserById = UpdateUserById;
const DeleteUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const deletedUser = yield models_1.User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        return res.status(200).json({ success: true, message: "User deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting user:", error);
        let statusCode = 500;
        let errorCode = "UNKNOWN_ERROR";
        let errorMessage = "An unexpected error occurred.";
        // Define error codes and messages specific to DeleteUserById function
        const errorMessages = {
            "ValidationError": "Validation failed. Please check your input data.",
            "CastError": "Invalid data type. Please provide valid input data."
        };
        // Set error code and message based on error type
        const errorType = error instanceof mongoose_1.Error.ValidationError ? "ValidationError" :
            error.name === 'CastError' ? "CastError" : null;
        if (errorType && errorMessages[errorType]) {
            errorCode = errorType.toUpperCase();
            errorMessage = errorMessages[errorType];
            statusCode = 400; // Assuming client error for these types of errors
        }
        return res.status(statusCode).json({ success: false, error: errorCode, message: errorMessage });
    }
});
exports.DeleteUserById = DeleteUserById;
