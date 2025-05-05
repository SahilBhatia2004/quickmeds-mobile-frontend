
import { create } from 'zustand';
import { toast } from 'sonner';

export interface PaymentMethod {
  id: string;
  type: 'upi' | 'card' | 'cod';
  details: {
    upiId?: string;
    cardNumber?: string;
    holderName?: string;
  };
  isDefault: boolean;
}

interface PaymentState {
  methods: PaymentMethod[];
  processing: boolean;
  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => Promise<boolean>;
  removePaymentMethod: (id: string) => void;
  setDefaultMethod: (id: string) => void;
  processPayment: (amount: number, methodId: string) => Promise<boolean>;
}

export const usePaymentStore = create<PaymentState>()((set, get) => ({
  methods: [],
  processing: false,

  addPaymentMethod: async (method) => {
    try {
      // In a real app, this would make an API call to save the payment method
      // For now, we just add it to the local state
      const newMethod: PaymentMethod = {
        ...method,
        id: `pm_${Date.now()}`,
      };
      
      set((state) => ({
        methods: [
          ...state.methods.map(m => method.isDefault ? { ...m, isDefault: false } : m), 
          newMethod
        ],
      }));
      
      toast.success("Payment method added successfully");
      return true;
    } catch (error) {
      console.error("Failed to add payment method:", error);
      toast.error("Failed to add payment method. Please try again.");
      return false;
    }
  },

  removePaymentMethod: (id) => {
    set((state) => ({
      methods: state.methods.filter((method) => method.id !== id),
    }));
    toast.success("Payment method removed");
  },

  setDefaultMethod: (id) => {
    set((state) => ({
      methods: state.methods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      })),
    }));
  },

  processPayment: async (amount, methodId) => {
    set({ processing: true });
    
    try {
      // Find the selected payment method
      const { methods } = get();
      const method = methods.find(m => m.id === methodId);
      
      if (!method) {
        throw new Error("Payment method not found");
      }
      
      // In a real app, this would make an API call to process the payment
      // Here we simulate a payment process with a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, always succeed
      toast.success(`Payment of ₹${amount.toFixed(2)} processed successfully via ${method.type}`);
      
      set({ processing: false });
      return true;
    } catch (error) {
      console.error("Payment failed:", error);
      toast.error("Payment failed. Please try again.");
      
      set({ processing: false });
      return false;
    }
  }
}));
