const bcrypt = require("bcrypt");
const User = require("../models/user.model");

// const jwt = require("jsonwebtoken");
const cloudinary = require("../utils/cloudinary.config");
const catchAsync = require("../utils/catchAsync");
const successRes = require("../utils/seccessRes");

// GET USERS
const getUser = catchAsync(async (req, res) => {
  const result = await User.find();
  successRes(res, 200, result);
});

// GET SINGLE USER
const getSingleUser = catchAsync(async (req, res) => {
  const result = await User.findById(req.params.id);
  successRes(res, 200, result);
});

// REGISTER USER
const createUser = catchAsync(async (req, res) => {
  const { password, ...rest } = req.body;
  const { files } = req;

  // hashed password
  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = {
    ...rest,
    password: hashPassword,
  };

  if (files) {
    const { public_id, secure_url: url } = await cloudinary.uploader.upload(
      files.image.tempFilePath,
      {
        folder: "users",
        width: 200,
        height: 200,
        crop: "fill",
      }
    );

    newUser.image = { public_id, url };
  }

  const result = await User.create(newUser);
  successRes(res, 200, result);
});

// LOGIN USER
const loginUser = catchAsync(async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username: username });
  // res.send(user);
  if (user) {
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (isValidPassword) {
      successRes(res, 200, user);
    } else {
      res.status(404).json({ status: "fail", message: "Authentication fail!" });
    }
  } else {
    res.status(404).json({ status: "fail", message: "User not found!" });
  }
  /*
  if (user) {
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (isValidPassword) {
      const token = jwt.sign({ userid: user._id }, process.env.JWT_SCRECT, {
        expiresIn: "1h",
      });
      res.status(200).json({ status: "success", access_token: token });
    } else {
      res.json({ status: "fail", message: "Authetication fail!" });
    }
  }
  */
});

// remove image
// const public_id = post.thumbnail?.public_id;

// if (public_id && file) {
//   const { result } = await cloudinary.uploader.destroy(public_id);
//   if (result !== "ok")
//     return res.status(404).json({ error: "Thumbnai could not remove." });
// }

// UPDATE USER
const updateUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { files } = req;

  const user = await User.findById(id);

  const { public_id } = user?.image;

  if (files && public_id) {
    const { result } = await cloudinary.uploader.destroy(public_id);
    if (result !== "ok") {
      return res
        .status(404)
        .json({ status: "fail", message: "Picture could not remove!" });
    }
  }

  const updatedUser = req.body;

  if (files) {
    const { public_id, secure_url: url } = await cloudinary.uploader.upload(
      files.image.tempFilePath,
      {
        folder: "users",
        width: 200,
        height: 200,
        crop: "fill",
      }
    );

    updatedUser.image = { public_id, url };
  }
  const result = await User.findByIdAndUpdate(id, updatedUser, {
    new: true,
    runValidator: true,
  });
  successRes(res, 200, result);
});

// DELETE USER
const deleteuser = catchAsync(async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ status: "success" });
});

module.exports = {
  getUser,
  createUser,
  loginUser,
  getSingleUser,
  updateUser,
  deleteuser,
};
