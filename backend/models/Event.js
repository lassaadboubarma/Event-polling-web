const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Add this field
});

module.exports = mongoose.model("Event", EventSchema);
