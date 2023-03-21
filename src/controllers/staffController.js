import Staff from '../models/StaffModel.js';
import ErrorResponse from "../helpers/ErrorResponse.js";
import asyncHandler from "../middlewares/async.js";

//@description: Get All Staff
//@return: json object of Staff
//@route:   GET /api/v1/staff
//@access: Private
export const getStaff = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults)
});



//@description: Get Single Staff
//@return:  object of Staff
//@route:   GET /api/v1/staff/:id
//@access:  Private
export const getSingleStaff = asyncHandler(async (req, res, next) => {
    const staff = await Staff.findById(req.params.id);

    if (!staff) {
        return next(new ErrorResponse("Staff not found", 404));
    }

    res.status(200).send({ success: true, data: staff });
});


//@description: Create new Staff
//@return:  object of Staff
//@route:   POST /api/v1/staff
//@access:  Private
export const createStaff = asyncHandler(async (req, res, next) => {
    await Staff.init();
    const staff = await Staff.create(req.body);

    res.status(201).json({ success: true, data: staff });
});



//@description: Update Staff
//@return:  object of Staff
//@route:   PUT /api/v1/staff/:id
//@access:  Private
export const updateStaff = asyncHandler(async (req, res, next) => {
    const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!staff) {
        return next(new ErrorResponse("Staff not found", 404));
    }
    return res.status(200).send({ success: true, data: staff });
});



//@description: Delete Staff
//@return:  empty object
//@route:   DELETE /api/v1/staff/:id
//@access:  Private
export const deleteStaff = asyncHandler(async (req, res, next) => {
    const staff = await Staff.findById(req.params.id);

    if (!staff) {
        return next(new ErrorResponse("Staff not found", 404));
    }

    staff.remove();

    return res.send({ success: true, data: {} });
});