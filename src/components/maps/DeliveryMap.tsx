
import React, { useState, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker, Circle } from "@react-google-maps/api";
import { toast } from "sonner";

const libraries = ["places"];
const mapContainerStyle = {
  width: "100%",
  height: "100%",
};
const defaultCenter = {
  lat: 40.7128,
  lng: -74.006,
};

interface DeliveryMapProps {
  pharmacyLocation?: { lat: number; lng: number };
  customerLocation?: { lat: number; lng: number };
  deliveryPersonLocation?: { lat: number; lng: number };
  deliveryRadius?: number; // in meters
  height?: string;
  onMapClick?: (location: { lat: number; lng: number }) => void;
}

const DeliveryMap: React.FC<DeliveryMapProps> = ({
  pharmacyLocation,
  customerLocation,
  deliveryPersonLocation,
  deliveryRadius = 3000, // Default 3km radius
  height = "400px",
  onMapClick,
}) => {
  const [mapCenter, setMapCenter] = useState(customerLocation || pharmacyLocation || defaultCenter);
  const [userPosition, setUserPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState<string>("");

  // This would ideally come from an environment variable or be fetched securely
  useEffect(() => {
    // In a real app, fetch this from your backend
    const storedApiKey = localStorage.getItem("google_maps_api_key");
    if (storedApiKey) {
      setGoogleMapsApiKey(storedApiKey);
    } else {
      // For development only - in production, you should never expose API keys in the frontend
      // Instead, create a backend proxy endpoint to handle map requests
      const apiKey = prompt("Please enter your Google Maps API key to continue. In production, this would be configured securely on the server side.");
      if (apiKey) {
        localStorage.setItem("google_maps_api_key", apiKey);
        setGoogleMapsApiKey(apiKey);
      } else {
        toast.error("Google Maps API key is required for location features");
      }
    }
  }, []);
  
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: googleMapsApiKey,
    libraries: libraries as any,
  });

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation && !customerLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserPosition(pos);
          setMapCenter(pos);
        },
        () => {
          console.log("Error: The Geolocation service failed.");
          toast.error("Unable to get your location. Please enable location services.");
        }
      );
    }
  }, [customerLocation]);

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (onMapClick && event.latLng) {
      onMapClick({ 
        lat: event.latLng.lat(), 
        lng: event.latLng.lng() 
      });
    }
  };

  if (loadError) return <div className="p-4 text-center text-red-500">Error loading maps. Please check your internet connection and API key.</div>;
  if (!isLoaded) return <div className="h-full flex items-center justify-center">Loading maps...</div>;

  return (
    <div style={{ height, width: "100%" }}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={mapCenter}
        zoom={14}
        onClick={handleMapClick}
      >
        {pharmacyLocation && (
          <>
            <Marker
              position={pharmacyLocation}
              icon={{
                url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                scaledSize: new window.google.maps.Size(30, 30),
              }}
              title="Pharmacy Location"
            />
            <Circle
              center={pharmacyLocation}
              radius={deliveryRadius}
              options={{
                fillColor: "#73b1e6",
                fillOpacity: 0.15,
                strokeColor: "#3182ce",
                strokeOpacity: 0.8,
                strokeWeight: 2,
              }}
            />
          </>
        )}

        {customerLocation && (
          <Marker
            position={customerLocation}
            icon={{
              url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
              scaledSize: new window.google.maps.Size(30, 30),
            }}
            title="Your Location"
          />
        )}
        
        {deliveryPersonLocation && (
          <Marker
            position={deliveryPersonLocation}
            icon={{
              url: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
              scaledSize: new window.google.maps.Size(30, 30),
            }}
            title="Delivery Person"
          />
        )}
        
        {userPosition && !customerLocation && (
          <Marker
            position={userPosition}
            icon={{
              url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
              scaledSize: new window.google.maps.Size(30, 30),
            }}
            title="Your Current Location"
          />
        )}
      </GoogleMap>
    </div>
  );
};

export default DeliveryMap;
