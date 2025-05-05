
import React from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import MobileLayout from "@/components/layout/MobileLayout";
import PageHeader from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";

const CartPage = () => {
  const navigate = useNavigate();
  const { 
    items, 
    total, 
    removeItem, 
    updateQuantity,
    clearCart,
    itemCount
  } = useCart();
  
  const deliveryFee = total > 0 ? 2.99 : 0;
  const grandTotal = total + deliveryFee;
  
  const handleCheckout = () => {
    navigate('/checkout');
  };
  
  const handleContinueShopping = () => {
    navigate('/');
  };
  
  if (items.length === 0) {
    return (
      <MobileLayout>
        <PageHeader title="Your Cart" showBackButton />
        <div className="flex flex-col items-center justify-center h-96 p-4 text-center">
          <div className="text-5xl mb-4">🛒</div>
          <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add items to your cart to get started</p>
          <Button onClick={handleContinueShopping}>Continue Shopping</Button>
        </div>
      </MobileLayout>
    );
  }
  
  return (
    <MobileLayout>
      <PageHeader 
        title="Your Cart" 
        showBackButton
        rightElement={
          <button 
            onClick={clearCart}
            className="text-sm text-gray-500 flex items-center"
          >
            <Trash2 size={16} className="mr-1" />
            Clear
          </button>
        }
      />
      
      <div className="flex flex-col pb-40">
        {/* Cart items */}
        <div className="p-4 divide-y divide-gray-200">
          {items.map((item) => {
            const { product, quantity } = item;
            const itemPrice = (product.discountPrice || product.price) * quantity;
            
            return (
              <div key={product.id} className="py-3 flex">
                <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded-md mr-3">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  ) : (
                    <div className="text-xl">💊</div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium text-sm line-clamp-2">{product.name}</h3>
                    <button 
                      className="text-gray-400 p-1"
                      onClick={() => removeItem(product.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  {product.dosage && (
                    <p className="text-xs text-gray-500">{product.dosage}</p>
                  )}
                  
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center border rounded-md">
                      <button
                        className="w-7 h-7 flex items-center justify-center text-gray-500"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                      >
                        -
                      </button>
                      <span className="w-7 text-center text-sm">{quantity}</span>
                      <button
                        className="w-7 h-7 flex items-center justify-center text-gray-500"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold">${itemPrice.toFixed(2)}</p>
                      {product.discountPrice && (
                        <p className="text-xs text-gray-500 line-through">
                          ${(product.price * quantity).toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Checkout summary - fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t safe-area-bottom">
        <div className="p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal ({itemCount} items)</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Delivery Fee</span>
            <span>${deliveryFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold pt-2 border-t">
            <span>Total</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>
          
          <Button 
            className="w-full mt-3"
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default CartPage;
