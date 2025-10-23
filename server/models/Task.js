// Import Mongoose for schema and model creation
const mongoose = require("mongoose");

// Define the schema for Task documents
const TaskSchema = new mongoose.Schema(
  {
    // Reference to the user who owns the task
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },

    // Task title (required)
    title: { 
      type: String, 
      required: true 
    },

    // Task description (optional)
    description: { 
      type: String,
      required: true 
    },

    // Task status with predefined options
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },

    // Optional due date for the task
    dueDate: { 
      type: Date 
    },

    // Priority level with predefined values
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    //Order of the task
    order: {
      type: Number,
      default: 0
    },
  },

  // Automatically manage createdAt and updatedAt fields
  { timestamps: true }
);

// Export the Task model
module.exports = mongoose.model("Task", TaskSchema);
