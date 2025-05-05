
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProductById } from "@/hooks/use-products";
import { useCart } from "@/hooks/use-cart";
import MobileLayout from "@/components/layout/MobileLayout";
import PageHeader from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const product = useProductById(productId);
  const { addItem } = useCart();
  const navigate = useNavigate();
  
  const [quantity, setQuantity] = React.useState(1);
  
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
    addItem(product, quantity);
    // Optionally navigate to cart
    // navigate('/cart');
  };
  
  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change));
  };
  
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
              className={product.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
            >
              {product.inStock ? "In Stock" : "Out of Stock"}
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
          
          <div className="mb-6">
            <h2 className="font-medium mb-1">Description</h2>
            <p className="text-sm text-gray-700">{product.description}</p>
          </div>
          
          {product.inStock && (
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
            >
              Upload Prescription
            </Button>
          </div>
        ) : (
          <Button 
            className="w-full flex items-center justify-center"
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            <ShoppingCart className="mr-2" size={18} />
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </Button>
        )}
      </div>
    </MobileLayout>
  );
};

export default ProductDetail;
