const express = require("express");
const { getAllProducts, getAdminProducts, createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview, getProductReviews, deleteReview } = require("../controllers/productControllers");
const { isAuthenticatedUser, authorisedRoles } = require("../middleware/auth");
const router = express.Router();

router.route("/products").get(getAllProducts);

router.route("/admin/products").get(isAuthenticatedUser, authorisedRoles("admin"), getAdminProducts);

router.route("/admin/product/new").post(isAuthenticatedUser, authorisedRoles("admin"), createProduct);

router.route("/admin/product/:id").put(isAuthenticatedUser, authorisedRoles("admin"), updateProduct).delete(isAuthenticatedUser, authorisedRoles("admin"), deleteProduct)

router.route("/product/:id").get(getProductDetails);

router.route("/review").put(isAuthenticatedUser, createProductReview);

router.route("/reviews").get(getProductReviews).delete(isAuthenticatedUser, deleteReview);

module.exports = router;