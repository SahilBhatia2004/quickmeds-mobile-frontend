
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '@/components/layout/MobileLayout';
import PageHeader from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useCart } from '@/hooks/use-cart';
import { Clock, MapPin, CreditCard, Banknote } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { total, items, clearCart } = useCart();
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const deliveryFee = total > 0 ? 2.99 : 0;
  const grandTotal = total + deliveryFee;

  // Example addresses (in a real app, these would come from a backend)
  const addresses = [
    { id: '1', label: 'Home', address: '123 Main St, Apt 4, New York, NY 10001', isDefault: true },
    { id: '2', label: 'Work', address: '456 Office Ave, Suite 200, New York, NY 10002', isDefault: false },
  ];

  const [selectedAddress, setSelectedAddress] = useState(addresses[0].id);

  const handleAddressSelect = (id: string) => {
    setSelectedAddress(id);
  };

  const handlePlaceOrder = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      // Order success
      clearCart();
      navigate('/order-confirmation');
      setIsProcessing(false);
    }, 1500);
  };

  const handleAddNewAddress = () => {
    navigate('/address/new');
  };

  return (
    <MobileLayout hideNavigation>
      <PageHeader title="Checkout" showBackButton />
      
      <div className="pb-32">
        {/* Delivery Address Section */}
        <section className="p-4 border-b">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold flex items-center">
              <MapPin size={16} className="mr-2" />
              Delivery Address
            </h2>
            <button 
              className="text-sm text-primary"
              onClick={handleAddNewAddress}
            >
              + Add New
            </button>
          </div>
          
          <div className="space-y-2">
            {addresses.map((address) => (
              <div 
                key={address.id}
                className={`border rounded-lg p-3 ${selectedAddress === address.id ? 'border-primary bg-blue-50' : ''}`}
                onClick={() => handleAddressSelect(address.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">
                      {address.label} 
                      {address.isDefault && (
                        <span className="ml-2 px-1 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                          Default
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{address.address}</p>
                  </div>
                  <RadioGroupItem 
                    value={address.id} 
                    id={`address-${address.id}`} 
                    checked={selectedAddress === address.id}
                    className="mt-1"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Delivery Time */}
        <section className="p-4 border-b">
          <h2 className="font-semibold flex items-center mb-3">
            <Clock size={16} className="mr-2" />
            Delivery Time
          </h2>
          
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-center">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <Clock size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Express Delivery</h3>
              <p className="text-sm text-gray-600">Within 10 minutes</p>
            </div>
          </div>
        </section>
        
        {/* Payment Method */}
        <section className="p-4 border-b">
          <h2 className="font-semibold flex items-center mb-3">
            <CreditCard size={16} className="mr-2" />
            Payment Method
          </h2>
          
          <RadioGroup 
            value={paymentMethod} 
            onValueChange={setPaymentMethod}
            className="space-y-2"
          >
            <div className={`border rounded-lg p-3 ${paymentMethod === 'card' ? 'border-primary bg-blue-50' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-md bg-gray-100 flex items-center justify-center mr-3">
                    <CreditCard size={16} />
                  </div>
                  <div>
                    <Label htmlFor="card" className="font-medium">Credit/Debit Card</Label>
                  </div>
                </div>
                <RadioGroupItem value="card" id="card" />
              </div>
            </div>
            
            <div className={`border rounded-lg p-3 ${paymentMethod === 'cash' ? 'border-primary bg-blue-50' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-md bg-gray-100 flex items-center justify-center mr-3">
                    <Banknote size={16} />
                  </div>
                  <div>
                    <Label htmlFor="cash" className="font-medium">Cash on Delivery</Label>
                  </div>
                </div>
                <RadioGroupItem value="cash" id="cash" />
              </div>
            </div>
          </RadioGroup>
        </section>
        
        {/* Have a promo code? */}
        <section className="p-4 border-b">
          <h2 className="font-semibold mb-3">Promo Code</h2>
          <div className="flex">
            <Input 
              placeholder="Enter promo code" 
              className="rounded-r-none"
            />
            <Button 
              variant="outline" 
              className="rounded-l-none border-l-0"
            >
              Apply
            </Button>
          </div>
        </section>
        
        {/* Order summary */}
        <section className="p-4">
          <h2 className="font-semibold mb-3">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Items ({items.length})</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t flex justify-between font-semibold">
              <span>Total</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </section>
      </div>
      
      {/* Checkout button - fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-md safe-area-bottom">
        <Button 
          onClick={handlePlaceOrder} 
          className="w-full"
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : `Pay $${grandTotal.toFixed(2)}`}
        </Button>
      </div>
    </MobileLayout>
  );
};

export default CheckoutPage;
