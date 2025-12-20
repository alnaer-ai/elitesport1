export const DEFAULT_PLACE_DESCRIPTION =
  "Destination curated by EliteSport with white-glove service and member-only access.";

export const PLACE_CATEGORY_LABELS: Record<string, string> = {
  hotel: "Hotel",
  gym: "Gym",
  female: "Female Club",
  kids: "Kids Club",
  spa: "Spa",
  tennisSquash: "Tennis & Squash",
};

export const getPlaceCategoryLabel = (category?: string | null) => {
  if (!category) return "EliteSport";
  return PLACE_CATEGORY_LABELS[category] ?? "EliteSport";
};
