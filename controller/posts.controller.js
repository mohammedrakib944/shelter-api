const Posts = require("../models/posts.model");

const cloudinary = require("../utils/cloudinary.config");
const catchAsync = require("../utils/catchAsync");
const successRes = require("../utils/seccessRes");

// GET ALL POSTS
exports.getAllPosts = catchAsync(async (req, res) => {
  const result = await Posts.find();
  successRes(res, 200, result);
});

// GET POSTS BY USER
exports.getPostsByUser = catchAsync(async (req, res) => {
  const result = await Posts.find({ userId: req.params.id });
  successRes(res, 200, result);
});

// GET SINGLE POST
exports.getSinglePost = catchAsync(async (req, res) => {
  const result = await Posts.findById(req.params.id);
  successRes(res, 200, result);
});

// CREATE POST
exports.createPosts = catchAsync(async (req, res) => {
  const { files } = req;
  const newPost = req.body;

  if (files) {
    const { public_id, secure_url: url } = await cloudinary.uploader.upload(
      files.image.tempFilePath,
      {
        folder: "posts",
        width: 620,
        height: 480,
        crop: "fill",
      }
    );
    newPost.image = { public_id, url };
  }

  const result = await Posts.create(newPost);
  successRes(res, 200, result);
});

// UPDATE POST
exports.updatePost = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { files } = req;

  const updatePost = req.body;

  const post = await Posts.findById(id);

  const { public_id } = post?.image;

  if (files && public_id) {
    //IAMGE DELETE FROM SERVER
    const { result } = await cloudinary.uploader.destroy(public_id);
    if (result !== "ok") {
      return res
        .status(404)
        .json({ status: "fail", message: "Picture could not remove!" });
    }
  }
  if (files) {
    // UPLOAD NEW IMAGE ON SERVER
    const { public_id, secure_url: url } = await cloudinary.uploader.upload(
      files.image.tempFilePath,
      {
        folder: "posts",
        width: 620,
        height: 480,
        crop: "fill",
      }
    );
    updatePost.image = { public_id, url };
  }

  const result = await Posts.findByIdAndUpdate(id, updatePost, {
    new: true,
    runValidator: true,
  });

  successRes(res, 200, result);
});

// DELETE POST
exports.deletePosts = catchAsync(async (req, res) => {
  const { id } = req.params;

  const post = await Posts.findById(id);
  const { public_id } = post?.image;

  if (public_id) {
    //IAMGE DELETE FROM SERVER
    const { result } = await cloudinary.uploader.destroy(public_id);
    if (result !== "ok") {
      return res
        .status(404)
        .json({ status: "fail", message: "Could not delete Post!" });
    }
  }
  await Posts.findByIdAndDelete(id);
  res.json({ status: "success" });
});
