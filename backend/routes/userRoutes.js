const express = require("express");
const { registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUser, getSingleUser, updateUserRole, deleteUser } = require("../controllers/userControllers");
const { isAuthenticatedUser, authorisedRoles } = require("../middleware/auth");
const router = express.Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/password/forgot").post(forgotPassword);

router.route("/logout").get(logout);

router.route("/password/reset/:token").put(resetPassword);

router.route("/me").get(isAuthenticatedUser,getUserDetails);

router.route("/password/update").put(isAuthenticatedUser, updatePassword)

router.route("/me/update").put(isAuthenticatedUser, updateProfile)

router.route("/admin/users").get(isAuthenticatedUser, authorisedRoles("admin"), getAllUser);

router.route("/admin/user/:id").get(isAuthenticatedUser, authorisedRoles("admin"), getSingleUser);

router.route("/admin/user/:id").put(isAuthenticatedUser, authorisedRoles("admin"), updateUserRole);

router.route("/admin/user/:id").delete(isAuthenticatedUser, authorisedRoles("admin"),deleteUser);

module.exports = router;