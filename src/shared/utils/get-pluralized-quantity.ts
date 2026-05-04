export const getPluralizedQuantity = (count: number, word: string): string =>
  count === 1 ? `${count} ${word}` : `${count} ${word}s`;
