
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Address {
  id: string;
  label: string;
  address: string;
  details?: string;
  isDefault: boolean;
}

interface AddressStore {
  addresses: Address[];
  selectedAddress: Address | null;
  addAddress: (address: Address) => void;
  removeAddress: (addressId: string) => void;
  updateAddress: (addressId: string, address: Partial<Address>) => void;
  setDefaultAddress: (addressId: string) => void;
}

export const useAddressStore = create<AddressStore>()(
  persist(
    (set) => ({
      addresses: [],
      selectedAddress: null,
      
      addAddress: (address) => 
        set((state) => {
          // If this is set as default or it's the first address, update all others
          const updatedAddresses = address.isDefault 
            ? state.addresses.map(addr => ({
                ...addr,
                isDefault: false
              }))
            : [...state.addresses];
          
          // Add the new address
          const newAddresses = [...updatedAddresses, address];
          
          // Set selected address if this is the first or is default
          const newSelectedAddress = address.isDefault || state.addresses.length === 0 
            ? address 
            : state.selectedAddress;
            
          return {
            addresses: newAddresses,
            selectedAddress: newSelectedAddress
          };
        }),
      
      removeAddress: (addressId) =>
        set((state) => {
          const newAddresses = state.addresses.filter(a => a.id !== addressId);
          
          // If we removed the selected/default address, select another one if available
          let newSelectedAddress = state.selectedAddress;
          if (state.selectedAddress?.id === addressId) {
            const defaultAddress = newAddresses.find(a => a.isDefault);
            newSelectedAddress = defaultAddress || newAddresses[0] || null;
            
            // Ensure the new selected address is marked as default
            if (newSelectedAddress) {
              newAddresses.forEach(address => {
                if (address.id === newSelectedAddress?.id) {
                  address.isDefault = true;
                }
              });
            }
          }
          
          return {
            addresses: newAddresses,
            selectedAddress: newSelectedAddress
          };
        }),
      
      updateAddress: (addressId, updatedFields) =>
        set((state) => {
          const updatedAddresses = state.addresses.map(addr => 
            addr.id === addressId 
              ? { ...addr, ...updatedFields } 
              : addr
          );
          
          // If this updated address is now the default, update others
          if (updatedFields.isDefault) {
            updatedAddresses.forEach(addr => {
              if (addr.id !== addressId) {
                addr.isDefault = false;
              }
            });
          }
          
          // Update selected address if needed
          let newSelectedAddress = state.selectedAddress;
          const updatedAddress = updatedAddresses.find(a => a.id === addressId);
          
          if (updatedFields.isDefault && updatedAddress) {
            newSelectedAddress = updatedAddress;
          } else if (state.selectedAddress?.id === addressId && updatedAddress) {
            newSelectedAddress = updatedAddress;
          }
          
          return {
            addresses: updatedAddresses,
            selectedAddress: newSelectedAddress
          };
        }),
      
      setDefaultAddress: (addressId) =>
        set((state) => {
          const updatedAddresses = state.addresses.map(addr => ({
            ...addr,
            isDefault: addr.id === addressId
          }));
          
          const selectedAddress = updatedAddresses.find(addr => addr.id === addressId) || null;
          
          return {
            addresses: updatedAddresses,
            selectedAddress
          };
        }),
    }),
    {
      name: 'address-storage'
    }
  )
);
