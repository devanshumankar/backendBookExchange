import express from "express"
import Requests from "../models/Requests.js"
import Books from "../models/Books.js"
import User from "../models/User.js"
const router = express.Router()

router.post("/", async (req, res) => {
    try {
        const { requesterId, requesteeId, requestedBookId, ownerBookId } = req.body;

        if (!requesterId || !requesteeId || !requestedBookId || !ownerBookId) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newRequest = new Requests({
            requesterId,
            requesteeId,
            requestedBookId,
            ownerBookId,
            requestStatus: "pending"
        });

        const savedRequest = await newRequest.save();
        await Books.findByIdAndUpdate(requestedBookId, { status: "pending" });
        await Books.findByIdAndUpdate(ownerBookId, { status: "pending" });
        res.status(201).json(savedRequest);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
})


router.get("/pending", async (req, res) => {
    try {
        const pendingRequests = await Requests.find({ requestStatus: "pending" })
            .populate("requestedBookId")
            .populate("ownerBookId");

        res.status(200).json(pendingRequests);
    } catch (error) {
        console.error("Error fetching pending requests:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.patch("/reject/:id", async (req, res) => {
    try {
        const request = await Requests.findById(req.params.id);
        if (!request) return res.status(404).json({ message: "Request not found" });

        request.requestStatus = "rejected";
        await request.save();

        await Books.findByIdAndUpdate(request.requestedBookId, { status: "available" });
        await Books.findByIdAndUpdate(request.ownerBookId, { status: "available" });

        res.status(200).json({ message: "Request rejected and books are available" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

router.patch("/accept/:id", async (req, res) => {
    try {
        const request = await Requests.findById(req.params.id);
        if (!request) return res.status(404).json({ message: "Request not found" });

        request.requestStatus = "approved";
        await request.save();

        await Books.findByIdAndUpdate(request.requestedBookId, { status: "not available" });
        await Books.findByIdAndUpdate(request.ownerBookId, { status: "not available" });

        res.status(200).json({ message: "Request accepted and books are not available" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});




router.get("/approved", async (req, res) => {
    try {
        const approvedRequests = await Requests.find({ requestStatus: "approved" })
            .sort({ createdAt: -1 })
            .populate("requestedBookId")
            .populate("ownerBookId");

        const result = await Promise.all(
            approvedRequests.map(async (req) => {

                const requesterUser = await User.findOne(
                    { uid: req.requesterId },
                    "userName phone"
                );

                const requesteeUser = await User.findOne(
                    { uid: req.requesteeId },
                    "userName phone"
                );

                return {
                    ...req._doc,
                    requesterUser,
                    requesteeUser
                };
            })
        );

        res.status(200).json(result);

    } catch (error) {
        console.error("Error fetching approved requests:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/approved/user/:uid", async (req, res) => {
    try {
        const { uid } = req.params;

        const results = await Requests.find({
            requestStatus: "approved",
            $or: [{ requesterId: uid }, { requesteeId: uid }]
        })
            .populate("requestedBookId")
            .populate("ownerBookId");

        const finalData = await Promise.all(
            results.map(async (r) => {
                const requesterUser = await User.findOne({ uid: r.requesterId }, "userName phone");
                const requesteeUser = await User.findOne({ uid: r.requesteeId }, "userName phone");

                return {
                    ...r._doc,
                    requesterUser,
                    requesteeUser
                };
            })
        );

        res.json(finalData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});





export default router;