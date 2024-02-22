var express = require("express");
var router = express.Router();

let ctrl = require("../controllers/reviewController");
let userMiddleware = require("../middleware/verifyUser");

/*  /api/review POST

    Esimerkki body:
    {
        "rating": 3,
        "text": "testi",
        "recipeId": 8
    }

    Jos token puuttuu req.headers.authorization:nista, se on väärin tai vanhentunut, palauttaa statuskoodin 401

    Jos sellaista reseptiä ei löytynyt, palauttaa statuskoodin 404

    Jos onnistuu, palauttaa statuskoodin 201
*/

router.route("/api/review").post(userMiddleware.verifyJWT, ctrl.addReview);

module.exports = router;