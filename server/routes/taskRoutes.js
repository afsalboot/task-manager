const express = require('express')
const { createTask, getTasks, getTaskById, updateTask, deleteTask, reorderTask } = require('../controller/taskController.js');
const protect = require('../middleware/authMiddleware.js');
const router = express.Router()


router.post('/create-task', protect, createTask);
router.get('/get-tasks', protect, getTasks);
router.get('/get-single-task/:id', protect, getTaskById);
router.put('/update-task/:id', protect, updateTask);
router.delete('/delete-task/:id', protect, deleteTask);
router.post('/task-reorder', protect, reorderTask);


module.exports = router;