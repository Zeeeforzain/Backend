// app.js
const express = require("express");
const connectDB = require("./src/database/connection");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("./src/models/admin"); // Admin model
const Book = require("./src/models/books");
const auth = require("./src/middleware/auth"); // JWT middleware for route protection
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// Admin Registration
app.post("/admin/register", async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({ username, password: hashedPassword });
        await newAdmin.save();
        res.status(201).json({ message: "Admin registered successfully" });
    } catch (e) {
        res.status(500).json({ message: "Server error" });
    }
});

// Admin Login
app.post("/admin/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        const token = jwt.sign({ id: admin._id, username: admin.username }, "your_jwt_secret", { expiresIn: "1h" });
        res.json({ token });
    } catch (e) {
        res.status(500).json({ message: "Server error" });
    }
});

// CRUD Operations for Books (with JWT protection)
app.post("/books", auth, async (req, res) => {
    try {
        const books = new Book(req.body);
        const createBook = await books.save();
        res.status(201).send(createBook);
    } catch (e) {
        res.status(400).send(e);
    }
});

app.get("/books", async (req, res) => {
    try {
        const bookData = await Book.find();
        res.send(bookData);
    } catch (e) {
        res.status(500).send(e);
    }
});

app.get("/books/:id", async (req, res) => {
    try {
        const _id = req.params.id;
        const bookData = await Book.findById(_id);
        if (!bookData) {
            return res.status(404).send();
        } else {
            res.send(bookData);
        }
    } catch (e) {
        res.status(500).send(e);
    }
});

app.put("/books/:id", auth, async (req, res) => {
    try {
        const _id = req.params.id;
        const bookUpdate = await Book.findByIdAndUpdate(_id, req.body, { new: true });
        if (!bookUpdate) {
            return res.status(404).send();
        }
        res.send(bookUpdate);
    } catch (e) {
        res.status(500).send(e);
    }
});

app.delete("/books/:id", auth, async (req, res) => {
    try {
        const _id = req.params.id;
        const deleteBook = await Book.findByIdAndDelete(_id);
        if (!deleteBook) {
            return res.status(404).send();
        }
        res.send(deleteBook);
    } catch (e) {
        res.status(500).send(e);
    }
});

app.listen(port, () => {
    connectDB();
    console.log(`Connection is setup at ${port}`);
});
