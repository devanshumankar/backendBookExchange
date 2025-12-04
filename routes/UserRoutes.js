import express from "express";
import User from "../models/User.js";

const router = express.Router();
router.post("/register", async (req, res) => {
    try {
        const { uid, userName, email, phone } = req.body;

        let user = await User.findOne({ uid })

        if (user) {
            return res.status(200).json({ message: "User already exists", user });
        }
        const newUser = await User.create({
            uid,
            userName,
            email,
            phone
        })

        res.status(201).json({
            message: "User saved successfully",
            user: newUser
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server error" });
    }
})

router.get("/pending", async (req, res) => {
    try {
        const pendingUsers = await User.find({ isVerified: false });
        res.status(200).json(pendingUsers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
router.get("/:uid", async (req, res) => {
    try {
        const { uid } = req.params
        const user = await User.findOne({ uid });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server error" });
    }

})

router.patch("/verify/:uid", async (req, res) => {
    try {
        const { uid } = req.params;
        const user = await User.findOneAndUpdate(
            { uid },
            { isVerified: true },
            { new: true }
        );
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "User verified", user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

router.patch("/role/:uid", async (req, res) => {
    try {
        const { uid } = req.params;
        const { role } = req.body;
        if (!["user", "admin"].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }
        const user = await User.findOneAndUpdate(
            { uid },
            { role },
            { new: true }
        );
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "User role updated", user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
export default router;