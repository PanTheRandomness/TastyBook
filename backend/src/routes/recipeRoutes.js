var express = require("express");
var router = express.Router();

let ctrl = require("../controllers/recipeController");

router.route("/api/recipes").get(ctrl.getAllRecipes);

module.exports = router;