var express = require("express");
var router = express.Router();

let ctrl = require("../controllers/favouriteController");
let userMiddleware = require("../middleware/verifyUser");

/*  /api/favourite POST
    body:
    {
        recipeId
    }
    Palauttaa 404 jos ei löydy reseptiä (tai jos se on jo suosikki)

    Palauttaa 201 jos onnistuu

    Token pitää olla mukana
*/

router.route("/api/favourite").post(userMiddleware.verifyJWT, ctrl.addFavourite);

/*  /api/favourite DELETE
    recipeId pitää olla id, ei hash
    Token pitää olla mukana

    Palauttaa 404 jos sellaista resepti-käyttäjä suosikkiparia ei ole
    Palauttaa 200 jos onnistuu
*/

router.route("/api/favourite/:recipeId").delete(userMiddleware.verifyJWT, ctrl.deleteFavourite);

/*  /api/favourite GET
    Token pitää olla mukana
    Palauttaa 404 jos ei löydy yhtään suosikkia

    Palauttaa 200 ja kaikki suosikit jos löytyy
*/

router.route("/api/favourite").get(userMiddleware.verifyJWT, ctrl.getFavourites);

module.exports = router;