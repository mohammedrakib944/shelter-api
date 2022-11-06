const express = require("express");
const router = express.Router();
const postController = require("../controller/posts.controller");

router
  .route("/")
  .get(postController.getAllPosts)
  .post(postController.createPosts);

router
  .route("/:id")
  .get(postController.getSinglePost)
  .patch(postController.updatePost)
  .delete(postController.deletePosts);

router.get("/byuser/:id", postController.getPostsByUser);

module.exports = router;
