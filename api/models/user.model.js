const mongoose = require("mongoose");
const validator = require("validator");
mongoose.set("debug", true);

const UserSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: "{VALUE} is not a valid email",
        isAsync: false
      }
    },
    hash: { type: String },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    phone: { type: String },
    dateOfBirth: { type: Date },
    designation: { type: String },
    role: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
    passport: { type: String },
    accountDetails: {
      name: String,
      number: Number,
      bank: String
    },
    defaultBranch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch"
    },
    branches: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Branch" }
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    inactive: { type: Boolean, default: true },
    approved: { type: Boolean, default: false },
    activationCode: { type: String, unique: true },
    activationExpiresIn: { type: Date, }
  },
  { timestamps: true }
);

UserSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("User", UserSchema);
