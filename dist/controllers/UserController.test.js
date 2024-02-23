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
Object.defineProperty(exports, "__esModule", { value: true });
const UserController_1 = require("./UserController");
describe('CreateUser', () => {
    it('should return a new user object when valid input is provided', () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock request and response objects
        const req = { body: { username: 'testuser', age: 25, hobbies: ['reading', 'coding'] } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn() // Mock the json method
        };
        const next = jest.fn();
        // Call the CreateUser controller function
        yield (0, UserController_1.CreateUser)(req, res, next);
        // Perform assertions on the response
        expect(res.status).toHaveBeenCalledWith(201); // Assuming 201 status code for successful user creation
        expect(res.json).toHaveBeenCalledWith( /* Add expected response object here */); // Provide expected response object
    }));
});
