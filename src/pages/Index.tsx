
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import PageHeader from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { SearchIcon, ShoppingCart } from "lucide-react";
import { usePopularProducts } from "@/hooks/use-products";
import { useCart } from "@/hooks/use-cart";
import LocationSelector from "@/components/location/LocationSelector";
import NearbyPharmacies from "@/components/pharmacy/NearbyPharmacies";
import { useLocationStore } from "@/hooks/use-location";

const Index = () => {
  const navigate = useNavigate();
  const popularProducts = usePopularProducts();
  const { itemCount } = useCart();
  const { userLocation } = useLocationStore();

  return (
    <MobileLayout>
      <PageHeader
        title="QuickMeds"
        action={
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => navigate("/cart")}
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground w-4 h-4 rounded-full flex items-center justify-center text-xs">
                {itemCount}
              </div>
            )}
          </Button>
        }
      />

      <div className="p-4">
        {/* Location selector */}
        <LocationSelector compact />

        {/* Search bar */}
        <div 
          className="mt-4 flex items-center border rounded-lg p-2 cursor-pointer"
          onClick={() => navigate("/search")}
        >
          <SearchIcon className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-gray-400">Search for medicines...</span>
        </div>

        {/* Nearby Pharmacies */}
        <NearbyPharmacies />

        {/* Popular Products */}
        {userLocation && (
          <div className="mt-6">
            <h2 className="font-semibold text-lg mb-2">Popular Medicines</h2>
            <div className="grid grid-cols-2 gap-3">
              {popularProducts.map((product) => (
                <div
                  key={product.id}
                  className="border rounded-md p-3 cursor-pointer"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <div className="h-24 bg-gray-100 rounded mb-2 flex items-center justify-center">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full object-contain"
                      />
                    ) : (
                      <div className="text-3xl">💊</div>
                    )}
                  </div>
                  <h3 className="font-medium text-sm mb-1 line-clamp-1">
                    {product.name}
                  </h3>
                  <div className="flex items-baseline">
                    {product.discountPrice ? (
                      <>
                        <span className="font-bold">${product.discountPrice.toFixed(2)}</span>
                        <span className="text-xs text-gray-500 line-through ml-1">
                          ${product.price.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="font-bold">${product.price.toFixed(2)}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default Index;
