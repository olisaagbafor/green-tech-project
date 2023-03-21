import crypto from "crypto";
import UserModel from "../models/UserModel.js";
import ErrorResponse from "../helpers/ErrorResponse.js";
import asyncHandler from "../middlewares/async.js";


//@description: Register taff
//@return:  JSON Web Token
//@route:   POST /api/v1/auth/register
//@access:  Public
export const register = asyncHandler(async (req, res, next) => {
    const { name, email, password, phone } = req.body;

    const user = await UserModel.create({ name, email, password, phone });

    sendTokenResponse(user, 200, res);
});



//@description: Login Staff
//@return:  JSON Web Token
//@route:   POST /api/v1/auth/login
//@access:  Public
export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
        return next(new ErrorResponse(`Please provide your email and password`, 400));
    }

    // Check Staff
    const user = await UserModel.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorResponse(`Invalid Credentials`, 401));
    }

    // Match password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponse(`Invalid Credentials`, 401));
    }

    sendTokenResponse(user, 200, res);
});



//@description: Logout Staff
//@return:  empty object
//@route:   GET /api/v1/auth/logout
//@access:  Public
export const logout = asyncHandler(async (req, res, next) => {
    res.cookie('token', 'none', { expires: new Date(Date.now() + 10 * 1000), httpOnly: true })

    res.status(200).json({ success: true, data: {} })
});


//@description: Get current logged in user
//@return:  User data
//@route:   POST /api/v1/auth/me
//@access:  Private
export const getMe = asyncHandler(async (req, res, next) => {
    const user = await UserModel.findById(req.user.id);

    res.status(200).json({ success: true, data: user });
});


//@description: Update current logged in user details
//@return:  User data
//@route:   PUT /api/v1/auth/me/update-details
//@access:  Private
export const updateDetails = asyncHandler(async (req, res, next) => {
    const fieldsToUpdate = {
        email: req.body.email,
        name: req.body.name,
        phone: req.body.phone
    }
    const user = await UserModel.findByIdAndUpdate(req.user.id, fieldsToUpdate, { new: true, runValidators: true });

    res.status(200).json({ success: true, data: user });
});



//@description: Update current password
//@return:  Response token
//@route:   PUT /api/v1/auth/me/update-password
//@access:  Private
export const updatePassword = asyncHandler(async (req, res, next) => {
    const user = await UserModel.findById(req.user.id).select('+password');

    // Check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
        return next(new ErrorResponse(`Password mismatch!`, 401));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
});



//@description: Forgot Password
//@return:  JSON Web Token
//@route:   POST /api/v1/auth/forgot-password
//@access:  Public
export const forgotPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    // Validate email
    if (!email) {
        return next(new ErrorResponse(`Please provide your email`, 400));
    }

    // Check Staff
    const user = await UserModel.findOne({ email });

    if (!user) {
        return next(new ErrorResponse(`No user with such email`, 401));
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has 
    requested the reset of a password. Please click on the link below to reset your password: \n\n${resetUrl}\n\n`;

    try {
        // await sendEmail({
        //     email: user.email,
        //     subject: 'Password reset Token',
        //     message
        // });

        return res.status(200).json({ success: true, data: { resetUrl } });
    } catch (err) {
        console.error(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorResponse('Email could not be sent!', 500));
    }

    res.status(200).json({ success: true, data: user });
});



//@description: Reset password
//@return:  User data
//@route:   PUT /api/v1/auth/reset-password/:resetToken
//@access:  Public
export const resetPassword = asyncHandler(async (req, res, next) => {
    // Get hashed token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');

    const user = await UserModel.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } });

    if (!user) {
        return next(new ErrorResponse('Invalid token!', 400));
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
});


// Get Token from Model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create Token
    const token = user.getSignedJWT();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    // Set Secure option if in production environment
    if (process.env.NODE_ENV === "production") {
        options.secure = true;
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({ success: true, token });
}
