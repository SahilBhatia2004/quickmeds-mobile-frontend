
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

export interface MedicineItem {
  id: string;
  name: string;
  price: number;
  stock: number;
  lowStock: boolean;
  description?: string;
  category?: string;
  requiresPrescription: boolean;
  vendorId: string;
}

interface InventoryState {
  items: MedicineItem[];
  loading: boolean;
  
  // Actions
  fetchInventory: (vendorId: string) => Promise<void>;
  addMedicine: (item: Omit<MedicineItem, 'id' | 'lowStock'>) => Promise<string>;
  updateMedicine: (id: string, updates: Partial<Omit<MedicineItem, 'id' | 'lowStock'>>) => Promise<boolean>;
  updateStock: (id: string, newStock: number) => Promise<boolean>;
  deleteMedicine: (id: string) => Promise<boolean>;
}

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set, get) => ({
      items: [],
      loading: false,
      
      fetchInventory: async (vendorId: string) => {
        set({ loading: true });
        
        try {
          // In a production app, this would be an API call
          console.log(`Fetching inventory for vendor ${vendorId}`);
          
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // In production, this would come from a server API call
          // For now, return empty array if no inventory exists yet for this vendor
          const existingItems = get().items.filter(item => item.vendorId === vendorId);
          
          if (existingItems.length === 0) {
            // Return empty array - vendor would add their own inventory
            set({ items: [], loading: false });
          } else {
            // Return existing items for this vendor
            set({ items: existingItems, loading: false });
          }
        } catch (error) {
          console.error("Error fetching inventory:", error);
          toast.error("Failed to load inventory. Please try again.");
          set({ loading: false });
        }
      },
      
      addMedicine: async (itemData) => {
        try {
          // In production, this would be an API call
          console.log("Adding new medicine:", itemData);
          
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const id = `med_${Date.now()}`;
          const newItem: MedicineItem = {
            ...itemData,
            id,
            lowStock: itemData.stock < 15
          };
          
          set(state => ({
            items: [...state.items, newItem]
          }));
          
          toast.success("Medicine added to inventory");
          return id;
        } catch (error) {
          console.error("Error adding medicine:", error);
          toast.error("Failed to add medicine. Please try again.");
          throw error;
        }
      },
      
      updateMedicine: async (id, updates) => {
        try {
          // In production, this would be an API call
          console.log(`Updating medicine ${id}:`, updates);
          
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set(state => ({
            items: state.items.map(item => 
              item.id === id 
                ? { 
                    ...item, 
                    ...updates, 
                    lowStock: 'stock' in updates ? updates.stock! < 15 : item.lowStock
                  } 
                : item
            )
          }));
          
          toast.success("Medicine updated successfully");
          return true;
        } catch (error) {
          console.error("Error updating medicine:", error);
          toast.error("Failed to update medicine. Please try again.");
          return false;
        }
      },
      
      updateStock: async (id, newStock) => {
        try {
          // In production, this would be an API call
          console.log(`Updating stock for ${id} to ${newStock}`);
          
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set(state => ({
            items: state.items.map(item => 
              item.id === id 
                ? { ...item, stock: newStock, lowStock: newStock < 15 } 
                : item
            )
          }));
          
          toast.success("Stock updated successfully");
          return true;
        } catch (error) {
          console.error("Error updating stock:", error);
          toast.error("Failed to update stock. Please try again.");
          return false;
        }
      },
      
      deleteMedicine: async (id) => {
        try {
          // In production, this would be an API call
          console.log(`Deleting medicine ${id}`);
          
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set(state => ({
            items: state.items.filter(item => item.id !== id)
          }));
          
          toast.success("Medicine deleted from inventory");
          return true;
        } catch (error) {
          console.error("Error deleting medicine:", error);
          toast.error("Failed to delete medicine. Please try again.");
          return false;
        }
      }
    }),
    {
      name: 'vendor-inventory'
    }
  )
);
