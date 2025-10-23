const mongoose = require("mongoose");
const Task = require("../models/Task");

// Create a new task
const createTask = async (req, res) => {
  try {
    const {
      title,
      description = "",
      status = "pending",
      dueDate,
      priority = "medium",
    } = req.body;

    // Validate required fields
    if (!title || title.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Task title is required" });
    }

    // Find the last order number for the current user (for drag/drop order)
    const lastTask = await Task.findOne({ user: req.user._id }).sort({
      order: -1,
    });
    const nextOrder = lastTask ? lastTask.order + 1 : 0;

    // Create the new task
    const task = await Task.create({
      user: req.user._id,
      title: title.trim(),
      description,
      status,
      dueDate: dueDate ? new Date(dueDate) : null,
      priority,
      order: nextOrder, 
    });

    // Send success response
    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (err) {
    console.error("Error creating task:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all tasks for logged-in user, with optional filters and sorting
const getTasks = async (req, res) => {
  try {
    // Base filter (only user's tasks)
    const filter = { user: req.user._id };

    // Extract query params
    const {
      status,
      priority,
      dueBefore,
      dueAfter,
      q,
      page = 1,
      limit = 20,
    } = req.query;

    // Apply filters
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    if (dueBefore || dueAfter) filter.dueDate = {};
    if (dueBefore && !isNaN(Date.parse(dueBefore))) {
      filter.dueDate.$lte = new Date(dueBefore);
    }
    if (dueAfter && !isNaN(Date.parse(dueAfter))) {
      filter.dueDate.$gte = new Date(dueAfter);
    }

    // Text search (case-insensitive)
    if (q) filter.title = { $regex: q, $options: "i" };

    // Pagination setup
    const pageNum = parseInt(page);
    const pageLimit = parseInt(limit);
    const skip = (pageNum - 1) * pageLimit;

    // Fetch tasks — respect manual order if it exists
    const tasks = await Task.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(pageLimit);

    // Get total count (for frontend pagination)
    const total = await Task.countDocuments(filter);

    // Send response
    return res.status(200).json({
      success: true,
      total,
      page: pageNum,
      limit: pageLimit,
      tasks,
    });
  } catch (err) {
    console.error("Error fetching tasks:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//Get a single task by ID
const getTaskById = async (req, res) => {
  const { id } = req.params;

  // Validate the task ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid task ID format" });
  }

  try {
    // Find task by ID and ensure it belongs to the user
    const task = await Task.findOne({ _id: id, user: req.user._id });

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json(task);
  } catch (err) {
    console.error("Error getting task:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a task
const updateTask = async (req, res) => {
  try {
    // Find and update task, ensuring it belongs to the current user
    const updated = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: req.body },
      { new: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ message: "Task not found or not authorized" });
    }

    return res.status(200).json(updated);
  } catch (err) {
    console.error("Error updating task:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    // Find and delete task, ensuring it belongs to the current user
    const deleted = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Task not found or not authorized" });
    }

    return res.status(200).json({ message: "Task deleted" });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//Reorder a task
const reorderTask = async (req, res) => {
  try {
    const { order } = req.body;

    if (!order || !Array.isArray(order)) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    await Promise.all(
      order.map((taskId, index) =>
        Task.findOneAndUpdate(
          { _id: taskId, user: req.user._id },
          { order: index }
        )
      )
    );

    return res.status(200).json({ message: "Tasks reorder successfully" });
  } catch (err) {
    console.error("Error reordering tasks:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Export all task controller functions
module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  reorderTask,
};
