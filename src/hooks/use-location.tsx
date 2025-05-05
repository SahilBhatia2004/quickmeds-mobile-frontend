
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PharmacyLocation {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  isOpen: boolean;
  deliveryRadius: number; // in meters
}

export interface LocationState {
  userLocation: {
    lat: number;
    lng: number;
    address: string;
  } | null;
  nearbyPharmacies: PharmacyLocation[];
  selectedPharmacy: PharmacyLocation | null;
  
  // Actions
  setUserLocation: (location: { lat: number; lng: number; address: string }) => void;
  setNearbyPharmacies: (pharmacies: PharmacyLocation[]) => void;
  selectPharmacy: (pharmacyId: string) => void;
}

// This would typically come from an API based on the user's location
const mockPharmacies: PharmacyLocation[] = [
  {
    id: "pharm1",
    name: "Metro Pharmacy",
    address: "123 Main St, New York",
    lat: 40.7128,
    lng: -74.006,
    isOpen: true,
    deliveryRadius: 3000, // 3km
  },
  {
    id: "pharm2",
    name: "Central Medications",
    address: "456 Park Ave, New York",
    lat: 40.7282,
    lng: -73.9882,
    isOpen: true,
    deliveryRadius: 2500, // 2.5km
  },
  {
    id: "pharm3",
    name: "QuickMed Pharmacy",
    address: "789 Broadway, New York",
    lat: 40.7112,
    lng: -74.0135,
    isOpen: false, // Closed pharmacy
    deliveryRadius: 2000, // 2km
  }
];

export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
      userLocation: null,
      nearbyPharmacies: mockPharmacies,
      selectedPharmacy: null,
      
      setUserLocation: (location) => 
        set({ userLocation: location }),
      
      setNearbyPharmacies: (pharmacies) => 
        set({ nearbyPharmacies: pharmacies }),
      
      selectPharmacy: (pharmacyId) => {
        const { nearbyPharmacies } = get();
        const pharmacy = nearbyPharmacies.find(p => p.id === pharmacyId) || null;
        set({ selectedPharmacy: pharmacy });
      }
    }),
    {
      name: 'location-storage'
    }
  )
);

// Helper function to calculate distance between two coordinates
export const calculateDistance = (
  lat1: number, 
  lng1: number, 
  lat2: number, 
  lng2: number
): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lng2 - lng1) * Math.PI / 180;

  const a = 
    Math.sin(Δφ/2) * Math.sin(Δφ/2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distance in meters
};

// Helper function to check if a location is within delivery radius
export const isWithinDeliveryRadius = (
  userLat: number,
  userLng: number,
  pharmLat: number,
  pharmLng: number,
  radiusMeters: number
): boolean => {
  const distance = calculateDistance(userLat, userLng, pharmLat, pharmLng);
  return distance <= radiusMeters;
};
