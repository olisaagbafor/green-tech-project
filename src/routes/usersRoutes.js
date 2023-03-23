import express from 'express';
import UserModel from "../models/UserModel.js";
import advancedResults from "../middlewares/advancedResults.js";
import { authenticate, authorize } from "../middlewares/auth-middleware.js";

import {
    getUsers,
    getSingleUser,
    createUser,
    updateUser,
    deleteUser
} from '../controllers/usersController.js';

const router = express.Router();

router.get('/', authenticate, authorize('admin'), advancedResults(UserModel), getUsers);
router.post('/', authenticate, authorize('admin'), createUser);
router.get('/:id', authenticate, authorize('admin'), getSingleUser);
router.put('/:id', authenticate, authorize('admin'), updateUser);
router.delete('/:id', authenticate, authorize('admin'), deleteUser);

export default router;