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
    fullname: { type: String, required: true },
    phone: { type: String },
    role: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
    passport: { type: String },
    accountDetails: {
      name: String,
      number: Number,
      bank: String
    },
    defaultBranch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true
    },
    inactive: { type: Boolean, default: true, required: true },
    regInfo: {
      code: { type: String, require: true, unique: true },
      expiresIn: { type: Date, required: true }
    }
  },
  { timestamps: true }
);

UserSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("User", UserSchema);
