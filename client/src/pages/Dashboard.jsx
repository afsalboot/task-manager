import React, { useContext, useEffect, useState } from "react";
import { ListTodo, PieChart, PlusSquare } from "lucide-react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { ResponsivePie } from "@nivo/pie";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router";
import TaskCard from "../components/TaskCard";
import toast from "react-hot-toast";

const COLORS = ["#4ade80", "#facc15", "#f87171"];

const Dashboard = () => {

    const navigate = useNavigate()
    const {
    tasks,
    fetchTasks,
    reorderTask,
    stats: getStats,
    dark,
    token,
    user,
  } = useContext(AppContext);


  const [filter, setFilter] = useState({ status: "All", priority: "All" });

  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token]);

  const handleAddTaskClick = () => {
    if(!user || !token) {
        navigate("/signup")
    }else{
        navigate('/add-task')
    }
  }

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    await reorderTask(result.source.index, result.destination.index);
    toast.success("Task order updated");
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter.status !== "All" && t.status !== filter.status) return false;

    if (filter.priority !== "All" && t.priority !== filter.priority)
      return false;

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
              className="flex items-center gap-2 text-light-text dark:text-dark-text bg-light-button dark:bg-dark-button hover:bg-light-hover dark:hover:bg-dark-hover px-4 py-2 rounded-lg transition"
            >
              <PlusSquare size={18} /> Add Task
            </button>
          </div>
        </div>
        {/* Filter */}
        <div className="flex flex-wrap gap-3 mb-6">
          <select
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className="bg-light-primary dark:bg-dark-primary text-light-text-dull dark:text-dark-text p-2 rounded-md"
          >
            <option>All</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>

          <select
            onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
            className="bg-light-primary dark:bg-dark-primary text-light-text-dull dark:text-dark-text p-2 rounded-md"
          >
            <option>All</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        {/* Chart */}
        <h2 className="text-lg font-semibold  mb-2 ml-5 flex items-center gap-2 text-light-text-dull dark:text-light-text">
            <PieChart size={20}/>Task Prograss Overview
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
                  <Draggable key={task._id} draggableId={task._id} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <TaskCard task={task} />
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
