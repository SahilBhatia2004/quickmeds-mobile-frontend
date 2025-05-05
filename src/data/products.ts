
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string[];
  image?: string;
  requiresPrescription: boolean;
  inStock: boolean;
  popular: boolean;
  dosage?: string;
  manufacturer?: string;
}

export const products: Product[] = [
  {
    id: "prod-001",
    name: "Paracetamol 500mg Tablets",
    description: "Effective pain relief for headaches, toothache, and fever. Fast acting formulation.",
    price: 5.99,
    category: ["fever", "popular"],
    requiresPrescription: false,
    inStock: true,
    popular: true,
    dosage: "500mg",
    manufacturer: "MediPharm"
  },
  {
    id: "prod-002",
    name: "Ibuprofen 200mg Capsules",
    description: "Anti-inflammatory pain relief ideal for muscle aches and period pain.",
    price: 6.99,
    discountPrice: 5.99,
    category: ["fever", "popular"],
    requiresPrescription: false,
    inStock: true,
    popular: true,
    dosage: "200mg",
    manufacturer: "HealthPro"
  },
  {
    id: "prod-003",
    name: "Cold & Flu Relief Tablets",
    description: "Fast relief from cold and flu symptoms including headache, fever, and congestion.",
    price: 8.99,
    category: ["cold", "popular"],
    requiresPrescription: false,
    inStock: true,
    popular: true,
    manufacturer: "WellCare"
  },
  {
    id: "prod-004",
    name: "Vitamin C 1000mg",
    description: "Supports immune system function and overall health maintenance.",
    price: 12.99,
    discountPrice: 10.99,
    category: ["vitamins", "popular"],
    requiresPrescription: false,
    inStock: true,
    popular: true,
    dosage: "1000mg",
    manufacturer: "VitaPlus"
  },
  {
    id: "prod-005",
    name: "Allergy Relief Loratadine",
    description: "24-hour non-drowsy allergy relief from pollen, dust, and pet dander.",
    price: 9.99,
    category: ["allergies"],
    requiresPrescription: false,
    inStock: true,
    popular: false,
    dosage: "10mg",
    manufacturer: "AllerCare"
  },
  {
    id: "prod-006",
    name: "Antiseptic Wound Spray",
    description: "Protects cuts and grazes from infection while promoting healing.",
    price: 7.99,
    category: ["firstAid"],
    requiresPrescription: false,
    inStock: true,
    popular: false,
    manufacturer: "SafeHeal"
  },
  {
    id: "prod-007",
    name: "Digital Thermometer",
    description: "Accurate temperature reading in seconds with easy-to-read digital display.",
    price: 15.99,
    category: ["essentials", "fever"],
    requiresPrescription: false,
    inStock: true,
    popular: false,
    manufacturer: "MediTech"
  },
  {
    id: "prod-008",
    name: "Hydrocortisone Cream 1%",
    description: "Relieves itchy skin from eczema, insect bites, and mild allergic reactions.",
    price: 6.99,
    category: ["skincare", "allergies"],
    requiresPrescription: false,
    inStock: true,
    popular: false,
    manufacturer: "DermaCare"
  },
  {
    id: "prod-009",
    name: "Multivitamin Daily Tablets",
    description: "Complete nutritional support with essential vitamins and minerals.",
    price: 14.99,
    discountPrice: 12.99,
    category: ["vitamins", "essentials"],
    requiresPrescription: false,
    inStock: true,
    popular: true,
    manufacturer: "VitaPlus"
  },
  {
    id: "prod-010",
    name: "Digestive Relief Tablets",
    description: "Fast-acting relief from heartburn, indigestion, and stomach discomfort.",
    price: 8.99,
    category: ["digestion"],
    requiresPrescription: false,
    inStock: true,
    popular: false,
    manufacturer: "DigestEase"
  },
  {
    id: "prod-011",
    name: "First Aid Kit - Basic",
    description: "Essential supplies for treating minor injuries at home or on the go.",
    price: 19.99,
    category: ["firstAid", "essentials"],
    requiresPrescription: false,
    inStock: true,
    popular: false,
    manufacturer: "SafeHeal"
  },
  {
    id: "prod-012",
    name: "Hand Sanitizer Gel",
    description: "Kills 99.9% of germs without water. Convenient pocket size.",
    price: 3.99,
    category: ["essentials"],
    requiresPrescription: false,
    inStock: true,
    popular: true,
    manufacturer: "CleanGuard"
  }
];
