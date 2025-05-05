
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import { useLocationStore } from "@/hooks/use-location";
import DeliveryMap from "@/components/maps/DeliveryMap";
import { toast } from "sonner";

// Debounce helper to prevent too many API calls during typing
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const LocationSelector: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const navigate = useNavigate();
  const { userLocation, setUserLocation } = useLocationStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Array<{
    description: string;
    lat: number;
    lng: number;
  }>>([]);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);
  
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  
  // Geocoding function
  useEffect(() => {
    const geocodeAddress = async () => {
      if (debouncedSearchQuery.length < 3) {
        setSearchResults([]);
        return;
      }
      
      try {
        // In a production app, this would be an API call to your backend
        // The backend would use Google's Geocoding API securely
        console.log("Searching for address:", debouncedSearchQuery);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Generate more realistic but still simulated results
        // In a real app, these would come from Google Maps API via your backend
        const simulatedResults = [
          {
            description: `${debouncedSearchQuery}, Main Street`,
            lat: 40.7128 + (Math.random() * 0.02 - 0.01),
            lng: -74.006 + (Math.random() * 0.02 - 0.01)
          },
          {
            description: `${debouncedSearchQuery}, Downtown`,
            lat: 40.7128 + (Math.random() * 0.02 - 0.01),
            lng: -74.006 + (Math.random() * 0.02 - 0.01)
          },
          {
            description: `${debouncedSearchQuery}, Midtown`,
            lat: 40.7128 + (Math.random() * 0.02 - 0.01),
            lng: -74.006 + (Math.random() * 0.02 - 0.01)
          }
        ];
        
        setSearchResults(simulatedResults);
      } catch (error) {
        console.error("Error searching for address:", error);
        toast.error("Error searching for address. Please try again.");
        setSearchResults([]);
      }
    };
    
    geocodeAddress();
  }, [debouncedSearchQuery]);
  
  const selectLocation = (location: { description: string; lat: number; lng: number }) => {
    setSelectedLocation({
      lat: location.lat,
      lng: location.lng,
      address: location.description
    });
    setSearchQuery(location.description);
    setSearchResults([]);
  };
  
  const confirmLocation = () => {
    if (selectedLocation) {
      setUserLocation(selectedLocation);
      toast.success("Delivery location updated");
      
      // After setting location, navigate to home to see nearby pharmacies
      if (window.location.pathname !== '/') {
        navigate('/');
      }
    }
  };
  
  const handleMapClick = async (location: { lat: number; lng: number }) => {
    try {
      // In a real app, this would use reverse geocoding via your backend
      console.log("Reverse geocoding for:", location);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create a mock address based on coordinates
      // In production, this would come from Google's Reverse Geocoding API
      const mockAddress = `Location near ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`;
      
      setSelectedLocation({
        ...location,
        address: mockAddress
      });
      setSearchQuery(mockAddress);
    } catch (error) {
      console.error("Error in reverse geocoding:", error);
      toast.error("Could not determine address for this location");
    }
  };
  
  if (compact) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="h-auto py-1.5 px-2 text-left justify-start">
            <MapPin className="h-4 w-4 mr-2" />
            <div className="truncate">
              {userLocation ? (
                <span className="truncate">{userLocation.address}</span>
              ) : (
                <span className="text-gray-400">Set delivery location</span>
              )}
            </div>
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[80vh] px-0">
          <SheetHeader className="px-4">
            <SheetTitle>Select Delivery Location</SheetTitle>
          </SheetHeader>
          <div className="px-4 py-2">
            <div className="relative">
              <Input
                placeholder="Search for your location"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mb-2"
              />
              {searchResults.length > 0 && (
                <div className="absolute z-10 w-full bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {searchResults.map((result, index) => (
                    <div
                      key={index}
                      className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => selectLocation(result)}
                    >
                      {result.description}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="h-[40vh] w-full mb-4">
            <DeliveryMap
              customerLocation={selectedLocation || userLocation || undefined}
              height="100%"
              onMapClick={handleMapClick}
            />
          </div>
          
          <div className="px-4 pt-2">
            <Button 
              className="w-full" 
              onClick={confirmLocation}
              disabled={!selectedLocation}
            >
              Confirm Location
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }
  
  return (
    <div className="w-full">
      <div className="mb-4">
        <label className="text-sm font-medium mb-1 block">Delivery Location</label>
        <div className="relative">
          <Input
            placeholder="Search for your location"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-2"
          />
          {searchResults.length > 0 && (
            <div className="absolute z-10 w-full bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => selectLocation(result)}
                >
                  {result.description}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="h-[30vh] w-full mb-4">
        <DeliveryMap
          customerLocation={selectedLocation || userLocation || undefined}
          height="100%"
          onMapClick={handleMapClick}
        />
      </div>
      
      <Button 
        className="w-full" 
        onClick={confirmLocation}
        disabled={!selectedLocation}
      >
        Confirm Location
      </Button>
    </div>
  );
};

export default LocationSelector;
