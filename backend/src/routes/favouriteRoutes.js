var express = require("express");
var router = express.Router();

let ctrl = require("../controllers/favouriteController");
let userMiddleware = require("../middleware/verifyUser");

router.route("/api/favourite").post(userMiddleware.verifyJWT, ctrl.addFavourite);

module.exports = router;