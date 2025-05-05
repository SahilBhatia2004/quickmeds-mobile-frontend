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

// Start with empty pharmacies - they will be fetched from API
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
          // In a production app, this would be an API call to your backend
          console.log(`Fetching pharmacies near ${lat}, ${lng}`);
          
          // Simulate a network request to get nearby pharmacies
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // This would be replaced with real API data from your backend
          // The backend would query pharmacies within the specified radius
          // For now, we generate random nearby locations to simulate real data
          const pharmacies: PharmacyLocation[] = Array.from({ length: 3 + Math.floor(Math.random() * 4) }, (_, i) => {
            // Create random offsets (at most 0.01 degrees, roughly 1km)
            const latOffset = (Math.random() * 0.01) * (Math.random() > 0.5 ? 1 : -1);
            const lngOffset = (Math.random() * 0.01) * (Math.random() > 0.5 ? 1 : -1);
            
            // Random delivery radius between 1km and 5km
            const deliveryRadius = Math.floor(Math.random() * 4000) + 1000;
            
            return {
              id: `pharm${i+1}_${Date.now()}`,
              name: `Pharmacy ${i+1}`,
              address: `${Math.floor(Math.random() * 1000) + 1} Street Name, City`,
              lat: lat + latOffset,
              lng: lng + lngOffset,
              isOpen: Math.random() > 0.2, // 80% chance of being open
              deliveryRadius: deliveryRadius,
              phone: `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
              email: `pharmacy${i+1}@example.com`
            };
          });
          
          set({ nearbyPharmacies: pharmacies });
          
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
