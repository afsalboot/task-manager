import React from "react";
import { Loader } from "lucide-react";

const Loading = ({ size }) => {
  const dimension = `${size}px`;

  return (
    <Loader
      className={`animate-spin text-light-loader dark:text-dark-loader`}
      style={{ width: dimension, height: dimension }}
    />
  );
};

export default Loading;
