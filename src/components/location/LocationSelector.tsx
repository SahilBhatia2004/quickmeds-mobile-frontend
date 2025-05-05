
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import { useLocationStore } from "@/hooks/use-location";
import DeliveryMap from "@/components/maps/DeliveryMap";
import { toast } from "sonner";

// Mock location search results - in a real app, this would use the Google Places API
const mockLocationResults = [
  {
    description: "123 Main Street, New York, NY 10001",
    lat: 40.7128,
    lng: -74.006
  },
  {
    description: "456 Broadway, New York, NY 10013",
    lat: 40.7212,
    lng: -74.0123
  },
  {
    description: "789 Park Avenue, New York, NY 10021",
    lat: 40.7681,
    lng: -73.9634
  }
];

interface LocationSelectorProps {
  compact?: boolean;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ compact = false }) => {
  const navigate = useNavigate();
  const { userLocation, setUserLocation } = useLocationStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<typeof mockLocationResults>([]);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      // In a real app, this would call the Google Places API
      setSearchResults(
        mockLocationResults.filter(result => 
          result.description.toLowerCase().includes(query.toLowerCase())
        )
      );
    } else {
      setSearchResults([]);
    }
  };
  
  const selectLocation = (location: typeof mockLocationResults[0]) => {
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
    }
  };
  
  const handleMapClick = (location: { lat: number; lng: number }) => {
    // In a real app, we would use reverse geocoding to get the address
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
