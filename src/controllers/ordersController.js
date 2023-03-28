import OrderModel from "../models/OrderModel.js";
import UserModel from "../models/UserModel.js";
import ProductModel from "../models/ProductModel.js";
import ErrorResponse from "../helpers/ErrorResponse.js";
import asyncHandler from "../middlewares/async.js";


//@description: Get all Orders
//@return: Array of Orders
//@route:   GET /api/v1/orders
//@access: Public
export const getOrders = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});


//@description: Get single Order
//@return: object of a order
//@route:   GET /api/v1/orders/:id
//@access: Public
export const getOrder = asyncHandler(async (req, res, next) => {
    const orders = await OrderModel.findById(req.params.id);

    if (!orders) {
        return next(new ErrorResponse("Order not found", 404));
    }
    return res.status(200).send({ success: true, data: orders });
});


//@description: Add Product To Order
//@return:  Order Object
//@route:   PUT /api/v1/orders/:orderId/process-payment
//@access:  Private
export const processPayment = asyncHandler(async (req, res, next) => {

    const order = await OrderModel.findById(req.params.id);

    if (!order) {
        return next(new ErrorResponse("Order not found", 404));
    }

    if (order.isPaid) {
        return next(new ErrorResponse("Order already completed", 400));
    }

    const user = await UserModel.findById(order.user);

    if (!user) {
        return next(new ErrorResponse("User not found", 404));
    }

    // Check if user has enough money
    if (user.balance < order.totalAmount) {
        return next(new ErrorResponse("Insufficient funds", 400));
    }

    // Process payment
    user.balance -= order.totalAmount;
    await user.save();

    // Mark order as paid
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentStatus = "completed"
    await order.save();

    res.status(201).json({ success: true, data: order });
});