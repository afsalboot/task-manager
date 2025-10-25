import React, { useContext, useEffect, useState } from "react";
import { GripVertical, ListTodo, PieChart, PlusSquare } from "lucide-react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { ResponsivePie } from "@nivo/pie";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { AppContext } from "../context/AppContext.jsx";
import TaskCard from "../components/TaskCard.jsx";

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
  } = useContext(AppContext);

  const [filter, setFilter] = useState({
    status: "All",
    priority: "All",
    dueDate: "All",
  });

  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token]);

  const handleAddTaskClick = () => {
    if (!user || !token) {
      navigate("/signup");
    } else {
      navigate("/add-task");
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    await reorderTask(result.source.index, result.destination.index);
    toast.success("Task order updated");
  };

  const filteredTasks = tasks.filter((t) => {
    // Status filter
    if (filter.status !== "All" && t.status !== filter.status) return false;

    // Priority filter
    if (filter.priority !== "All" && t.priority !== filter.priority)
      return false;

    // DueDate filter
    if (filter.dueDate !== "All") {
      if (!t.dueDate) return false; // handle tasks with no dueDate

      const taskDate = new Date(t.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Log to debug
      console.log("Task dueDate:", t.dueDate, "Parsed:", taskDate);

      if (
        filter.dueDate === "Today" &&
        taskDate.toDateString() !== today.toDateString()
      ) {
        return false;
      }

      if (filter.dueDate === "This Week") {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
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

      if (filter.dueDate === "Overdue" && taskDate >= today) {
        return false;
      }
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
    <div className="min-h-screen px-6 md:px-16 lg:px-36 py-5 bg-light-primary-dull dark:bg-dark-primary-dull ">
      <div className="maax-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2 text-light-text-dull dark:text-dark-text">
            <ListTodo className="text-light-text-dull dark:text-dark-text" /> My
            Tasks
          </h1>
          <div className="flex gap-3 mt-3 md:mt-0">
            <button
              onClick={handleAddTaskClick}
              className="flex items-center gap-2 text-light-text dark:text-dark-text bg-light-button dark:bg-dark-button hover:bg-light-hover dark:hover:bg-dark-hover px-4 py-2 rounded-lg transition cursor-pointer"
            >
              <PlusSquare size={18} /> Add Task
            </button>
          </div>
        </div>
        {/* Filter */}
        <div className="flex flex-wrap gap-3 mb-6">
          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className="bg-light-primary dark:bg-dark-primary text-light-text-dull dark:text-dark-text p-2 rounded-md cursor-pointer"
          >
            <option>All</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>

          <select
            value={filter.priority}
            onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
            className="bg-light-primary dark:bg-dark-primary text-light-text-dull dark:text-dark-text p-2 rounded-md cursor-pointer"
          >
            <option>All</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <select
            value={filter.dueDate}
            onChange={(e) => setFilter({ ...filter, dueDate: e.target.value })}
            className="bg-light-primary dark:bg-dark-primary text-light-text-dull dark:text-dark-text p-2 rounded-md cursor-pointer"
          >
            <option>All</option>
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
            <option>Next Month</option>
            <option>Overdue</option>
          </select>
        </div>

        {/* Task List */}
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
                    key={task._id || index}
                    draggableId={task._id?.toString() || `task-${index}`}
                    index={index}
                  >
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="relative flex items-center justify-between bg-transparent"
                      >
                        {/* Task card now takes up most width */}
                        <div className="flex-1 mr-3">
                          <TaskCard task={task} />
                        </div>

                        {/* Drag handle sits to the right */}
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

        {/* Chart */}
        <h2 className="text-lg font-semibold  mb-2 ml-5 flex items-center gap-2 text-light-text-dull dark:text-light-text">
          <PieChart size={20} />
          Task Prograss Overview
        </h2>
        <div className="text-light-text-dull dark:text-dark-text bg-light-primary dark:bg-dark-primary mb-6 shadow-md">
          <div style={{ height: "300px" }}>
            <ResponsivePie
              data={chartData.map((d, i) => ({
                id: d.name,
                label: d.name,
                value: d.value,
                color: COLORS[i],
              }))}
              margin={{ top: 40, right: 80, bottom: 60, left: 80 }}
              innerRadius={0.5}
              padAngle={20}
              cornerRadius={5}
              activeOuterRadiusOffset={8}
              colors={{ datum: "data.color" }}
              borderWidth={1}
              borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
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
              theme={{
                textColor: "#ccc",
                tooltip: {
                  container: {
                    background: "#1f2937",
                    color: "#f9fafb",
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
