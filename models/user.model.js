const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required!"],
  },
  email: {
    type: String,
    required: [true, "Email is required!"],
  },
  address: {
    type: String,
  },
  phone: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "You must give your password!"],
  },
  image: {
    public_id: String,
    url: String,
  },

  role: {
    type: String,
    default: "user",
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
