import React, { useContext, useEffect, useState } from "react";
import { GripVertical, ListTodo, PieChart, PlusSquare } from "lucide-react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { ResponsivePie } from "@nivo/pie";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { AppContext } from "../context/AppContext.jsx";
import TaskCard from "../components/TaskCard.jsx";
import Loading from "../components/Loading.jsx";

const COLORS = ["#4ade80", "#facc15", "#f87171"];

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    tasks,
    fetchTasks,
    reorderTask,
    stats: getStats,
    dark,
    token,
    user,
    loading,
  } = useContext(AppContext);

  const [filter, setFilter] = useState({
    status: "All",
    priority: "All",
    dueDate: "All",
  });

  useEffect(() => {
    if (token) fetchTasks();
  }, [token]);

  const handleAddTaskClick = () => {
    if (!user || !token) navigate("/login");
    else navigate("/add-task");
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    await reorderTask(result.source.index, result.destination.index);
    toast.success("Task order updated");
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter.status !== "All" && t.status !== filter.status) return false;
    if (filter.priority !== "All" && t.priority !== filter.priority)
      return false;

    if (filter.dueDate !== "All") {
      if (!t.dueDate) return false;
      const taskDate = new Date(t.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (
        filter.dueDate === "Today" &&
        taskDate.toDateString() !== today.toDateString()
      )
        return false;

      if (filter.dueDate === "This Week") {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        if (taskDate < startOfWeek || taskDate > endOfWeek) return false;
      }

      if (filter.dueDate === "This Month") {
        if (
          taskDate.getMonth() !== today.getMonth() ||
          taskDate.getFullYear() !== today.getFullYear()
        )
          return false;
      }

      if (filter.dueDate === "Next Month") {
        const nextMonth = new Date(today);
        nextMonth.setMonth(today.getMonth() + 1);
        if (
          taskDate.getMonth() !== nextMonth.getMonth() ||
          taskDate.getFullYear() !== nextMonth.getFullYear()
        )
          return false;
      }

      if (filter.dueDate === "Overdue" && taskDate >= today) return false;
    }

    return true;
  });

  const { completed, inProgress, pending } = getStats();

  const chartData = [
    { name: "Completed", value: completed },
    { name: "In Progress", value: inProgress },
    { name: "Pending", value: pending },
  ];

  return (
    <div className="min-h-screen px-4 md:px-16 lg:px-36 py-5 bg-light-primary-dull dark:bg-dark-primary-dull">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2 text-light-text-dull dark:text-dark-text">
            <ListTodo />
            My Tasks
          </h1>

          <button
            onClick={handleAddTaskClick}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-light-button dark:bg-dark-button text-light-text dark:text-dark-text hover:bg-light-hover dark:hover:bg-dark-hover transition"
          >
            <PlusSquare size={18} />
            <span className="hidden md:inline">Add Task</span>
          </button>
        </div>

        {/* Filter */}
        {user && token && (
          <div className="flex flex-wrap gap-3 mb-6">
            {["status", "priority", "dueDate"].map((key) => (
              <select
                key={key}
                value={filter[key]}
                onChange={(e) =>
                  setFilter({ ...filter, [key]: e.target.value })
                }
                className="bg-light-primary dark:bg-dark-primary text-light-text-dull dark:text-dark-text p-2 rounded-md cursor-pointer"
              >
                {key === "status" &&
                  ["All", "Pending", "In Progress", "Completed"].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                {key === "priority" &&
                  ["All", "Low", "Medium", "High"].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                {key === "dueDate" &&
                  [
                    "All",
                    "Today",
                    "This Week",
                    "This Month",
                    "Next Month",
                    "Overdue",
                  ].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
              </select>
            ))}
          </div>
        )}

        {/* Content */}
        {!user || !token ? (
          <div className="text-center py-20 text-light-text-dull dark:text-dark-text">
            <p className="text-2xl font-semibold mb-3">
              “Welcome! Productivity starts with a single task.”
            </p>
            <p className="text-lg opacity-80">
              Log in or sign up to start organizing your day 🚀
            </p>
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center py-20">
            <Loading size={28} color="light-title dark:dark-title" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-20 text-light-text-dull dark:text-dark-text">
            <p className="text-2xl font-semibold mb-3">No tasks yet 🎯</p>
            <p className="text-lg opacity-80">
              Create your first task to get started!
            </p>
            <button
              onClick={handleAddTaskClick}
              className="mt-5 px-5 py-2 rounded-lg bg-light-button dark:bg-dark-button text-light-text dark:text-dark-text hover:bg-light-hover dark:hover:bg-dark-hover transition"
            >
              <PlusSquare size={18} className="inline mr-2" />
              Add Task
            </button>
          </div>
        ) : filteredTasks.length > 0 ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="taskList">
              {(provided) => (
                <ul
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-3"
                >
                  {filteredTasks.map((task, index) => (
                    <Draggable
                      key={task._id}
                      draggableId={task._id}
                      index={index}
                    >
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="relative flex items-center justify-between"
                        >
                          <div className="flex-1 mr-3">
                            <TaskCard task={task} />
                          </div>
                          <div
                            {...provided.dragHandleProps}
                            className="flex items-center justify-center w-9 h-9 rounded-md text-gray-400 hover:text-gray-200 hover:bg-gray-700 cursor-grab active:cursor-grabbing transition"
                            title="Drag to reorder"
                          >
                            <GripVertical size={18} />
                          </div>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <div className="text-center py-20 text-light-text-dull dark:text-dark-text">
            <p className="text-lg opacity-80">No tasks match your filters.</p>
          </div>
        )}

        {/* Chart - only after first task */}
        {user && token && tasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-10"
          >
            <h2 className="text-lg font-semibold mb-2 ml-5 flex items-center gap-2 text-light-text-dull dark:text-light-text">
              <PieChart size={20} />
              Task Progress Overview
            </h2>
            <div className="w-full h-64 sm:h-72 md:h-80 text-light-text-dull dark:text-dark-text bg-light-primary dark:bg-dark-primary mb-6 shadow-md">
              <ResponsivePie
                data={chartData.map((d, i) => ({
                  id: d.name,
                  label: d.name,
                  value: d.value,
                  color: COLORS[i],
                }))}
                margin={{ top: 40, right: 80, bottom: 60, left: 80 }}
                innerRadius={0.5}
                padAngle={2}
                cornerRadius={5}
                activeOuterRadiusOffset={8}
                colors={{ datum: "data.color" }}
                borderWidth={0}
                arcLabelsTextColor={dark ? "#e5e7eb" : "#333"}
                arcLinkLabelsSkipAngle={2}
                arcLinkLabelsTextColor={dark ? "#e5e7eb" : "#333"}
                legends={[
                  {
                    anchor: "bottom",
                    direction: "row",
                    translateY: 56,
                    itemsSpacing: 10,
                    itemWidth: 80,
                    itemHeight: 18,
                    itemTextColor: dark ? "#e5e7eb" : "#333",
                    symbolSize: 12,
                    symbolShape: "circle",
                  },
                ]}
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
