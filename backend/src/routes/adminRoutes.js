var express = require("express");
var router = express.Router();

let ctrl = require("../controllers/userController");
let jwtMiddleware = require("../middleware/verifyUser");
let adminMiddleware = require("../middleware/verifyAdmin");

/*  /api/users GET

    Jos token puuttuu req.headers.authorization:nista, se on väärin, vanhentunut, tai se ei ole adminin, palauttaa statuskoodin 401

    Jos onnistuu, palauttaa statuskoodin 200 ja taulukon kaikista käyttäjistä, joilla on arvot
    id, username, name, email, admin

    Jos ei onnistu muusta syystä, palauttaa statuskoodin 500
*/

router.route("/api/users").get(jwtMiddleware.verifyJWT, adminMiddleware.verifyAdmin, ctrl.getAllUsers);

/*  /api/users/:userId DELETE

    Jos token puuttuu req.headers.authorization:nista, se on väärin, vanhentunut, tai se ei ole adminin, palauttaa statuskoodin 401

    Jos onnistuu, palauttaa vain statukoodin 200

    Jos ei onnistu muusta syystä, palauttaa statuskoodin 500
*/

router.route("/api/users/:userId").delete(jwtMiddleware.verifyJWT, adminMiddleware.verifyAdmin, ctrl.deleteUser);

module.exports = router;