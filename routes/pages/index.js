const express = require("express");
const app = express();



app.use('/login', require('./login'));
app.use('/registration', require('./registration'));
app.use('/', require('./home'));
app.use('/cart',require('./cart'))
app.use('/news',require('./news'))
app.use('/verification',require('./verification'))

module.exports = app;