const p = require("../Controller/Crud");
const exp = require("express")
const router = exp.Router();

router.post("/save",p.create)

module.exports = router