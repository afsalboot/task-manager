import React from "react";

const StatsCard = ({ icon: Icon, label, value, color }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-light-primary dark:bg-dark-button rounded-lg shadow-md">
      <Icon className={`${color} w-7 h-7 sm:w-8 sm:h-8 mb-2`} />
      <h3 className="font-semibold text-light-text-dull dark:text-dark-text text-sm sm:text-base">
        {label}
      </h3>
      <p className={`text-xl sm:text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
};

export default StatsCard;
