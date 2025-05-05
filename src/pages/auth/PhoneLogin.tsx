
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import PageHeader from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

interface PhoneLoginProps {
  isVendor?: boolean;
}

const PhoneLogin: React.FC<PhoneLoginProps> = ({ isVendor = false }) => {
  const navigate = useNavigate();
  const { sendOTP, verifyOTP, isLoading } = useAuth();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    
    const success = await sendOTP(phoneNumber, isVendor);
    if (success) {
      setStep("otp");
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 4) {
      toast.error("Please enter a valid OTP");
      return;
    }
    
    const success = await verifyOTP(phoneNumber, otp, isVendor);
    if (success) {
      if (isVendor) {
        navigate("/vendor/dashboard");
      } else {
        navigate("/address/new");
      }
    }
  };

  return (
    <MobileLayout>
      <PageHeader 
        title={isVendor ? "Pharmacy Login" : "Customer Login"} 
        showBackButton 
      />
      
      <div className="p-4">
        {step === "phone" ? (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="text-lg"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "Sending OTP..." : "Send OTP"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="otp" className="text-sm font-medium">Enter OTP sent to {phoneNumber}</label>
              <div className="flex justify-center mb-4">
                <InputOTP 
                  value={otp} 
                  onChange={setOtp} 
                  maxLength={4}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </Button>
            
            <Button 
              type="button" 
              variant="ghost" 
              className="w-full" 
              onClick={() => setStep("phone")}
              disabled={isLoading}
            >
              Change Phone Number
            </Button>
          </form>
        )}
      </div>
    </MobileLayout>
  );
};

export default PhoneLogin;
