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

// other resources routes
import cartsRoutes from './cartsRoutes.js';

const router = express.Router({ mergeParams: true });

router.get('/', authenticate, authorize('admin'), advancedResults(UserModel), getUsers);
router.post('/', authenticate, authorize('admin'), createUser);
router.get('/:id', authenticate, authorize('admin'), getSingleUser);
router.put('/:id', authenticate, authorize('admin'), updateUser);
router.delete('/:id', authenticate, authorize('admin'), deleteUser);

// Re-route into other resource routers
router.use('/:userId/carts', cartsRoutes);

export default router;