import express from 'express';
import ProductModel from "../models/ProductModel.js";
import advancedResults from "../middlewares/advancedResults.js";
import { authenticate, authorize } from "../middlewares/auth-middleware.js";

import {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} from '../controllers/productsController.js';

const router = express.Router();

router.get('/', advancedResults(ProductModel), getProducts)
router.post('/', authenticate, createProduct)
router.get('/:id', getProduct)
router.put('/:id', authenticate, updateProduct)
router.delete('/:id', authenticate, authorize('admin'), deleteProduct)

export default router;
