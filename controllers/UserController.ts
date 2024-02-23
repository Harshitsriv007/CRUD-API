import { Request,Response,NextFunction } from "express";
import { CreateUserInput,EditUserInput } from "../dto";
import { User } from "../models";
import { Error as MongooseError } from 'mongoose';
import { handleUserExistsError, handleUserNotFoundError, handleInvalidFieldsError } from '../middleware/errorhandler';
import logger from '../service/logger';




export const Finduser = async (id: string | undefined, username?: string, count?: string): Promise<Document | number | null> => 
{
    if (username) {
        // Use guard clause to handle specific condition first
        return await User.findOne({ username: username });
    } else if (count) {
        // Use ternary operator for concise conditional expression
        return await User.countDocuments({ username: count }); // Assuming you want to count documents based on the username
    } else {
        // Default case, handle if none of the above conditions are met
        return await User.findById(id);
    }
}

export const CreateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, age, hobbies } = <CreateUserInput>req.body;
        //Check if any extra fields are present in the request body
        const extraFields = Object.keys(req.body).filter(key => !['username', 'age', 'hobbies'].includes(key));

        if (extraFields.length > 0) {
            const invalidFields = extraFields.join(', ');
            const errorMessage = `Invalid field(s): ${invalidFields}`;
            return res.status(400).json({ error: 'INVALID_FIELDS', message: errorMessage });
        }
        
        // Check if user with the same username already exists
        const existingUser = await Finduser('', username);

        if (existingUser !== null) {
            return res.status(400).json({ error: "A user with this username already exists" });
        }

        // Create a new user
        const newUser = await User.create({
            username: username,
            age: age,
            hobbies: hobbies
        });

        return res.status(201).json(newUser);
    }catch (error: any) {
        console.error("Error creating user:", error);
    
        // Parse the error and define error codes based on the type of error
        let statusCode = 500;
        let errorCode = "UNKNOWN_ERROR";
        let errorMessage = "An unexpected error occurred.";
    
        if (error instanceof MongooseError.ValidationError) {
            // Validation error from Mongoose
            statusCode = 400;
            errorCode = "VALIDATION_ERROR";
            errorMessage = "Validation failed. Please check your input data.";
        } else if (error.name === 'CastError') {
            // Cast error from Mongoose
            statusCode = 400;
            errorCode = "CAST_ERROR";
            errorMessage = "Invalid data type. Please provide valid input data.";
        }
    
        return res.status(statusCode).json({ success: false, error: errorCode, message: errorMessage });
    }
}


export const GetUser = async (req:Request,res:Response,next:NextFunction)=>{
    
    const Getuser = await User.find();
    
    if(Getuser !== null)
    {
        return res.json([{success:true,data:Getuser}]);
    }
    return res.json([{success:false,message:"User data Not Available"}]);
}

export const GetUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const Getuser = await Finduser(id);
        
        if (Getuser !== null) {
            return res.json({ success: true, data: Getuser });
        }
        return res.json({ success: false, message: "User data not available" });
    } catch (error: any) {
        console.error("Error fetching user by ID:", error);
        
        let statusCode = 500;
        let errorCode = "UNKNOWN_ERROR";
        let errorMessage = "An unexpected error occurred.";

        // Customize error handling based on the function name
        if (error instanceof MongooseError.ValidationError) {
            // Validation error from Mongoose
            statusCode = 400;
            errorCode = "VALIDATION_ERROR";
            errorMessage = "Validation failed. Please check your input data.";
        } else if (error.name === 'CastError') {
            // Cast error from Mongoose
            statusCode = 400;
            errorCode = "CAST_ERROR";
            errorMessage = "Invalid data type. Please provide valid input data.";
        }

        return res.status(statusCode).json({ success: false, error: errorCode, message: errorMessage });
    }
}

export const UpdateUserById = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const { username } = <EditUserInput>req.body;
    const updateData = <EditUserInput>req.body;

    try {
        const getUserById = await Finduser(id);
        const getUsernameCount = await Finduser('', '', username);

        if (typeof getUsernameCount === 'number' && getUsernameCount > 0) {
            const result = handleUserExistsError(req, res, next);
            logger.error("Error Msg"); // Log the error using the logger
            return result;
        }

        if (!getUserById) {
            const result =handleUserNotFoundError(req, res, next);
            logger.error("Error Msg");
            return result;
        }

        //Check if any extra fields are present in the request body
        const extraFields = Object.keys(req.body).filter(key => !['username', 'age', 'hobbies'].includes(key));

        if (extraFields.length > 0) {
            const result =handleUserNotFoundError(req, res, next);
            logger.error("Error Msg"); // Log the error using the logger
            return result;
        }

        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
        return res.status(200).json({ success: true, message: "User updated successfully!", data: updatedUser });
    } catch (error:any) {
        logger.error(error.message); // Log the error using the logger
        next(error); // Pass the error to the next middleware
    }
}


export const DeleteUserById = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    try {
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        return res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting user:", error);

        let statusCode = 500;
        let errorCode = "UNKNOWN_ERROR";
        let errorMessage = "An unexpected error occurred.";

        // Define error codes and messages specific to DeleteUserById function
        const errorMessages: Record<string, string> = {
            "ValidationError": "Validation failed. Please check your input data.",
            "CastError": "Invalid data type. Please provide valid input data."
        };

        // Set error code and message based on error type
        const errorType = error instanceof MongooseError.ValidationError ? "ValidationError" :
            error.name === 'CastError' ? "CastError" : null;

        if (errorType && errorMessages[errorType]) {
            errorCode = errorType.toUpperCase();
            errorMessage = errorMessages[errorType];
            statusCode = 400; // Assuming client error for these types of errors
        }

        return res.status(statusCode).json({ success: false, error: errorCode, message: errorMessage });
    }
}
