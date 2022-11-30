const express = require("express");

const router = express.Router();


router.get('/',  async (req, res) => {

     res.render('pages/verification', {name: "asd"})
})

module.exports = router;