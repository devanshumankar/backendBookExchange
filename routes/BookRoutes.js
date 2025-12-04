import express from "express"
import Books from "../models/Books.js";

const router = express.Router();

router.post("/addBooks", async (req, res) => {
    try {


        const { ownerUid, title, author, condition, image } = req.body;

        const newBook = await Books.create({
            ownerUid,
            title,
            author,
            condition,
            image
        })
        res.status(201).json({
            message: "Book added successfully",
            book: newBook,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server error" });
    }
})

router.get("/", async (req, res) => {
    try {
        const books = await Books.find({ status: "available" });
        res.status(200).json(books);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await Books.findByIdAndDelete(id);
        res.status(200).json({ message: "Book deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updatedBook = await Books.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({ message: "Book updated successfully", book: updatedBook });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

router.get("/user/:uid", async (req, res) => {
    try {
        const { uid } = req.params;
        const books = await Books.find({ ownerUid: uid });
        res.status(200).json(books);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

router.get("/search", async (req, res) => {
    try {
        const { q } = req.query;
        const books = await Books.find({
            title: { $regex: q, $options: "i" }, 
            status: "available"
        });
        res.status(200).json(books);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});
export default router;