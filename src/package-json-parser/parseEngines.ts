export const parseEngines = (engines: unknown): string | null => {
  if (
    typeof engines === "object" &&
    engines !== null &&
    "node" in engines &&
    typeof (engines as Record<string, unknown>).node === "string"
  ) {
    return (engines as Record<string, unknown>).node as string;
  }

  return null;
};
