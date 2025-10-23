const Task = require("../models/Task");
const User = require("../models/User");

//Get current logged-in user's profile and task statistics
const getUserProfile = async (req, res) => {
  try {
    // Retrieve the logged-in user's data, excluding the password
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Gather basic task statistics for the current user
    const [totalTasks, completedTasks, pendingTasks, inProgressTasks] = await Promise.all([
      Task.countDocuments({ user: req.user._id }),
      Task.countDocuments({ user: req.user._id, status: "Completed" }),
      Task.countDocuments({ user: req.user._id, status: "Pending" }),
      Task.countDocuments({ user: req.user._id, status: "In Progress" }),
    ]);

    const stats = {
      total: totalTasks,
      completed: completedTasks,
      pending: pendingTasks,
      inProgress: inProgressTasks,
    };

    // Respond with user profile and stats
    return res.status(201).json({ user, stats });
  } catch (error) {
    console.error("Error fetching profile:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getUserProfile };
