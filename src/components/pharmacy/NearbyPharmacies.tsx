
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocationStore, calculateDistance } from '@/hooks/use-location';
import { toast } from 'sonner';

const NearbyPharmacies = () => {
  const navigate = useNavigate();
  const { userLocation, nearbyPharmacies, selectPharmacy } = useLocationStore();
  const [availablePharmacies, setAvailablePharmacies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userLocation) {
      setIsLoading(true);
      
      // Filter pharmacies within delivery radius and calculate distance
      const pharmaciesInRange = nearbyPharmacies
        .filter(pharmacy => 
          calculateDistance(
            userLocation.lat,
            userLocation.lng,
            pharmacy.lat,
            pharmacy.lng
          ) <= pharmacy.deliveryRadius
        )
        .map(pharmacy => {
          // Calculate distance in kilometers with proper type handling
          const distanceInMeters = calculateDistance(
            userLocation.lat, 
            userLocation.lng, 
            pharmacy.lat, 
            pharmacy.lng
          );
          
          // Convert to km with one decimal place
          const distanceInKm = Math.round((distanceInMeters / 1000) * 10) / 10;
          
          return {
            ...pharmacy,
            distance: distanceInKm
          };
        })
        .sort((a, b) => a.distance - b.distance);

      setAvailablePharmacies(pharmaciesInRange);
      setIsLoading(false);
    }
  }, [userLocation, nearbyPharmacies]);

  const handleSelectPharmacy = (pharmacyId: string) => {
    selectPharmacy(pharmacyId);
    toast.success("Pharmacy selected! You can now browse available medicines.");
    navigate('/search');
  };

  if (!userLocation) {
    return (
      <div className="mt-4">
        <Card>
          <CardContent className="p-4 text-center">
            <MapPin className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <h3 className="font-medium mb-1">No location selected</h3>
            <p className="text-sm text-gray-500 mb-3">
              Please set your delivery location to see nearby pharmacies
            </p>
            <Button onClick={() => navigate('/address/new')}>
              Set Location
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mt-4">
        <h2 className="font-semibold text-lg mb-2">Nearby Pharmacies</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={`skeleton-${i}`}>
              <CardContent className="p-3">
                <div className="flex justify-between items-start">
                  <div className="w-full">
                    <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mt-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3 mt-2 animate-pulse"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (availablePharmacies.length === 0) {
    return (
      <div className="mt-4">
        <h2 className="font-semibold text-lg mb-2">Nearby Pharmacies</h2>
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="font-medium mb-1">No pharmacies found</h3>
            <p className="text-sm text-gray-500">
              There are no pharmacies delivering to your location
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h2 className="font-semibold text-lg mb-2">Nearby Pharmacies</h2>
      <div className="space-y-3">
        {availablePharmacies.map((pharmacy: any) => (
          <Card key={pharmacy.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{pharmacy.name}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{pharmacy.distance}km away</span>
                    </div>
                  </div>
                  <div className={`px-2 py-1 text-xs rounded-full ${
                    pharmacy.isOpen 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {pharmacy.isOpen ? "Open" : "Closed"}
                  </div>
                </div>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>Delivers within {Math.round(pharmacy.deliveryRadius/1000)}km</span>
                </div>
                
                {pharmacy.phone && (
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <Phone className="h-3 w-3 mr-1" />
                    <span>{pharmacy.phone}</span>
                  </div>
                )}
              </div>
              
              <Button 
                className="w-full rounded-t-none"
                variant={pharmacy.isOpen ? "default" : "secondary"}
                disabled={!pharmacy.isOpen}
                onClick={() => handleSelectPharmacy(pharmacy.id)}
              >
                {pharmacy.isOpen ? "Order From This Pharmacy" : "Currently Closed"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NearbyPharmacies;
