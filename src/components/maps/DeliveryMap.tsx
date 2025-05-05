
import React, { useState } from "react";
import { GoogleMap, useLoadScript, Marker, Circle } from "@react-google-maps/api";

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
  deliveryRadius?: number; // in meters
  height?: string;
  onMapClick?: (location: { lat: number; lng: number }) => void;
}

const DeliveryMap: React.FC<DeliveryMapProps> = ({
  pharmacyLocation,
  customerLocation,
  deliveryRadius = 3000, // Default 3km radius
  height = "400px",
  onMapClick,
}) => {
  const [mapCenter, setMapCenter] = useState(pharmacyLocation || defaultCenter);

  // In a real app, you would use an environment variable or a secret manager
  // for the API key. This is just a placeholder and will need to be replaced.
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY",
    libraries: libraries as any,
  });

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (onMapClick && event.latLng) {
      onMapClick({ 
        lat: event.latLng.lat(), 
        lng: event.latLng.lng() 
      });
    }
  };

  if (loadError) return <div>Error loading maps</div>;
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
          />
        )}
      </GoogleMap>
    </div>
  );
};

export default DeliveryMap;
