var express = require("express");
var router = express.Router();

const multer = require("multer");
const upload = multer();

let ctrl = require("../controllers/recipeController");
let userMiddleware = require("../middleware/verifyUser");
let adminMiddleware = require("../middleware/verifyAdmin");

/*  /api/recipes GET

    Palauttaa reseptien id:n, otskikon, tekijän, hashin, arvostelujen keskiarvo, ja muita tietoja?

    Reseptejä voi myös hakea avainsanalla tai ainesosalla
    Esimerkki:
    /api/recipes?keyword=testi&ingredient=testi

    {
        recipes: [
            { id: 1, header: "Keitto", username: "user1", hash: "123", average_rating: 3 },
            { id: 2, header: "Paistos", username: "user2", hash: "234", average_rating: 4 }
        ]
    }

    Palauttaa myös loggedIn:true, jos käyttäjä kirjautunut, ei palauta kaikkia reseptejä (visibleToAll=null) jos käyttäjä ei ole kirjautunut
*/

router.route("/api/recipes").get(userMiddleware.isUserLoggedIn, ctrl.getAllRecipes);

/*  /api/recipe/urls GET

    Palauttaa reseptien hashit muodossa
    {
        hashes: [
            { hash: "123" },
            { hash: "234" }
        ]
    }

    Palauttaa myös onLogged: true, jos käyttäjä kirjautunut, ei palauta kaikkia hasheja (visibleToAll=null) jos käyttäjä ei ole kirjautunut
*/

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
    "average_rating": 4,
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
    ],
    "reviews": [
        {
            "id": 1,
            "rating": 3,
            "text": "asd",
            "username": "testuser"
        },
        {
            "id": 2,
            "rating": 3,
            "text": "asd",
            "username": "testuser"
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
        "ingredients": [{ "quantity": "100 g", "name": "potato" }, { "quantity": "5 kg", "name": "tomato" }]
    }

    visibleToAll pitää olla joka 1 tai 0

    Jos token puuttuu req.headers.authorization:nista, se on väärin tai vanhentunut, palauttaa statuskoodin 401

    Jos onnistuu, palauttaa statuskoodin 201 ja hashin, joka on reitti luodulle reseptille
*/

router.route("/api/recipe").post(userMiddleware.verifyJWT, upload.single("image"), ctrl.addRecipe);

/*  /api/recipe/:hash DELETE

    Pitää olla token mukana
    
    Jos poistaminen onnistuu, palauttaa statuskoodin 200

    Jos reseptiä ei ole, palauttaa statuskoodin 404

    Jos ei muusta syystä onnistu, palauttaa stauskoodin 500
*/

router.route("/api/recipe/:hash").delete(userMiddleware.verifyJWT, ctrl.deleteRecipe);

/*  /api/recipe/:hash PUT
    Esimerkki body:

    {
        "id": 1,
        "header": "makaronilaatikko",
        "description": "hyvää",
        "visibleToAll": 1,
        "durationHours": 1,
        "durationMinutes": 30,
        "steps": ["eka", "toka"],
        "keywords": ["avain", "sana"],
        "ingredients": [{ "quantity": "100 g", "name": "potato" }, { "quantity": "5 kg", "name": "tomato" }]
    }

    Jos token puuttuu req.headers.authorization:nista, se on väärin tai vanhentunut, palauttaa statuskoodin 401

    Jos resepti ei kuulu käyttäjälle tai sellaista reseptiä ei löydy, palauttaa statuskoodin 404

    Jos ei muusta syystä onnistu, palauttaa stauskoodin 500
*/

router.route("/api/recipe/:hash").put(userMiddleware.verifyJWT, upload.single("image"), ctrl.editRecipe);

router.route("/api/recipe/image/:hash").get(ctrl.getImage);

module.exports = router;