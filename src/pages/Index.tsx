
import React from "react";
import { Search, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CategoryItem, medicineCategories } from "@/data/categories";
import { useCategoryProducts, usePopularProducts } from "@/hooks/use-products";
import { toast } from "sonner";
import { useAddressStore } from "@/hooks/use-address";

const Index = () => {
  const navigate = useNavigate();
  const popularProducts = usePopularProducts();
  const { selectedAddress } = useAddressStore();
  
  const handleProductClick = (id: string) => {
    navigate(`/product/${id}`);
  };

  const handleShowAddress = () => {
    navigate('/address');
  };

  const handleViewAll = (category: string) => {
    navigate(`/category/${category}`);
  };

  const handleSearchClick = () => {
    navigate('/search');
  };

  return (
    <MobileLayout>
      {/* Header with address and search */}
      <div className="p-4 space-y-3 bg-white sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-xs text-gray-500">Deliver to</div>
            <button 
              onClick={handleShowAddress}
              className="flex items-center text-sm font-medium"
            >
              <MapPin size={16} className="mr-1 text-primary" />
              {selectedAddress ? (
                <span className="line-clamp-1">{selectedAddress.label}: {selectedAddress.address.split(',')[0]}</span>
              ) : (
                <span>Set delivery address</span>
              )}
              <span className="ml-1 text-primary">▼</span>
            </button>
          </div>
          <Badge 
            className="bg-medical-100 text-medical-700 hover:bg-medical-100"
          >
            10 min delivery
          </Badge>
        </div>
        
        <button 
          onClick={handleSearchClick}
          className="flex items-center w-full rounded-full bg-gray-100 p-3 text-gray-500"
        >
          <Search size={18} className="mr-2" />
          <span className="text-sm">Search for medicines...</span>
        </button>
      </div>
      
      {/* Main content */}
      <div className="flex-1 pb-4">
        {/* Hero banner */}
        <div className="bg-medical-50 p-4 mb-4">
          <div className="rounded-lg bg-medical-100 p-4">
            <h2 className="text-xl font-bold text-medical-700">
              First delivery free
            </h2>
            <p className="text-sm text-medical-600 mb-3">
              Use code QUICKMED10 for free delivery
            </p>
            <Button 
              size="sm" 
              className="bg-medical-600 hover:bg-medical-700"
            >
              Order now
            </Button>
          </div>
        </div>
        
        {/* Categories */}
        <div className="px-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Categories</h2>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {medicineCategories.slice(0, 4).map((category) => (
              <CategoryButton 
                key={category.id}
                category={category}
                onClick={() => navigate(`/category/${category.id}`)}
              />
            ))}
          </div>
          <div className="grid grid-cols-4 gap-3 mt-3">
            {medicineCategories.slice(4, 8).map((category) => (
              <CategoryButton 
                key={category.id}
                category={category}
                onClick={() => navigate(`/category/${category.id}`)}
              />
            ))}
          </div>
        </div>
        
        {/* Popular medicines */}
        <div className="mb-6">
          <div className="px-4 flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Popular medicines</h2>
            <button 
              className="text-sm text-primary font-medium"
              onClick={() => handleViewAll('popular')}
            >
              View all
            </button>
          </div>
          <div className="flex overflow-x-auto scrollbar-hide gap-3 pl-4">
            {popularProducts.map((product) => (
              <ProductCard 
                key={product.id}
                product={product}
                onClick={() => handleProductClick(product.id)}
              />
            ))}
          </div>
        </div>
        
        {/* Daily essentials */}
        <div className="mb-6">
          <div className="px-4 flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Daily essentials</h2>
            <button 
              className="text-sm text-primary font-medium"
              onClick={() => handleViewAll('essentials')}
            >
              View all
            </button>
          </div>
          <div className="flex overflow-x-auto scrollbar-hide gap-3 pl-4">
            {useCategoryProducts('essentials').map((product) => (
              <ProductCard 
                key={product.id}
                product={product}
                onClick={() => handleProductClick(product.id)}
              />
            ))}
          </div>
        </div>
        
        {/* Offers */}
        <div className="px-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Special offers</h2>
          </div>
          <div 
            className="bg-gradient-to-r from-medical-100 to-blue-50 p-4 rounded-lg"
            onClick={() => {
              toast.success("Promo code copied to clipboard!");
            }}
          >
            <h3 className="font-bold text-base mb-1">20% OFF your first order</h3>
            <p className="text-sm text-gray-700 mb-2">Use code: <span className="font-semibold">WELCOME20</span></p>
            <p className="text-xs text-gray-500">Valid until May 30, 2025</p>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

interface CategoryButtonProps {
  category: CategoryItem;
  onClick: () => void;
}

const CategoryButton = ({ category, onClick }: CategoryButtonProps) => {
  return (
    <button 
      className="flex flex-col items-center justify-center p-2 bg-white rounded-lg border border-gray-200 hover:border-primary"
      onClick={onClick}
    >
      <div className="w-10 h-10 bg-medical-50 rounded-full flex items-center justify-center mb-1">
        {category.icon || "💊"}
      </div>
      <span className="text-xs text-center line-clamp-1">{category.name}</span>
    </button>
  );
};

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
    discountPrice?: number;
  };
  onClick: () => void;
}

const ProductCard = ({ product, onClick }: ProductCardProps) => {
  return (
    <div 
      className="w-36 shrink-0 bg-white rounded-lg border border-gray-200 overflow-hidden"
      onClick={onClick}
    >
      <div className="h-36 bg-gray-100 flex items-center justify-center">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-2xl">💊</div>
        )}
      </div>
      <div className="p-2">
        <h3 className="font-medium text-sm line-clamp-2 h-10">{product.name}</h3>
        <div className="mt-1 flex items-center">
          {product.discountPrice ? (
            <>
              <span className="font-semibold text-sm">${product.discountPrice.toFixed(2)}</span>
              <span className="ml-1 text-xs text-gray-500 line-through">${product.price.toFixed(2)}</span>
            </>
          ) : (
            <span className="font-semibold text-sm">${product.price.toFixed(2)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
