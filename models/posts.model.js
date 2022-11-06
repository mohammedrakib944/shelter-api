const mongoose = require("mongoose");

// location*, roomType*, price*, image, description, status, mobile*, email, userId*

const postsSchema = mongoose.Schema({
  location: {
    type: String,
    required: [true, "You must give the Location!"],
  },
  roomType: {
    type: String,
    enum: ["Single", "Double", "Flat"],
  },
  price: {
    type: String,
    required: [true, "You must give a Price!"],
  },
  image: {
    public_id: String,
    url: String,
  },
  description: {
    type: String,
  },
  status: {
    type: Boolean,
    default: true,
  },
  mobile: {
    type: String,
    required: [true, "Mobile is required!"],
  },
  email: {
    type: String,
  },
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: [true, "There is no user!"],
  },
});

const Posts = mongoose.model("Posts", postsSchema);

module.exports = Posts;
