var express = require("express");
var router = express.Router();

let ctrl = require("../controllers/recipeController");
let userMiddleware = require("../middleware/verifyUser");

router.route("/api/recipes").get(userMiddleware.isUserLoggedIn, ctrl.getAllRecipes);

router.route("/api/recipe/urls").get(userMiddleware.isUserLoggedIn, ctrl.getAllRecipeHashes);

/*  /api/recipe/:hash GET

    Jos hashillä ei löydy reseptiä, palauttaa statuskoodin 404

    Jos resepti löytyy, palauttaa statuskoodin 200 ja reseptin muodossa:
{
    "id": 1,
    "username": "test",
    "hash": "7e61ada10cf30b4b2f6cfd46812f48344f09a3de003af0263bab97c6390b6fa6",
    "header": "makaronilaatikko",
    "description": "hyvää",
    "visibleToAll": 1,
    "created": "2024-02-02T14:25:30.000Z",
    "modified": null,
    "durationHours": 1,
    "durationMinutes": 30,
    "ingredients": [
        {
            "id": 1,
            "name": "potato",
            "quantity": "5 kg"
        },
        {
            "id": 2,
            "name": "tomato",
            "quantity": "2"
        }
    ],
    "steps": [
        {
            "number": 1,
            "step": "eka"
        },
        {
            "number": 2,
            "step": "toka"
        }
    ],
    "keywords": [
        {
            "id": 1,
            "word": "avain"
        },
        {
            "id": 2,
            "word": "sana"
        }
    ]
}

    Steps on aina oikeassa järjestyksessä
*/

router.route("/api/recipe/:hash").get(userMiddleware.isUserLoggedIn, ctrl.getRecipe);

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

    Jos onnistuu, palauttaa statuskoodin 201 ja hashin, joka on reitti luodulle reseptille
*/

router.route("/api/recipe").post(userMiddleware.verifyJWT, ctrl.addRecipe);

/*  /api/recipe/:hash DELETE

    Pitää olla token mukana
    
    Jos poistaminen onnistuu, palauttaa statuskoodin 200

    Jos reseptiä ei ole, palauttaa statuskoodin 404

    Jos ei muusta syystä onnistu, palauttaa stauskoodin 500
*/

router.route("/api/recipe/:hash").delete(userMiddleware.verifyJWT, ctrl.deleteRecipe);

module.exports = router;