import "./donut-chart.css";

import { useState } from "react";

import { getFormattedSize } from "../../utils";

import { Popover } from "../popover";

import { CENTER, CHART_SIZE, RADIUS, STROKE_WIDTH } from "./constants";
import { getFormattedPercentage, getPercentage, getSegments } from "./utils";

interface Props {
  entries: [string, number][];
  total: number;
  getColor: (key: string, index: number) => string;
}

export const DonutChart = ({ entries, total, getColor }: Props) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const segments = getSegments(entries, total);

  const hoveredSegment =
    hoveredIndex !== null ? segments[hoveredIndex] : undefined;

  return (
    <div className="donut-chart">
      <div className="donut-chart__chart-anchor">
        <Popover
          content={
            hoveredSegment ? (
              <span>
                {hoveredSegment.key}&nbsp;-&nbsp;
                {getFormattedSize(hoveredSegment.value)}&nbsp;-&nbsp;
                {getFormattedPercentage(hoveredSegment.percentage)}
              </span>
            ) : (
              ""
            )
          }
        >
          <svg
            className="donut-chart__chart"
            viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE}`}
          >
            {segments.map(({ key, dashLength, gapLength, offset }, index) => (
              <circle
                key={key}
                className="donut-chart__segment"
                cx={CENTER}
                cy={CENTER}
                r={RADIUS}
                fill="none"
                stroke={getColor(key, index)}
                strokeWidth={STROKE_WIDTH}
                strokeDasharray={`${dashLength} ${gapLength}`}
                strokeDashoffset={-offset}
                opacity={
                  hoveredIndex === null || hoveredIndex === index ? 1 : 0.4
                }
                transform={`rotate(-90 ${CENTER} ${CENTER})`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            ))}
          </svg>
        </Popover>
      </div>
      <div className="donut-chart__legend">
        {entries.map(([key, value], index) => (
          <div
            key={key}
            className={`donut-chart__legend-item${hoveredIndex !== null && hoveredIndex !== index ? " donut-chart__legend-item--dimmed" : ""}`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div
              className="donut-chart__color-bubble"
              style={{ backgroundColor: getColor(key, index) }}
            />
            <p className="donut-chart__legend-label">
              {key}:&nbsp;
              {getFormattedPercentage(getPercentage(value, total))}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
