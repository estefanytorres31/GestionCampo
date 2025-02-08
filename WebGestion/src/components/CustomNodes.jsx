import React, { useState } from "react";
import { Handle } from "reactflow";

export const ParentNode = ({ data, isConnectable }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={`p-4 border-2 rounded-3xl transition-all duration-300 ${
        hovered ? "shadow-[0_0_20px_var(--border-color)]" : ""
      }`}
      style={{
        borderColor: "var(--border-color)",
        background: hovered ? "var(--hover-bg)" : "var(--primary-bg)",
        color: "var(--primary-text)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <h2 className="h3-jetbrains">{data.label}</h2>
      {data.subtext && <p className="p-jetbrains">{data.subtext}</p>}
      <Handle
        type="source"
        position="bottom"
        isConnectable={isConnectable}
        style={{ background: "var(--border-color)" }}
      />
    </div>
  );
};

export const CustomNode = ({ data, isConnectable }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={`p-4 border-2 rounded-3xl transition-all duration-300 ${
        hovered ? "shadow-[0_0_20px_var(--border-color)]" : ""
      }`}
      style={{
        borderColor: "var(--border-color)",
        background: hovered ? "var(--hover-bg)" : "var(--primary-bg)",
        color: "var(--primary-text)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <h3 className="h4-jetbrains">{data.label}</h3>
      {data.subtext && <p className="p-jetbrains">{data.subtext}</p>}
      <Handle
        type="target"
        position="left"
        isConnectable={isConnectable}
        style={{ background: "var(--border-color)" }}
      />
      <Handle
        type="source"
        position="right"
        isConnectable={isConnectable}
        style={{ background: "var(--border-color)" }}
      />
    </div>
  );
};
