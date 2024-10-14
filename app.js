const express = require("express");
const connectDB = require("./src/database/connection");
require("./src/database/connection");
const app = express();
const Book = require("./src/models/books");
const port = process.env.PORT || 3000;
app.use(express.json());

app.post("/books", async (req, res) => {
  try {
    console.log(req.body);
    const books = new Book(req.body);
    const createBook = await books.save();
    res.status(201).send(createBook);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.get("/books", async (req, res) => {
    try{
       const bookData=await Book.find();
       res.send(bookData);
    }catch(e){
        res.send(e);
    }
});

app.get("/books/:id",async(req,res)=>{
    try{
        const _id = req.params.id
        const bookData = await Book.findById(_id);
        if(!bookData){
            return res.status(404).send();
        }else{
            res.send(bookData); 
        }
    }
    catch(e){
        res.status(500).send(e);
    }
})

app.put("/books/:id", async(req, res)=>{
    try{
        const _id = req.params.id;
        const bookUpdate = await Book.findByIdAndUpdate(_id, req.body,{
            new:true
        });
        if (!bookUpdate) {
            return res.status(404).send();
          }
        res.send(bookUpdate);
    }catch(e){
        res.status(500).send(e);
    }
})

app.delete("/books/:id", async(req, res)=>{
    try{
        const _id = req.params.id;
        const deleteBook = await Book.findByIdAndDelete(_id)
        if (!req.params.id){
            return res.status(404).send();
        }
        res.send(deleteBook)
    }catch(e){
        res.status(500).send(e)
    }
})

app.listen(port, () => {
    connectDB();
    console.log(`Connection is setup at ${port}`);
  });