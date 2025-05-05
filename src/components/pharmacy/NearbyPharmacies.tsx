
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock } from "lucide-react";
import { useLocationStore, isWithinDeliveryRadius } from '@/hooks/use-location';

const NearbyPharmacies = () => {
  const { userLocation, nearbyPharmacies } = useLocationStore();
  const [availablePharmacies, setAvailablePharmacies] = useState([]);

  useEffect(() => {
    if (userLocation) {
      const pharmaciesInRange = nearbyPharmacies
        .filter(pharmacy => 
          isWithinDeliveryRadius(
            userLocation.lat,
            userLocation.lng,
            pharmacy.lat,
            pharmacy.lng,
            pharmacy.deliveryRadius
          )
        )
        .map(pharmacy => {
          // Calculate distance in kilometers with proper type handling
          const distanceInMeters = isWithinDeliveryRadius(
            userLocation.lat,
            userLocation.lng,
            pharmacy.lat,
            pharmacy.lng,
            Infinity
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
    }
  }, [userLocation, nearbyPharmacies]);

  if (!userLocation || availablePharmacies.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <h2 className="font-semibold text-lg mb-2">Nearby Pharmacies</h2>
      <div className="space-y-3">
        {availablePharmacies.map((pharmacy) => (
          <Card key={pharmacy.id}>
            <CardContent className="p-3">
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NearbyPharmacies;
