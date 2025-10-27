import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { AppContext } from "../context/AppContext.jsx";
import Loading from "../components/Loading.jsx";

const TaskForm = () => {
  const navigate = useNavigate();
  const { createTask } = useContext(AppContext);

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "Pending",
    priority: "Low",
    dueDate: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      alert("Title is required");
      return;
    }

    setSubmitting(true);
    try {
      await createTask(form);
      navigate("/");
    } catch (err) {
      console.error("Failed to create task", err.message);
      alert("Failed to create task. Please try again.");
    }
    setSubmitting(false);
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-light-primary-dull dark:bg-dark-primary-dull transition-colors duration-300 px-4 py-10">
      <div className="w-full max-w-md p-6 rounded-2xl shadow-lg bg-light-primary dark:bg-dark-bg-form transition-colors duration-300">
        <h2 className="text-2xl font-bold mb-6 text-center text-light-text-dull dark:text-light-text-dull">
          Add New Task
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Title */}
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Task Title"
            className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-light-primary-dull dark:bg-light-primary-dull text-light-text-dull dark:text-light-text-dull focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          {/* Description */}
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Task Description"
            className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-light-primary-dull dark:bg-light-primary-dull text-light-text-dull dark:text-light-text-dull focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />

          {/* Status */}
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-light-primary-dull dark:bg-light-primary-dull text-light-text-dull dark:text-light-text-dull focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Pending</option>
            <option>In Progress</option>
            {/* <option>Completed</option> */}
          </select>

          {/* Priority */}
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-light-primary-dull dark:bg-light-primary-dull text-light-text-dull dark:text-light-text-dull focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          {/* Due Date */}
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-light-primary-dull dark:bg-light-primary-dull text-light-text-dull dark:text-light-text-dull focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-light-button hover:bg-light-hover dark:bg-dark-button dark:hover:bg-dark-hover text-light-text dark:text-dark-text p-2 rounded-md transition mt-2 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loading size={12} color="text-white" />
              </>
            ) : (
              "Create Task"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
