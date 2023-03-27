import CartModel from "../models/CartModel.js";
import UserModel from "../models/UserModel.js";
import ProductModel from "../models/ProductModel.js";
import ErrorResponse from "../helpers/ErrorResponse.js";
import asyncHandler from "../middlewares/async.js";


//@description: Get all Carts
//@return: Array of Carts
//@route:   GET /api/v1/carts
//@access: Public
export const getCarts = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});


//@description: Get single Cart
//@return: object of a cart
//@route:   GET /api/v1/carts/:id
//@access: Public
export const getCart = asyncHandler(async (req, res, next) => {
    const carts = await CartModel.findById(req.params.id);

    if (!carts) {
        return next(new ErrorResponse("Cart not found", 404));
    }
    return res.status(200).send({ success: true, data: carts });
});


//@description: Add Product To Cart
//@return:  Cart Object
//@route:   PUT /api/v1/users/:userId/carts/add-to-cart
//@access:  Private
export const addToCart = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    const { productId, quantity } = req.body;

    const user = await UserModel.findById(userId);

    // Check if user exists
    if (!user) {
        return next(new ErrorResponse("User not found", 404));
    }

    // Check if product exists
    const product = await ProductModel.findById(productId);
    if (!product) {
        return next(new ErrorResponse("Product not found", 404));
    }

    // Check if user has active cart
    let userCart = await CartModel.findOne({ user: userId });

    // If user has no active cart, create one
    if (!userCart) {
        userCart = await CartModel.create({ user: { ...user } });
    }

    const cart = await userCart.addProduct(product, quantity)

    res.status(201).json({ success: true, count: cart.products.length, data: cart });
});


//@description: Remove Product From Cart
//@return:  Cart Object
//@route:   PUT /api/v1/users/:userId/carts/remove-from-cart
//@access:  Private
export const removeFromCart = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    const { productId, quantity } = req.body;

    const user = await UserModel.findById(userId);

    // Check if user exists
    if (!user) {
        return next(new ErrorResponse("User not found", 404));
    }

    // Check if product exists
    const product = await ProductModel.findById(productId);
    if (!product) {
        return next(new ErrorResponse("Product not found", 404));
    }

    // Check if user has active cart
    let userCart = await CartModel.findOne({ user: userId });

    // If user has no active cart, return error
    if (!userCart) {
        return next(new ErrorResponse("Cart not found", 404));
    }

    const cart = await userCart.removeProduct(productId, quantity)

    res.status(201).json({ success: true, count: cart.products.length, data: cart });

});


//@description: Checkout products in cart
//@return:  null
//@route:   POST /api/v1/Carts/checkout
//@access:  Private
export const checkOutCart = asyncHandler(async (req, res, next) => {

})