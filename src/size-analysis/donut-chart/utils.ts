import { CIRCUMFERENCE, SEGMENT_GAP } from "./constants";

export const getPercentage = (value: number, total: number): number =>
  total > 0 ? (value * 100) / total : 0;

export const getFormattedPercentage = (value: number): string =>
  value < 0.05 ? "< 0.1%" : `${value.toFixed(1)}%`;

interface Segment {
  key: string;
  value: number;
  percentage: number;
  dashLength: number;
  gapLength: number;
  offset: number;
}

export const getSegments = (
  entries: [string, number][],
  total: number,
): Segment[] => {
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
