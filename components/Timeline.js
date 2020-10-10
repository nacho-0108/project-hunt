import React from "react";
import "./styles.css";
import { Chrono } from "react-chrono";
import data from "./data";

export default function Timeline() {
  return (
    <div className="Timeline">
      <div style={{ width: "100%", height: "95vh" }}>
        <Chrono items={data} mode="TREE" cardHeight={300} />
      </div>
    </div>
  );
}
