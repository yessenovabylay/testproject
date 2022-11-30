const express = require("express");

const router = express.Router();


router.get('/',  async (req, res) => {

     res.render('pages/home', {name: "asd"})
})

module.exports = router;