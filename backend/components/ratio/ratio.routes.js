import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { getRatios, getRatio, createRatio, deleteRatio, updateRatio} from './ratio.controller.js';
import authMiddleware from '../../middleware/auth.js'

const router = Router();

//protected routes

router.get("/",expressAsyncHandler(getRatios));

router.get("/:id", expressAsyncHandler(getRatio));

router.post("/", expressAsyncHandler(createRatio));

router.delete("/:id", authMiddleware,expressAsyncHandler(deleteRatio));

router.put("/:id", expressAsyncHandler(updateRatio));

export default router;