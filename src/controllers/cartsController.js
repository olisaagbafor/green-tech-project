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
//@route:   GET /api/v1/users/:userId/carts/me
//@access: Public
export const getCart = asyncHandler(async (req, res, next) => {
    if (req.params.userId) {
        const { userId } = req.params
        const user = await UserModel.findById(userId);

        if (!user) {
            return next(new ErrorResponse("User not found", 404));
        }

        let cart = await CartModel.findOne({ user: userId })
            .populate('products._id')
            .populate('user')

        // If user has no active cart, create one
        if (!cart) {
            cart = await CartModel.create({ user: { ...user } });
        }

        return res.status(200).json({ success: true, data: cart });
    }

    const cart = await CartModel.findById(req.params.id)
        .populate('products._id')
        .populate('user');

    if (!cart) {
        return next(new ErrorResponse("Cart not found", 404));
    }
    return res.status(200).send({ success: true, data: cart });
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
//@route:   GET /api/v1/users/:userId/carts/checkout
//@access:  Private
export const checkOut = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;

    // Check if user has active cart
    let userCart = await CartModel.findOne({ user: userId })
        .populate('products._id')
        .populate('user');

    // If user has no active cart, return error
    if (!userCart) {
        return next(new ErrorResponse("Cart not found", 404));
    }

    // Check if cart has products
    if (userCart.products.length === 0) {
        return next(new ErrorResponse("Cart is empty", 404));
    }

    // Get the Products current info
    // const cartProducts = await CartModel.find({ user: userId }).populate("products._id");
    // const products = await ProductModel.find({ _id: { $in: 'userCart.products.$.product._id' } });

    const productIds = userCart.products.map(product => {
        return product._id
    })

    const products = await ProductModel.find({ _id: { $in: productIds } });

    const cart = userCart.checkOut(products);

    return res.status(200).json({ success: true, data: cart });
})