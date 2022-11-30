const express = require("express");
const app = express();

const genre = require("./genre");
const book = require("./book");
const user = require("./user");
const response = require("./Response")
const anketa = require('./anketa')
const booking = require("./Booking");
const comment = require("./Comment");
const news = require('./news')
const admin = require("./admin");
const data = require("./data");


const { isAuth, isAdmin, isModer, isNotUser } = require("../middlewares/auth")

app.use('/api/genre', genre);
app.use('/api/book', book);
app.use('/api/user', user);
app.use('/api/data', data);
app.use('/api/response', isAuth, response);
app.use('/api/anketa', isAuth, anketa);
app.use("/api/booking", isAuth, booking);
app.use("/api/comment",isAuth, comment);
app.use('/api/news', news);
app.use("/api/admin", isAuth,isNotUser, admin)


app.use("/", require('./pages'))


module.exports = app;