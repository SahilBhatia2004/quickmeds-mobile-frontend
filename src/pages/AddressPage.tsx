
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Plus, Check, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAddressStore } from '@/hooks/use-address';
import MobileLayout from '@/components/layout/MobileLayout';

const AddressPage = () => {
  const navigate = useNavigate();
  const { addresses, addAddress, setDefaultAddress, selectedAddress } = useAddressStore();
  const [newAddress, setNewAddress] = useState({
    label: '',
    address: '',
    details: '',
    isDefault: addresses.length === 0,
  });
  
  const [isAdding, setIsAdding] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const handleAddAddress = () => {
    if (!newAddress.label || !newAddress.address) return;
    
    const addressData = {
      id: Date.now().toString(),
      label: newAddress.label,
      address: newAddress.address,
      details: newAddress.details,
      isDefault: newAddress.isDefault || addresses.length === 0,
    };
    
    addAddress(addressData);
    setIsAdding(false);
    setNewAddress({
      label: '',
      address: '',
      details: '',
      isDefault: false,
    });
  };

  const handleSelectAddress = (addressId: string) => {
    setDefaultAddress(addressId);
    navigate(-1);
  };
  
  return (
    <MobileLayout hideNavigation>
      <div className="px-4 py-3 border-b flex items-center">
        <button 
          onClick={handleBack}
          className="mr-3"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold flex-1">Delivery Addresses</h1>
      </div>
      
      <div className="p-4">
        {!isAdding ? (
          <>
            <div className="mb-6">
              <h2 className="font-medium mb-3">Your Addresses</h2>
              {addresses.length > 0 ? (
                <div className="space-y-3">
                  {addresses.map((address) => (
                    <div 
                      key={address.id}
                      className={`border rounded-lg p-3 ${address.isDefault ? 'border-primary bg-blue-50' : ''}`}
                      onClick={() => handleSelectAddress(address.id)}
                    >
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">{address.label}</h3>
                          <p className="text-sm text-gray-600 mt-1">{address.address}</p>
                          {address.details && (
                            <p className="text-sm text-gray-500 mt-1">{address.details}</p>
                          )}
                        </div>
                        {address.isDefault && (
                          <span className="h-6 w-6 bg-primary rounded-full flex items-center justify-center">
                            <Check size={14} className="text-white" />
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <MapPin size={24} className="text-gray-500" />
                  </div>
                  <p className="text-gray-600">No addresses saved yet</p>
                </div>
              )}
            </div>
            
            <Button 
              onClick={() => setIsAdding(true)} 
              className="w-full flex items-center justify-center"
            >
              <Plus size={16} className="mr-2" />
              Add New Address
            </Button>
          </>
        ) : (
          <div className="space-y-4">
            <h2 className="font-medium">Add New Address</h2>
            
            <div className="space-y-2">
              <Label htmlFor="label">Address Label (e.g. Home, Work)</Label>
              <Input
                id="label"
                value={newAddress.label}
                onChange={(e) => setNewAddress({...newAddress, label: e.target.value})}
                placeholder="Home"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={newAddress.address}
                onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                placeholder="123 Main St, Apt 4"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="details">Additional Details (Optional)</Label>
              <Input
                id="details"
                value={newAddress.details}
                onChange={(e) => setNewAddress({...newAddress, details: e.target.value})}
                placeholder="Building entrance code, landmark, etc."
              />
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="isDefault"
                checked={newAddress.isDefault || addresses.length === 0}
                onChange={(e) => setNewAddress({...newAddress, isDefault: e.target.checked})}
                className="rounded text-primary focus:ring-primary"
                disabled={addresses.length === 0}
              />
              <Label htmlFor="isDefault" className="cursor-pointer">
                Set as default address
                {addresses.length === 0 && <span className="text-sm text-gray-500 ml-2">(First address is automatically set as default)</span>}
              </Label>
            </div>
            
            <div className="pt-4 flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setIsAdding(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddAddress}
                className="flex-1"
                disabled={!newAddress.label || !newAddress.address}
              >
                Save Address
              </Button>
            </div>
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default AddressPage;
