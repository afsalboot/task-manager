import React, { useContext } from "react";
import { ResponsivePie } from "@nivo/pie";
import { PieChart } from "lucide-react";
import { AppContext } from "../context/AppContext.jsx";

const COLORS = ["#4ade80", "#60a5fa", "#facc15"];

const TaskChart = ({ completed, inProgress, pending }) => {
  const { dark } = useContext(AppContext);
  const chartData = [
    { id: "Completed", label: "Completed", value: completed, color: COLORS[0] },
    { id: "In Progress", label: "In Progress", value: inProgress, color: COLORS[1] },
    { id: "Pending", label: "Pending", value: pending, color: COLORS[2] },
  ];

  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold mb-2 ml-5 flex items-center gap-2 text-[#4B0082] dark:text-[#A694F7]">
        <PieChart size={20} />
        Task Progress Overview
      </h2>
      <div className="w-full h-64 sm:h-72 md:h-80 rounded-xl bg-light-primary dark:bg-dark-primary shadow-md">
        <ResponsivePie
          data={chartData}
          margin={{ top: 40, right: 80, bottom: 60, left: 80 }}
          innerRadius={0.5}
          padAngle={2}
          cornerRadius={5}
          activeOuterRadiusOffset={8}
          colors={{ datum: "data.color" }}
          borderWidth={0}
          arcLabelsTextColor={dark ? "#D3D3D3" : "#2C2A2D"}
          arcLinkLabelsTextColor={dark ? "#D3D3D3" : "#2C2A2D"}
          legends={[
            {
              anchor: "bottom",
              direction: "row",
              translateY: 56,
              itemsSpacing: 10,
              itemWidth: 80,
              itemHeight: 18,
              itemTextColor: dark ? "#D3D3D3" : "#2C2A2D",
              symbolSize: 12,
              symbolShape: "circle",
            },
          ]}
        />
      </div>
    </div>
  );
};

export default TaskChart;
