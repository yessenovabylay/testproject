const express = require("express");

const router = express.Router();


router.get('/',  async (req, res) => {

     res.render('pages/cart', {name: "asd"})
})

module.exports = router;