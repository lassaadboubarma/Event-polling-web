const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const { protect, managerOnly } = require("../middlewares/authMiddleware");
const Event = require("../models/Event");

// Create a new event
router.post("/create", verifyToken, async (req, res) => {
    const { title, description, date } = req.body;

    try {
        const newEvent = new Event({
            title,
            description,
            date,
            createdBy: req.userId,
        });

        await newEvent.save();
        res.status(201).json({ message: "Event created successfully", event: newEvent });
    } catch (err) {
        res.status(500).json({ message: "Failed to create event", error: err.message });
    }
});

// Get all events
router.get("/all", async (req, res) => {
    try {
        const events = await Event.find().populate("createdBy", "email");
        res.status(200).json(events);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch events", error: err.message });
    }
});

// Get user's events
router.get("/my-events", verifyToken, async (req, res) => {
    try {
        const events = await Event.find({ createdBy: req.userId });
        res.status(200).json(events);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch events", error: err.message });
    }
});

// Update an event (only creator or manager can update)
router.put("/update/:id", verifyToken, async (req, res) => {
    try {
        const { title, description, date } = req.body;

        // Find the event by ID
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Check if the logged-in user is the creator or has manager role
        if (event.createdBy.toString() !== req.userId && req.role !== "manager") {
            return res.status(403).json({ message: "You are not authorized to update this event" });
        }

        // Update the event fields
        event.title = title || event.title;
        event.description = description || event.description;
        event.date = date || event.date;

        await event.save();

        res.status(200).json({ message: "Event updated successfully", event });
    } catch (err) {
        res.status(500).json({ message: "Failed to update event", error: err.message });
    }
});

// Update an event (User who created the event only)
router.put("/update/:id", verifyToken, async (req, res) => {
    const { title, description, date } = req.body;

    try {
        const event = await Event.findOne({ _id: req.params.id, createdBy: req.userId });
        if (!event) {
            return res.status(403).json({ message: "You are not authorized to edit this event" });
        }

        // Update fields
        event.title = title || event.title;
        event.description = description || event.description;
        event.date = date || event.date;

        await event.save();
        res.status(200).json({ message: "Event updated successfully", event });
    } catch (err) {
        res.status(500).json({ message: "Failed to update event", error: err.message });
    }
});


// Manager can delete any event
router.delete("/manager/delete/:id", protect, managerOnly, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: "Event not found" });

        await Event.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Event deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete event", error: err.message });
    }
});

// Delete event by the event creator
router.delete("/delete/:id", verifyToken, async (req, res) => {
    try {
        const event = await Event.findOne({ _id: req.params.id, createdBy: req.userId });
        if (!event) {
            return res.status(403).json({ message: "You are not authorized to delete this event" });
        }

        await Event.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Event deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete event", error: err.message });
    }
});

// Attend an event
router.post("/attend/:id", verifyToken, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: "Event not found" });

        if (event.attendees.includes(req.userId)) {
            return res.status(400).json({ message: "You are already attending this event" });
        }

        event.attendees.push(req.userId);
        await event.save();

        const updatedEvent = await Event.findById(req.params.id).populate("attendees", "email");
        res.status(200).json({
            message: "Successfully attended the event",
            attendees: updatedEvent.attendees,
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to attend the event", error: err.message });
    }
});



router.get("/all", async (req, res) => {
    try {
        const events = await Event.find()
            .populate("createdBy", "email") // Populate creator's email
            .populate("attendees", "email"); // Populate attendees' email
        res.status(200).json(events);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch events", error: err.message });
    }
});







module.exports = router;
