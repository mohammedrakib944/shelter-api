const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller");
const checkAuth = require("../middlewares/checkAuth");

router.get("/", userController.getUser);
router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);

router
  .route("/:id")
  .get(userController.getSingleUser)
  .patch(userController.updateUser)
  .delete(userController.deleteuser);

module.exports = router;
