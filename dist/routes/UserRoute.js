"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoute = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const router = express_1.default.Router();
exports.AdminRoute = router;
router.post('/users', controllers_1.CreateUser);
router.get('/users', controllers_1.GetUser);
router.get('/users/:id', controllers_1.GetUserById);
router.put('/users/:id', controllers_1.UpdateUserById);
router.delete('/users/:id', controllers_1.DeleteUserById);
