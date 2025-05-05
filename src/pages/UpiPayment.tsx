
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import PageHeader from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { usePaymentStore } from "@/hooks/use-payment";
import { toast } from "sonner";

const UpiPayment = () => {
  const navigate = useNavigate();
  const { total, clearCart } = useCart();
  const { processPayment } = usePaymentStore();
  const [upiId, setUpiId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (!upiId) {
      toast.error("Please enter a UPI ID");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // In a real app, this would use the UPI payment gateway
      // For demo, we'll simulate a successful payment after a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`Payment of ₹${total.toFixed(2)} processed successfully via UPI`);
      
      // Clear cart and redirect to order confirmation
      clearCart();
      navigate('/order-confirmation');
    } catch (error) {
      console.error("Payment failed:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <MobileLayout>
      <PageHeader title="UPI Payment" showBackButton />
      
      <div className="p-4 space-y-4">
        <div className="p-4 border rounded-lg bg-gray-50">
          <h3 className="font-medium mb-1">Order Total</h3>
          <p className="text-2xl font-bold">₹{total.toFixed(2)}</p>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-medium">Enter UPI Details</h3>
          
          <div>
            <label htmlFor="upi" className="text-sm text-gray-500 mb-1 block">UPI ID</label>
            <Input
              id="upi"
              placeholder="username@upi"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">Example: name@okicici, name@okhdfc</p>
          </div>
          
          <Button
            className="w-full"
            disabled={isProcessing || !upiId}
            onClick={handlePayment}
          >
            {isProcessing ? "Processing..." : "Pay Now"}
          </Button>
        </div>
        
        <Separator />
        
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-2">Other Payment Methods</p>
          <Button 
            variant="outline" 
            className="w-full mb-2"
            onClick={() => navigate('/payment-methods/card')}
          >
            Pay with Card
          </Button>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate('/checkout')}
          >
            Cash on Delivery
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default UpiPayment;
