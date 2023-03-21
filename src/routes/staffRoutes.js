import express from 'express';
import StaffModel from "../models/StaffModel.js";
import advancedResults from "../middlewares/advancedResults.js";
import { authenticate, authorize } from "../middlewares/auth-middleware.js";

import {
    getStaff,
    getSingleStaff,
    createStaff,
    updateStaff,
    deleteStaff
} from '../controllers/staffController.js';

// Including other resources
// import authRoutes from "./authRoutes.js";

const router = express.Router({ mergeParams: true });

// Re-route into other resource routers
// router.use("/auth", authRoutes);


router.get('/', advancedResults(StaffModel), getStaff);
router.post('/', authenticate, authorize('admin'), createStaff);
router.get('/:id', authenticate, getSingleStaff);
router.put('/:id', authenticate, authorize('admin'), updateStaff);
router.delete('/:id', authenticate, authorize('admin'), deleteStaff);

export default router;