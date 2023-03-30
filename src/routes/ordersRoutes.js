import express from 'express';
import OrderModel from "../models/OrderModel.js";
import advancedResults from "../middlewares/advancedResults.js";
import { authenticate, authorize } from "../middlewares/auth-middleware.js";

import {
    getOrders,
    getOrder,
    processPayment
} from '../controllers/ordersController.js';


const router = express.Router({ mergeParams: true });

router.get('/', authenticate, advancedResults(OrderModel, ['products._id', 'user']), getOrders);
router.get('/:id', authenticate, getOrder);
router.put('/:id/process-payment', processPayment);


export default router;