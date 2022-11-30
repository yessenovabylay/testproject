const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const routes = require("./routes");
require("dotenv").config();
require("express-async-errors");
const redis = require('./cache-storage/redisClient')
const {Worker} = require("worker_threads");
const path = require('path')

const app = express();

app.set('view engine', 'ejs')

const socketOptions = { 
    allowEIO3: true, 
    cors: { 
        origin: [ '*', 'http://localhost:5555' ], 
        methods: [ 'GET', 'POST', 'OPTIONS' ], 
        allowedHeaders: 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range', 
    } 
};

app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(express.static("public"));
app.use('/static', express.static(path.join(__dirname, 'uploads')))

app.use(cors());

app.use('/', routes);


app.get("/", (req, res) => {
    res.send('ok')
});

app.use((err, req, res, next) => {
  
    console.error(req, err);
  
    if (err instanceof Error) {
        return res.status(500).send({success: false, data: err.message});
    } else {
        return res.status(500).send({success: false, data: err});
    }
   })

// (async () => {
//     const worker = new Worker("./worker.js", {workerData: 200});

//     worker.on("message", (msg) => {
//         console.log("message from worker", msg)
//     })

//     // sms(`Верните книгу ${Abay}`, findByExp.User.phoneNumber)
//     console.log("test");

// })()




const server = app.listen(process.env.PORT, () => {
	console.log(`[Express] Started on ${process.env.PORT}`);
});

const io = require("socket.io")(server, socketOptions); 
 
app.set('io', io); 
 
// io.on("connection", async (socket) => {    
//     // console.log({socket}) 
//     const {id} = socket.handshake.query; 
//     redis.set(`user_${id}`, JSON.stringify(socket), "EX", 60*10)

//     redis.set(`user_${id}`,socket)

// });
