import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const StaffSchema = new mongoose.Schema({
  surname: {
    type: String,
    required: [true, "Please add a Surname"],
    trim: true,
  },
  other_names: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please add the Staff Email address"],
    unique: true,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please add a valid email, got {VALUE}."],
  },
  phone: {
    type: Number,
    required: [true, "Please add the Staff Phone number"],
    unique: true,
  },
  role: {
    type: String,
    enum: {
      values: ['staff'],
      message: '{VALUE} is not supported'
    },
    default: 'staff',
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
},
  {
    timestamps: true
  });

// Encrypt staff password using bcrypt
StaffSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


// Sign JWT and return token
StaffSchema.methods.getSignedJWT = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
}

// Compares entered password with stored password
StaffSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
}

// Generate and hash password token
StaffSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // Set expire for 10 minutes
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
}

export default mongoose.model("Staff", StaffSchema);
