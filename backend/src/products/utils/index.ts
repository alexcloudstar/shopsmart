export const calculateNewRating = (
  currentRating: number,
  currentRatingCount: number,
  newRating: number,
): number =>
  (currentRating * currentRatingCount + newRating) / (currentRatingCount + 1);
