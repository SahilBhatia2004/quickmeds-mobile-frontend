
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

export interface DeliveryPerson {
  id: string;
  name: string;
  phone: string;
  currentLocation?: {
    lat: number;
    lng: number;
  };
  rating?: number;
}

export interface OrderStatus {
  id: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  estimatedDelivery?: Date;
  pharmacyId: string;
  pharmacyName: string;
  pharmacyLocation: {
    lat: number;
    lng: number;
  };
  deliveryLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  deliveryPerson?: DeliveryPerson;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
}

interface OrderTrackingState {
  activeOrders: OrderStatus[];
  pastOrders: OrderStatus[];
  addOrder: (order: Omit<OrderStatus, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateOrderStatus: (orderId: string, status: OrderStatus['status']) => void;
  assignDeliveryPerson: (orderId: string, deliveryPerson: DeliveryPerson) => void;
  updateDeliveryLocation: (orderId: string, location: { lat: number; lng: number }) => void;
}

export const useOrderTracking = create<OrderTrackingState>()(
  persist(
    (set, get) => ({
      activeOrders: [],
      pastOrders: [],
      
      addOrder: (orderData) => {
        const orderId = `order_${Date.now()}`;
        const now = new Date();
        
        const newOrder: OrderStatus = {
          id: orderId,
          createdAt: now,
          updatedAt: now,
          ...orderData
        };
        
        set(state => ({
          activeOrders: [newOrder, ...state.activeOrders]
        }));
        
        return orderId;
      },
      
      updateOrderStatus: (orderId, status) => {
        const { activeOrders, pastOrders } = get();
        
        // Find the order in active orders
        const order = activeOrders.find(o => o.id === orderId);
        
        if (!order) {
          console.error(`Order ${orderId} not found`);
          return;
        }
        
        const updatedOrder: OrderStatus = {
          ...order,
          status,
          updatedAt: new Date()
        };
        
        // If delivered or cancelled, move to past orders
        if (status === 'delivered' || status === 'cancelled') {
          set({
            activeOrders: activeOrders.filter(o => o.id !== orderId),
            pastOrders: [updatedOrder, ...pastOrders]
          });
          
          if (status === 'delivered') {
            toast.success('Order delivered successfully!');
          } else {
            toast.error('Order has been cancelled.');
          }
        } else {
          set({
            activeOrders: activeOrders.map(o => 
              o.id === orderId ? updatedOrder : o
            )
          });
          
          toast.success(`Order status updated to: ${status.replace('_', ' ')}`);
        }
      },
      
      assignDeliveryPerson: (orderId, deliveryPerson) => {
        const { activeOrders } = get();
        
        set({
          activeOrders: activeOrders.map(o => 
            o.id === orderId 
              ? { ...o, deliveryPerson, updatedAt: new Date() } 
              : o
          )
        });
        
        toast.success(`${deliveryPerson.name} has been assigned to your order.`);
      },
      
      updateDeliveryLocation: (orderId, location) => {
        const { activeOrders } = get();
        
        set({
          activeOrders: activeOrders.map(o => 
            o.id === orderId && o.deliveryPerson
              ? { 
                  ...o, 
                  deliveryPerson: {
                    ...o.deliveryPerson,
                    currentLocation: location
                  },
                  updatedAt: new Date() 
                } 
              : o
          )
        });
      }
    }),
    {
      name: 'order-tracking'
    }
  )
);

// Simulate real-time updates for demo purposes
// In a real app, this would use WebSockets or similar technology
let simulationInterval: number | undefined;

export const startOrderSimulation = (orderId: string) => {
  const { activeOrders, updateOrderStatus, assignDeliveryPerson, updateDeliveryLocation } = useOrderTracking.getState();
  
  const order = activeOrders.find(o => o.id === orderId);
  if (!order) return;
  
  // Clear any existing simulation
  if (simulationInterval) {
    clearInterval(simulationInterval);
  }
  
  let step = 0;
  
  // Simulate order progress
  simulationInterval = window.setInterval(() => {
    step++;
    
    switch(step) {
      case 1:
        // Order confirmed
        updateOrderStatus(orderId, 'confirmed');
        break;
      
      case 3:
        // Order being prepared
        updateOrderStatus(orderId, 'preparing');
        break;
      
      case 6:
        // Assign delivery person
        const deliveryPerson: DeliveryPerson = {
          id: `dp_${Date.now()}`,
          name: `Delivery Partner ${Math.floor(Math.random() * 100)}`,
          phone: `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
          rating: 4 + Math.random()
        };
        assignDeliveryPerson(orderId, deliveryPerson);
        break;
      
      case 8:
        // Out for delivery
        updateOrderStatus(orderId, 'out_for_delivery');
        break;
      
      case 9:
      case 10:
      case 11:
      case 12:
        // Update delivery person location
        const updatedOrder = useOrderTracking.getState().activeOrders.find(o => o.id === orderId);
        if (updatedOrder?.deliveryPerson && updatedOrder.pharmacyLocation && updatedOrder.deliveryLocation) {
          // Calculate a position partway between pharmacy and delivery location
          const progress = (step - 8) / 5; // 0.2, 0.4, 0.6, 0.8
          const lat = updatedOrder.pharmacyLocation.lat + (updatedOrder.deliveryLocation.lat - updatedOrder.pharmacyLocation.lat) * progress;
          const lng = updatedOrder.pharmacyLocation.lng + (updatedOrder.deliveryLocation.lng - updatedOrder.pharmacyLocation.lng) * progress;
          
          updateDeliveryLocation(orderId, { lat, lng });
        }
        break;
      
      case 13:
        // Delivered
        updateOrderStatus(orderId, 'delivered');
        clearInterval(simulationInterval);
        break;
    }
  }, 8000); // Update every 8 seconds
  
  return () => {
    if (simulationInterval) {
      clearInterval(simulationInterval);
    }
  };
};
