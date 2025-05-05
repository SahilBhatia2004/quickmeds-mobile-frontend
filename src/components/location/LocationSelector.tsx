
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import { useLocationStore } from "@/hooks/use-location";
import DeliveryMap from "@/components/maps/DeliveryMap";
import { toast } from "sonner";

// We'll replace mock data with real-time geocoding in production
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
  
  // Geocoding function (using Google Maps Geocoding API)
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      try {
        // In production, this will use Google Maps Geocoding API
        // For now, we'll simulate results for development
        console.log("Searching for address:", query);
        
        // Simulated results for development
        const mockResults = [
          {
            description: `${query} - Location 1`,
            lat: 40.7128 + (Math.random() * 0.02 - 0.01),
            lng: -74.006 + (Math.random() * 0.02 - 0.01)
          },
          {
            description: `${query} - Location 2`,
            lat: 40.7128 + (Math.random() * 0.02 - 0.01),
            lng: -74.006 + (Math.random() * 0.02 - 0.01)
          }
        ];
        
        setSearchResults(mockResults);
      } catch (error) {
        console.error("Error searching for address:", error);
        toast.error("Error searching for address. Please try again.");
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };
  
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
  
  const handleMapClick = (location: { lat: number; lng: number }) => {
    // In production, we would use reverse geocoding to get the address
    const mockAddress = `Location at ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`;
    setSelectedLocation({
      ...location,
      address: mockAddress
    });
    setSearchQuery(mockAddress);
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
                onChange={(e) => handleSearch(e.target.value)}
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
            onChange={(e) => handleSearch(e.target.value)}
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
