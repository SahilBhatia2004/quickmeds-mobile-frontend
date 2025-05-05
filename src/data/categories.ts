
export interface CategoryItem {
  id: string;
  name: string;
  icon?: string;
}

export const medicineCategories: CategoryItem[] = [
  { id: "fever", name: "Fever & Pain", icon: "💊" },
  { id: "cold", name: "Cold & Flu", icon: "🤧" },
  { id: "vitamins", name: "Vitamins", icon: "🍊" },
  { id: "firstAid", name: "First Aid", icon: "🩹" },
  { id: "skincare", name: "Skincare", icon: "✨" },
  { id: "digestion", name: "Digestion", icon: "🧠" },
  { id: "allergies", name: "Allergies", icon: "🌼" },
  { id: "essentials", name: "Daily Essentials", icon: "🧴" },
];
