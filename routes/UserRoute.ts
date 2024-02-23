import express from "express";
import { CreateUser, GetUser, GetUserById, UpdateUserById,DeleteUserById } from "../controllers";


const router = express.Router();

router.post('/users',CreateUser);
router.get('/users',GetUser);
router.get('/users/:id',GetUserById);
router.put('/users/:id',UpdateUserById);
router.delete('/users/:id',DeleteUserById);





export {router as AdminRoute };