const mongoose = require('mongoose');
const validator = require('validator');
mongoose.set('debug', true);

const UserSchema = mongoose.Schema({
  email: {
    type: String, required: true, unique: true, validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email',
      isAsync: false
    }
  },
  hash: { type: String, required: true },
  fullname: { type: String, required: true },
  phone: { type: String },
  roles: [{ type: String }],
  initials: { type: String },
  passport: { type: String },
  accountDetails: {
    name: String,
    number: Number,
    bank: String
  },
  defaultBranch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "branch"
  }
}, { timestamps: true, });

UserSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', UserSchema);