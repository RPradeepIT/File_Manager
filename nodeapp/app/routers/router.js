let express = require("express");
let router = express.Router();

const controller = require("../controllers/controller.js");

router.get("/api/getfolderlist", controller.allfolderlist);
router.get("/api/getfilesdetails", controller.getfilesdetails);

module.exports = router;
