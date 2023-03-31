import UserModel from '../models/UserModel.js';
import ErrorResponse from "../helpers/ErrorResponse.js";
import asyncHandler from "../middlewares/async.js";

//@description: Get All User
//@return: json object of User
//@route:   GET /api/v1/User
//@access: Private
export const getUsers = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults)
});



//@description: Get Single User
//@return:  object of User
//@route:   GET /api/v1/User/:id
//@access:  Private
export const getSingleUser = asyncHandler(async (req, res, next) => {
    const user = await UserModel.findById(req.params.id);

    if (!user) {
        return next(new ErrorResponse("User not found", 404));
    }

    res.status(200).send({ success: true, data: user });
});


//@description: Create new User
//@return:  object of User
//@route:   POST /api/v1/User
//@access:  Private
export const createUser = asyncHandler(async (req, res, next) => {
    await UserModel.init();
    const user = await UserModel.create(req.body);

    res.status(201).json({ success: true, data: user });
});



//@description: Update User
//@return:  object of User
//@route:   PUT /api/v1/User/:id
//@access:  Private
export const updateUser = asyncHandler(async (req, res, next) => {
    const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!user) {
        return next(new ErrorResponse("User not found", 404));
    }
    return res.status(200).send({ success: true, data: user });
});



//@description: Update User
//@return:  object of User
//@route:   PUT /api/v1/User/:id/top-up
//@access:  Private
export const topUpUser = asyncHandler(async (req, res, next) => {
    const { amount } = req.body
    console.log(amount);
    const user = await UserModel.findByIdAndUpdate(req.params.id, { $inc: { balance: amount } }, {
        new: true,
        runValidators: true
    });

    if (!user) {
        return next(new ErrorResponse("User not found", 404));
    }
    return res.status(200).send({ success: true, data: user });
});



//@description: Delete User
//@return:  empty object
//@route:   DELETE /api/v1/User/:id
//@access:  Private
export const deleteUser = asyncHandler(async (req, res, next) => {
    const user = await UserModel.findById(req.params.id);

    if (!user) {
        return next(new ErrorResponse("User not found", 404));
    }

    user.remove();

    return res.send({ success: true, data: {} });
});