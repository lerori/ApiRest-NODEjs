const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const taskSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, trim: true, maxlength: 2000 },
    due_date: { type: Date, required: true },
    completed: { type: Boolean, required: true, default: false }
  },
  {
    strict: true, // rechaza campos no definidos en el schema (evita mass assignment)
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

module.exports = mongoose.model("Task", taskSchema);
