import "./files-breakdown.css";

import { useState } from "react";

import type { FolderStatistics } from "../../types";
import { getFormattedSize } from "../../utils";

import { Popover } from "../popover";

import { getExtensionColor } from "./get-extension-color";

const CHART_SIZE = 200;
const STROKE_WIDTH = 36;
const RADIUS = (CHART_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const CENTER = CHART_SIZE / 2;
const SEGMENT_GAP = 2;

const getPercentage = (value: number, total: number): number =>
  (value * 100) / total;

const getFormattedPercentage = (value: number): string =>
  value < 0.05 ? "< 0.1%" : `${value.toFixed(1)}%`;

interface Segment {
  key: string;
  value: number;
  percentage: number;
  dashLength: number;
  gapLength: number;
  offset: number;
}

const getSegments = (entries: [string, number][], total: number): Segment[] => {
  const segments: Segment[] = [];
  let offset = 0;

  for (const [key, value] of entries) {
    const percentage = getPercentage(value, total);
    const rawDashLength = (percentage / 100) * CIRCUMFERENCE;
    const dashLength = Math.max(0, rawDashLength - SEGMENT_GAP);
    const gapLength = CIRCUMFERENCE - dashLength;

    segments.push({ key, value, percentage, dashLength, gapLength, offset });
    offset += rawDashLength;
  }

  return segments;
};

type Props = Omit<FolderStatistics, "numberOfFilesInFolder">;

export const FilesBreakdown = ({
  folderSizeInBytes,
  ...statisticsByExtension
}: Props) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const folderStatisticsEntries = Object.entries(statisticsByExtension).sort(
    ([, valueA], [, valueB]) => valueB - valueA,
  );

  const segments = getSegments(folderStatisticsEntries, folderSizeInBytes);

  const hoveredSegment =
    hoveredIndex !== null ? segments[hoveredIndex] : undefined;

  return (
    <div className="breakdown">
      <div className="breakdown__chart-anchor">
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
            className="breakdown__chart"
            viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE}`}
          >
            {segments.map(({ key, dashLength, gapLength, offset }, index) => (
              <circle
                key={key}
                className="breakdown__segment"
                cx={CENTER}
                cy={CENTER}
                r={RADIUS}
                fill="none"
                stroke={getExtensionColor(key)}
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
      <div className="extensions">
        {folderStatisticsEntries.map(([key, value], index) => (
          <div
            key={key}
            className={`extensions__tag${hoveredIndex !== null && hoveredIndex !== index ? " extensions__tag--dimmed" : ""}`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div
              className="color-bubble"
              style={{
                backgroundColor: getExtensionColor(key),
              }}
            />
            <p className="extensions__label">
              {key}:&nbsp;
              {getFormattedPercentage(getPercentage(value, folderSizeInBytes))}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
