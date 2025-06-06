import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { getUsers, getUser, createUser, deleteUser, updateUser, loginUser, logoutUser } from './user.controller.js';
import authMiddleware from '../../middleware/auth.js'

const router = Router();

router.post("/login",expressAsyncHandler(loginUser));

router.post("/", expressAsyncHandler(createUser));

//protected routes

router.get("/logout/:id", authMiddleware,expressAsyncHandler(logoutUser));

router.get("/", authMiddleware, expressAsyncHandler(getUsers));

router.get("/:id", authMiddleware, expressAsyncHandler(getUser));

router.delete("/:id", authMiddleware,expressAsyncHandler(deleteUser));

router.put("/:id", authMiddleware, expressAsyncHandler(updateUser));

export default router;