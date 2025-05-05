
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProductById } from "@/hooks/use-products";
import { useCart } from "@/hooks/use-cart";
import { useLocationStore, isWithinDeliveryRadius } from "@/hooks/use-location";
import MobileLayout from "@/components/layout/MobileLayout";
import PageHeader from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, MapPin } from "lucide-react";
import { toast } from "sonner";

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const product = useProductById(productId);
  const { addItem } = useCart();
  const navigate = useNavigate();
  const { userLocation, nearbyPharmacies } = useLocationStore();
  
  const [quantity, setQuantity] = useState(1);
  const [availablePharmacies, setAvailablePharmacies] = useState<string[]>([]);
  
  // Check which pharmacies have this product available
  useEffect(() => {
    if (product && userLocation) {
      // In a real app, this would be a backend API call
      // For now, we'll simulate by randomly determining availability
      const pharmaciesWithProduct = nearbyPharmacies
        .filter(pharmacy => 
          // Only include open pharmacies
          pharmacy.isOpen && 
          // Check if user is within delivery radius
          isWithinDeliveryRadius(
            userLocation.lat, 
            userLocation.lng, 
            pharmacy.lat, 
            pharmacy.lng, 
            pharmacy.deliveryRadius
          )
        )
        .map(pharmacy => pharmacy.name);
      
      setAvailablePharmacies(pharmaciesWithProduct);
    }
  }, [product, userLocation, nearbyPharmacies]);
  
  if (!product) {
    return (
      <MobileLayout>
        <PageHeader title="Product Not Found" showBackButton />
        <div className="flex items-center justify-center h-64">
          <p>Sorry, this product could not be found.</p>
        </div>
      </MobileLayout>
    );
  }
  
  const handleAddToCart = () => {
    if (!userLocation) {
      toast.error("Please set your delivery location first");
      navigate("/address");
      return;
    }
    
    if (availablePharmacies.length === 0) {
      toast.error("This product is not available at any nearby pharmacy");
      return;
    }
    
    addItem(product, quantity);
  };
  
  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change));
  };
  
  const isAvailable = availablePharmacies.length > 0;
  
  return (
    <MobileLayout>
      <PageHeader 
        title={product.name}
        showBackButton
      />
      
      <div className="pb-24">
        {/* Product Image */}
        <div className="h-64 bg-gray-100 flex items-center justify-center">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full object-contain"
            />
          ) : (
            <div className="text-5xl">💊</div>
          )}
        </div>
        
        {/* Product Info */}
        <div className="p-4">
          <h1 className="text-2xl font-semibold mb-1">{product.name}</h1>
          
          {product.manufacturer && (
            <p className="text-sm text-gray-500 mb-2">By {product.manufacturer}</p>
          )}
          
          <div className="flex items-center space-x-2 mb-4">
            {product.requiresPrescription && (
              <Badge variant="outline" className="border-red-500 text-red-500">
                Prescription Required
              </Badge>
            )}
            
            {product.dosage && (
              <Badge variant="outline">{product.dosage}</Badge>
            )}
            
            <Badge 
              className={isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
            >
              {isAvailable ? "Available Nearby" : "Not Available Nearby"}
            </Badge>
          </div>
          
          <div className="flex items-baseline mb-4">
            {product.discountPrice ? (
              <>
                <span className="text-2xl font-bold">${product.discountPrice.toFixed(2)}</span>
                <span className="ml-2 text-gray-500 line-through">${product.price.toFixed(2)}</span>
                <span className="ml-2 text-green-600 text-sm">
                  {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% off
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
            )}
          </div>
          
          {userLocation && (
            <div className="flex items-center text-sm text-gray-600 mb-4">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="truncate">{userLocation.address}</span>
            </div>
          )}
          
          {availablePharmacies.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-1">Available at:</h3>
              <div className="text-sm text-gray-600">
                {availablePharmacies.map((pharmacy, index) => (
                  <div key={index} className="flex items-center mb-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    {pharmacy}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="mb-6">
            <h2 className="font-medium mb-1">Description</h2>
            <p className="text-sm text-gray-700">{product.description}</p>
          </div>
          
          {isAvailable && (
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Quantity</h3>
              <div className="flex items-center mb-4">
                <button
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="mx-4 w-8 text-center">{quantity}</span>
                <button
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                  onClick={() => handleQuantityChange(1)}
                >
                  +
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t shadow-md safe-area-bottom">
        {product.requiresPrescription ? (
          <div className="space-y-2">
            <p className="text-sm text-red-600 mb-1">Prescription required for this medication</p>
            <Button 
              className="w-full"
              onClick={() => navigate('/upload-prescription')}
              disabled={!isAvailable}
            >
              Upload Prescription
            </Button>
          </div>
        ) : (
          <Button 
            className="w-full flex items-center justify-center"
            onClick={handleAddToCart}
            disabled={!isAvailable}
          >
            <ShoppingCart className="mr-2" size={18} />
            {isAvailable ? "Add to Cart" : "Not Available Nearby"}
          </Button>
        )}
      </div>
    </MobileLayout>
  );
};

export default ProductDetail;
