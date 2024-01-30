var express = require("express");
var router = express.Router();

let ctrl = require("../controllers/userController");
let jwtMiddleware = require("../middleware/verifyJWT");
let adminMiddleware = require("../middleware/verifyAdmin");

router.route("/api/users").get(jwtMiddleware.verifyJWT, adminMiddleware.verifyAdmin, ctrl.getAllUsers);

router.route("/api/users/:userId").delete(jwtMiddleware.verifyJWT, adminMiddleware.verifyAdmin, ctrl.deleteUser);

module.exports = router;