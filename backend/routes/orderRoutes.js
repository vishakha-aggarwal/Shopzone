const express = require("express");
const { newOrder, myOrders, getSingleOrder, getAllOrders, updateOrder, deleteOrder } = require("../controllers/orderControllers");
const { isAuthenticatedUser, authorisedRoles } = require("../middleware/auth");
const router = express.Router();

router.route("/order/new").post(isAuthenticatedUser, newOrder);

router.route("/order/me").get(isAuthenticatedUser, myOrders);

router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);

router.route("/admin/orders").get(isAuthenticatedUser, authorisedRoles("admin") ,getAllOrders);

router.route("/admin/order/:id").put(isAuthenticatedUser, authorisedRoles("admin") ,updateOrder).delete(isAuthenticatedUser, authorisedRoles("admin"), deleteOrder);

module.exports = router;