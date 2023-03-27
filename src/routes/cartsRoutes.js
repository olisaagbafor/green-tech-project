import express from 'express';
import CartModel from "../models/CartModel.js";
import advancedResults from "../middlewares/advancedResults.js";
import { authenticate, authorize } from "../middlewares/auth-middleware.js";

import {
    getCarts,
    getCart,
    addToCart,
    removeFromCart
} from '../controllers/cartsController.js';


const router = express.Router({ mergeParams: true });

router.get('/', authenticate, authorize('admin'), advancedResults(CartModel), getCarts);
router.get('/:id', authenticate, getCart);
router.put('/add-to-cart', authenticate, addToCart);
router.put('/remove-from-cart', authenticate, removeFromCart);


export default router;