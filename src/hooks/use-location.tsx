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
  phone?: string;
  email?: string;
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
  fetchNearbyPharmacies: (lat: number, lng: number) => Promise<void>;
}

// Initial data for development - in production this would be empty
// and populated from API calls
const initialPharmacies: PharmacyLocation[] = [];

export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
      userLocation: null,
      nearbyPharmacies: initialPharmacies,
      selectedPharmacy: null,
      
      setUserLocation: (location) => {
        set({ userLocation: location });
        // When location changes, fetch nearby pharmacies
        if (location) {
          get().fetchNearbyPharmacies(location.lat, location.lng);
        }
      },
      
      setNearbyPharmacies: (pharmacies) => 
        set({ nearbyPharmacies: pharmacies }),
      
      selectPharmacy: (pharmacyId) => {
        const { nearbyPharmacies } = get();
        const pharmacy = nearbyPharmacies.find(p => p.id === pharmacyId) || null;
        set({ selectedPharmacy: pharmacy });
      },

      fetchNearbyPharmacies: async (lat, lng) => {
        try {
          // In a real app, this would be an API call to your backend
          console.log(`Fetching pharmacies near ${lat}, ${lng}`);
          
          // For development, simulate API response with mock data
          // In production, replace with actual API call
          
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock data with positions relative to user's location
          const mockPharmacies: PharmacyLocation[] = [
            {
              id: "pharm1",
              name: "Metro Pharmacy",
              address: "123 Main St, New York",
              lat: lat + 0.005, // ~500m north
              lng: lng,
              isOpen: true,
              deliveryRadius: 3000, // 3km
              phone: "555-123-4567",
              email: "contact@metropharmacy.com"
            },
            {
              id: "pharm2",
              name: "Central Medications",
              address: "456 Park Ave, New York",
              lat: lat, 
              lng: lng + 0.007, // ~700m east
              isOpen: true,
              deliveryRadius: 2500, // 2.5km
              phone: "555-987-6543",
              email: "info@centralmed.com"
            },
            {
              id: "pharm3",
              name: "QuickMed Pharmacy",
              address: "789 Broadway, New York",
              lat: lat - 0.003, // ~300m south
              lng: lng - 0.004, // ~400m west
              isOpen: false, // Closed pharmacy
              deliveryRadius: 2000, // 2km
              phone: "555-456-7890",
              email: "help@quickmed.com"
            }
          ];
          
          set({ nearbyPharmacies: mockPharmacies });
          
        } catch (error) {
          console.error("Error fetching nearby pharmacies:", error);
          // Keep existing pharmacies on error
        }
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
