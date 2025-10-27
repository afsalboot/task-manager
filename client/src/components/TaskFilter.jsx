import React from "react";

const TaskFilter = ({ filter, setFilter }) => {
  const options = {
    status: ["All", "Pending", "In Progress", "Completed"],
    priority: ["All", "Low", "Medium", "High"],
    dueDate: ["All", "Today", "This Week", "This Month", "Next Month", "Overdue"],
  };

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {Object.keys(options).map((key) => (
        <select
          key={key}
          value={filter[key]}
          onChange={(e) => setFilter({ ...filter, [key]: e.target.value })}
          className="bg-light-primary dark:bg-dark-primary text-[#A694F7] p-2 rounded-md cursor-pointer"
        >
          {options[key].map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
      ))}
    </div>
  );
};

export default TaskFilter;
