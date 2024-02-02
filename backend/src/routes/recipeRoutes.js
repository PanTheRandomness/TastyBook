var express = require("express");
var router = express.Router();

let ctrl = require("../controllers/recipeController");
let jwtMiddleware = require("../middleware/verifyJWT");

router.route("/api/recipes").get(ctrl.getAllRecipes);

/*  /api/recipe POST
    Esimerkki body:

    {
        "header": "makaronilaatikko",
        "description": "hyvää",
        "visibleToAll": 1,
        "durationHours": 1,
        "durationMinutes": 30,
        "steps": ["eka", "toka"],
        "keywords": ["avain", "sana"],
        "ingredients": [{ "quantity": "100 g", "ingredient": "potato" }, { "quantity": "5 kg", "ingredient": "tomato" }]
    }

    visibleToAll pitää olla joka 1 tai 0

    Jos token puuttuu req.headers.authorization:nista, se on väärin tai vanhentunut, palauttaa statuskoodin 401

    Jos onnistuu, palauttaa statuskoodin 201 ja hashin?
*/

router.route("/api/recipe").post(jwtMiddleware.verifyJWT, ctrl.addRecipe);

module.exports = router;