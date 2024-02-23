import { Request, Response, NextFunction } from 'express';

export const handleNotFound = (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ success: false, message: 'Route not found' });
};

export const handleJsonSyntaxError = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof SyntaxError && 'body' in err) {
        // JSON syntax error detected
        console.error("JSON Syntax Error:", err);
        return res.status(400).json({ success: false, error: 'JSON Syntax Errors', message: 'Invalid JSON format in request body' });
    }
    next(err); // Pass the error to the next error handler
};

export const handleServerError = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Internal Server Error:", err);
    res.status(500).json({ success: false, error: 'Internal Server Error', message: 'An unexpected error occurred on the server.' });
};

export const handleUserExistsError = (req: Request, res: Response, next: NextFunction) => {
    res.status(400).json({ success: false, message: 'User already exists!' });
};

export const handleUserDataNotExistsError = (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ success: false, message: 'User data not available!' });
};

export const handleUserNotFoundError = (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ success: false, message: 'User ID not found!' });
};

export const handleInvalidFieldsError = (req: Request, res: Response, next: NextFunction, extraFields: string[]) => {
    const invalidFields = extraFields.join(', ');
    res.status(400).json({ success: false, message: `Invalid field(s): ${invalidFields}` });
};