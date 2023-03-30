import path from "path";
import Product from "../models/ProductModel.js";
import ErrorResponse from "../helpers/ErrorResponse.js";
import asyncHandler from "../middlewares/async.js";


//@description: Get all Products
//@return: Array of products
//@route:   GET /api/v1/products
//@access: Public
export const getProducts = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});


//@description: Get single Product
//@return: object of product
//@route:   GET /api/v1/product/:id
//@access: Public
export const getProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorResponse("Product not found", 404));
    }
    return res.status(200).send({ success: true, data: product });
});


//@description: Create New Product
//@return:  new product
//@route:   POST /api/v1/products
//@access:  Private
export const createProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.create(req.body);

    res.status(201).json({ success: true, data: product });
});


//@description: Update single Product
//@return:  product
//@route:   PUT /api/v1/products/:id
//@access:  private
export const updateProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!product) {
        return next(new ErrorResponse("Product not found", 404));
    }
    return res.status(200).send({ success: true, data: product });
});


//@description: Delete single product
//@return:  null
//@route:   DELETE /api/v1/products/:id
//@access:  Private
export const deleteProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorResponse("Product not found", 404));
    }
    product.remove();

    return res.send({ success: true, data: {} });
})


//@description: Upload photo for product
//@return:  product
//@route:   PUT /api/v1/products/:id/photo
//@access:  Private
export const productPhotoUpload = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorResponse("Product not found", 404));
    }

    if (!req.files) {
        return next(new ErrorResponse("Please upload a file", 400));
    }

    const file = req.files.image;

    // Make sure the image is a photo
    if (!file.mimetype.startsWith("image")) {
        return next(new ErrorResponse("Please upload an image file", 400));
    }

    // Check filesize
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400));
    }

    // Create custom filename
    file.name = `photo_${product._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
            console.error(err);
            return next(new ErrorResponse("Problem with file upload", 500));
        }

        await Product.findByIdAndUpdate(req.params.id, { image: file.name });

        res.status(200).json({
            success: true,
            data: file.name
        });
    });
});