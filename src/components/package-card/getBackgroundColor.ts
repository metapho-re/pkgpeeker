const startColor = "#1f1f28";
const endColor = "#363646";

const getWeightedColor = (
  hexStartColor: string,
  hexEndColor: string,
  depth: number,
  maxDepth: number
): string => {
  const decimalStartColor = parseInt(hexStartColor, 16);
  const decimalEndColor = parseInt(hexEndColor, 16);

  return Math.floor(
    decimalStartColor +
      ((decimalEndColor - decimalStartColor) * depth) / maxDepth
  ).toString(16);
};

interface Props {
  depth: number;
  maxDepth: number;
}

export const getBackgroundColor = ({ depth, maxDepth }: Props): string => {
  if (maxDepth === 0) {
    return startColor;
  }

  const weightedRed = getWeightedColor(
    startColor.substring(1, 3),
    endColor.substring(1, 3),
    depth,
    maxDepth
  );

  const weightedGreen = getWeightedColor(
    startColor.substring(3, 5),
    endColor.substring(3, 5),
    depth,
    maxDepth
  );

  const weightedBlue = getWeightedColor(
    startColor.substring(5, 7),
    endColor.substring(5, 7),
    depth,
    maxDepth
  );

  return `#${weightedRed}${weightedGreen}${weightedBlue}`;
};
