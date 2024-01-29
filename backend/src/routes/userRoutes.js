var express = require("express");
var router = express.Router();

let ctrl = require("../controllers/userController");

/*  /api/signup POST
    Esimerkki body:

    {
        "username": "testuser",
        "name": "Test User",
        "email": "test@example.com",
        "password": "password"
    }

    Jos username, name, email tai password puuttuu, palauttaa statuskoodin 400
    
    Jos username tai email löytyy jo tietokannasta, palauttaa statuskoodin 409

    Jos rekisteröityminen onnistuu, palauttaa statuskoodin 200, ja token objektin JSON-muodossa
    "token": "xxxx.yyyy.zzzz"
    jossa yyyy on käyttäjä encoded, ja jolla on id ja user kentät (user tarkoittaa usernamea tässä)
    
    Jos rekisteröityminen ei onnistu muusta syystä, palauttaa statuskoodin 500

    Jos tietokannassa ei ole yhtään käyttäjää, rekisteröityvä käyttäjä on admin
*/

router.route("/api/signup").post(ctrl.signup);

/*  /api/login POST
    Esimerkki body:

    {
        "username": "testuser",
        "password": "password"
    }
    
    Jos username tai password puuttuu, palauttaa statuskoodin 400

    Jos käyttäjää ei usernamen perusteella löydy tietokannasta, palauttaa statuskoodin 409

    Jos salasana ei ole oikein kyseiselle käyttäjälle, palauttaa statuskoodin 409

    Jos kirjautuminen onnistuu, palauttaa statuskoodin 200, ja token objektin

    Jos kirjautuminen ei onnistu muusta syystä, palauttaa statuskoodin 500
*/

router.route("/api/login").post(ctrl.login);

module.exports = router;