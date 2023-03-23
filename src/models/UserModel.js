import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add your name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please add an email address"],
    unique: true,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please add a valid email, got {VALUE}."],
  },
  phone: {
    type: Number,
    required: [true, "Please add the User Phone number"],
    unique: true,
  },
  roles: {
    type: [String],
    values: ['buyer', 'seller', 'admin'],
    message: '{VALUE} role is not supported',
    default: 'buyer',
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  image: {
    type: String
  },
  balance: {
    type: Number,
    default: 1000,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
},
  {
    timestamps: true
  });

// Encrypt User password using bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


// Sign JWT and return token
UserSchema.methods.getSignedJWT = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
}

// Compares entered password with stored password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
}

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // Set expire for 10 minutes
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
}

export default mongoose.model("User", UserSchema);
