const express = require("express")
const router = express.Router();
const newsController = require("../controllers/news")
const validator = require("../utils/validator")
const upload = require("../middlewares/upload");
const { isAdmin, isAuth, isNotUser } = require("../middlewares/auth");
const { prisma } = require("@prisma/client");



router.post("/", upload.array("images",10) ,async (req,res) => {
    try{
    let created_at = new Date();
    const { title, short_title, description } = req.body
    const { files } = req;

    console.log({files})

    const createNews = await newsController.create({
        title,short_title,description,created_at, files
    })
    return res.status(200).send({success: true,data: createNews});}
    catch(err){
        console.log(err)
        return res.status(500).send({ success: false, data: err?.message || err});
    }
})

.get('/:newsId', async(req,res) => {
    try{
    const { newsId } = req.params;
    const getOneNews = await newsController.getOne(newsId)
    return res.status(200).send({success: true, data: getOneNews})
    }catch(err){
        console.log(err)
        return res.status(500).send({ success: false, data: err?.message || err});
    }
})

.get('/', async (req,res) => {
    try{
    const getAllNews = await newsController.getAll()
    return res.status(200).send({success: true, data: getAllNews})
    }catch(err){
        console.log(err)
        return res.status(500).send({ success: false, data: err?.message || err});
    }
})

.put('/update/:id', isAuth,isNotUser,async(req,res) => {
    try{
        let update_at = new Date();
        const { id } = req.params;
        const { 
            title, short_title, description
        } = req.body;

        const { files } = req;

        console.log({files})

        const updateNews = await newsController.update({
            id,title,short_title,description,update_at, files
        })

        return res.status(200).send({success: true, data: updateNews})
    }
    catch(err) {
        console.log(err)
        return res.status(500).send({ success: false, data: err?.message || err});
    }
})

// model News {
//     id          BigInt       @id @default(autoincrement())
//     title       String       @db.VarChar(100)
//     short_title String       @db.VarChar(30)
//     description String       @db.VarChar(1000)
//     created_at  DateTime
//     update_at   DateTime?
//     ImageModel  ImageModel[]
//     Comment     Comment[]

module.exports = router;