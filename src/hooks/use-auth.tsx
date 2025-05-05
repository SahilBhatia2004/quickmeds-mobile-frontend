
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

interface User {
  id: string;
  phoneNumber: string;
  name?: string;
  isVendor: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  sendOTP: (phoneNumber: string, isVendor: boolean) => Promise<boolean>;
  verifyOTP: (phoneNumber: string, otp: string, isVendor: boolean) => Promise<boolean>;
  logout: () => void;
  updateUserInfo: (info: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for existing session on load
  useEffect(() => {
    const storedUser = localStorage.getItem("quickmeds_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
      }
    }
    setIsLoading(false);
  }, []);

  // Update localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("quickmeds_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("quickmeds_user");
    }
  }, [user]);

  // In a real app, this would call your backend API to send an OTP
  const sendOTP = async (phoneNumber: string, isVendor: boolean): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // In a real app, this would be an API call to your backend
      // For now, we'll simulate a successful OTP send
      console.log(`Sending OTP to ${phoneNumber} for ${isVendor ? "vendor" : "user"}`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`OTP sent to ${phoneNumber}`);
      return true;
    } catch (error) {
      console.error("Failed to send OTP:", error);
      toast.error("Failed to send OTP. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // In a real app, this would verify the OTP with your backend
  const verifyOTP = async (phoneNumber: string, otp: string, isVendor: boolean): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // In a real app, this would be an API call to your backend
      // For now, we'll simulate verification with any 4-digit OTP
      console.log(`Verifying OTP ${otp} for ${phoneNumber}`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo, any 4-digit OTP works
      if (otp.length === 4 && /^\d+$/.test(otp)) {
        const newUser: User = {
          id: `user_${Date.now()}`,
          phoneNumber,
          isVendor
        };
        
        setUser(newUser);
        toast.success("Successfully authenticated!");
        return true;
      } else {
        toast.error("Invalid OTP. Please try again.");
        return false;
      }
    } catch (error) {
      console.error("Failed to verify OTP:", error);
      toast.error("Failed to verify OTP. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    toast.success("Successfully logged out");
  };

  const updateUserInfo = (info: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...info };
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, sendOTP, verifyOTP, logout, updateUserInfo }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
