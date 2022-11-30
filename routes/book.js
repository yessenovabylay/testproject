const express = require("express");
const router = express.Router();
const BookController = require('../controllers/book');
const validator = require('../utils/validator')
const { isAuth, isAdmin } = require('../middlewares/auth')
const dateHelp = require("../utils/date")
const upload = require("../middlewares/upload");
const Response = require("../utils/Response")
const TaskRouterCapability = require("twilio/lib/jwt/taskrouter/TaskRouterCapability");

router

/**
  * @api {post} /book save new book
  * @apiName Save book
  * @apiGroup Book
  * @apiDescription Router for the Create book
  *
  * @apiBody {String} title
  * @apiBody {String} author Name of Author
  * @apiBody {String} isbn
  * @apiBody {String} description
  * @apiBody {String} count
  * @apiBody {String} rating
  * @apiBody {String} price
  * @apiBody {String} publishing_date
  * @apiBody {String} topic
  * @apiBody {String} genreIds
  *
  * @apiSuccess {Boolean} ok true
  *
  * @apiSuccessExample Body:
{
  *  error: "",
  *  ok: true,
  *  data: null
  * }

  */

.post("/",isAuth, isAdmin, upload.array("bookimages",10),async(req, res) => {
    try{
        let { title,author,isbn,description,count,rating,price,publishing_date,topic,genreIds } = req.body;
        publishing_date = dateHelp(publishing_date);
        const { files } = req;
        
        console.log(typeof publishing_date, publishing_date)
        const { msg, success} = validator.isString({title,author,isbn,description,topic});
   
        if(!success) return res.status(400).send({ success: false, data: msg});

        const createBook = await BookController.create(
            {title,
            author,
            isbn,
            description,
            count,
            rating,
            price,
            publishing_date,
            topic,
            files},
            genreIds)
        return res.json(new Response().data(createBook));
        }catch(err){
            console.log(err);
            return res.status(500).json(new Response().error(err));
        }
})

.get("/:id",async(req,res) => {
    try{
    const { id } = req.params;
    const getOneBook = await BookController.getOne({id})
    return res.status(200).send({success: true, data: getOneBook});
    }catch(err){
        console.log(err);
            return res.status(500).send({success: false, data: err?.message || err})
    }
})

.get("/", async (req, res) => {
    try{
    const getAllBooks = await BookController.getAll();
    return res.status(200).send({success: true, data: getAllBooks});
    }catch(err){
        console.log(err);
            return res.status(500).send({success: false, data: err?.message || err})
    }
})

.put("/:id", isAuth, isAdmin, async (req,res) => {
    try{
    const { id } = req.params;
    const { title, author, isbn, price, description, count, rating, publishing_dat, topic, genreIds} = req.body;

    publishing_date = new Date(publishing_dat);

    const { msg, success} = validator.isString({title,author,isbn,description,topic});
    if(!success) return res.status(400).send({ success: false, data: msg});

    const updateBook = await BookController.update(
        {
            id,
            title,
        author,
        isbn,
        description,
        count,
        rating,
        price,
        publishing_date,
        topic},
        genreIds)

        return res.status(200).send({success: true, data: updateBook});
    }catch(err){
        console.log(err);
            return res.status(500).send({success: false, data: err?.message || err})
    }
})

.delete("/:id", isAuth, isAdmin, async(req,res) => {
    try{
    const { id } = req.params;
    const deleteBook = BookController.delete(id)
    return res.status(200).send({success:true, data: deleteBook});
    }catch(err){
        console.log(err);
            return res.status(500).send({success: false, data: err?.message || err})
    }
})
module.exports = router;