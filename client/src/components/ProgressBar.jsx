import React from "react";
import { CheckCircle, Activity, Clock } from "lucide-react";

const ProgressBar = ({
  completed = 0,
  inProgress = 0,
  pending = 0,
  total = 1,
}) => {
  const safeTotal = total || 1;

  const completedPercent = ((completed / safeTotal) * 100).toFixed(1);
  const inProgressPercent = ((inProgress / safeTotal) * 100).toFixed(1);
  const pendingPercent = ((pending / safeTotal) * 100).toFixed(1);

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-4 overflow-hidden flex">
        <div
          className="h-full bg-green-500 transition-all duration-500"
          style={{ width: `${completedPercent}%` }}
        ></div>
        <div
          className="h-full bg-orange-500 transition-all duration-500"
          style={{ width: `${inProgressPercent}%` }}
        ></div>
        <div
          className="h-full bg-yellow-500 transition-all duration-500"
          style={{ width: `${pendingPercent}%` }}
        ></div>
      </div>

      {/* Labels */}
      <div className="flex justify-between text-sm mt-2 text-gray-700 dark:text-gray-300">
        <div className="flex items-center gap-1">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span>{completedPercent}% Completed</span>
        </div>
        <div className="flex items-center gap-1">
          <Activity className="w-4 h-4 text-orange-500" />
          <span>{inProgressPercent}% In Progress</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4 text-yellow-500" />
          <span>{pendingPercent}% Pending</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
