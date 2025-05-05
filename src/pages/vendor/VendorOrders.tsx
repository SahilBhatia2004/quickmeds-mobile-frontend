import React, { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import PageHeader from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Clock, Phone } from "lucide-react";
import { toast } from "sonner";

// Mock order data for development
interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  address: string;
  items: OrderItem[];
  total: number;
  status: 'new' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  createdAt: Date;
  expectedDelivery?: Date;
}

const VendorOrders = () => {
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [pastOrders, setPastOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // In a real app, this would fetch data from an API
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate some mock data
        const now = new Date();
        
        const mockActiveOrders: Order[] = [
          {
            id: "ord123",
            customerName: "John Doe",
            customerPhone: "555-123-4567",
            address: "123 Main St, Apt 4B",
            items: [
              { id: "item1", name: "Paracetamol 500mg", quantity: 2, price: 5.99 },
              { id: "item2", name: "Vitamin C 1000mg", quantity: 1, price: 8.49 }
            ],
            total: 20.47,
            status: 'new',
            createdAt: new Date(now.getTime() - 30 * 60000) // 30 minutes ago
          },
          {
            id: "ord124",
            customerName: "Jane Smith",
            customerPhone: "555-987-6543",
            address: "456 Oak Ave, Building 3",
            items: [
              { id: "item3", name: "Ibuprofen 200mg", quantity: 1, price: 6.99 },
              { id: "item4", name: "Bandages", quantity: 1, price: 4.50 }
            ],
            total: 11.49,
            status: 'preparing',
            createdAt: new Date(now.getTime() - 50 * 60000) // 50 minutes ago
          },
          {
            id: "ord125",
            customerName: "Mike Johnson",
            customerPhone: "555-456-7890",
            address: "789 Pine St",
            items: [
              { id: "item5", name: "Cough Syrup", quantity: 1, price: 12.99 },
              { id: "item6", name: "Thermometer", quantity: 1, price: 15.99 }
            ],
            total: 28.98,
            status: 'out_for_delivery',
            createdAt: new Date(now.getTime() - 85 * 60000), // 85 minutes ago
            expectedDelivery: new Date(now.getTime() + 15 * 60000) // 15 minutes from now
          }
        ];
        
        const mockPastOrders: Order[] = [
          {
            id: "ord119",
            customerName: "Sarah Williams",
            customerPhone: "555-222-3333",
            address: "222 Elm St",
            items: [
              { id: "item7", name: "Antibiotic Cream", quantity: 1, price: 9.99 },
              { id: "item8", name: "Pain Relief Gel", quantity: 1, price: 7.49 }
            ],
            total: 17.48,
            status: 'delivered',
            createdAt: new Date(now.getTime() - 24 * 60 * 60000) // 1 day ago
          },
          {
            id: "ord118",
            customerName: "Robert Brown",
            customerPhone: "555-444-5555",
            address: "333 Maple Rd",
            items: [
              { id: "item9", name: "Blood Pressure Monitor", quantity: 1, price: 45.99 }
            ],
            total: 45.99,
            status: 'delivered',
            createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60000) // 2 days ago
          },
          {
            id: "ord117",
            customerName: "Lisa Davis",
            customerPhone: "555-777-8888",
            address: "444 Cedar Ln",
            items: [
              { id: "item10", name: "Multivitamins", quantity: 1, price: 22.99 },
              { id: "item11", name: "Hand Sanitizer", quantity: 2, price: 3.99 }
            ],
            total: 30.97,
            status: 'cancelled',
            createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60000) // 3 days ago
          }
        ];
        
        setActiveOrders(mockActiveOrders);
        setPastOrders(mockPastOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to load orders. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrders();
    
    // In a real app, you'd have real-time updates via WebSocket or polling
    const interval = setInterval(() => {
      // Simulate a new order coming in
      if (Math.random() > 0.95) { // 5% chance of new order
        const now = new Date();
        const newOrder: Order = {
          id: `ord${Math.floor(Math.random() * 1000)}`,
          customerName: "New Customer",
          customerPhone: "555-999-0000",
          address: "555 New St",
          items: [
            { 
              id: `item${Math.floor(Math.random() * 1000)}`, 
              name: "New Medicine", 
              quantity: Math.floor(Math.random() * 3) + 1, 
              price: parseFloat((Math.random() * 20 + 5).toFixed(2)) 
            }
          ],
          total: parseFloat((Math.random() * 30 + 10).toFixed(2)),
          status: 'new',
          createdAt: new Date()
        };
        
        setActiveOrders(prev => [newOrder, ...prev]);
        toast.success("New order received!");
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    // Update active orders
    setActiveOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus } 
          : order
      ).filter(order => 
        // Keep in active orders if not delivered or cancelled
        !['delivered', 'cancelled'].includes(newStatus) || order.id !== orderId
      )
    );
    
    // If delivered or cancelled, move to past orders
    if (['delivered', 'cancelled'].includes(newStatus)) {
      const orderToMove = activeOrders.find(order => order.id === orderId);
      if (orderToMove) {
        setPastOrders(prev => [
          { ...orderToMove, status: newStatus },
          ...prev
        ]);
      }
    }
    
    toast.success(`Order ${orderId} ${
      newStatus === 'preparing' ? 'is now being prepared' :
      newStatus === 'out_for_delivery' ? 'is out for delivery' :
      newStatus === 'delivered' ? 'has been delivered' :
      'has been cancelled'
    }`);
  };

  const StatusBadge = ({ status }: { status: Order['status'] }) => {
    switch (status) {
      case 'new':
        return <Badge variant="secondary">New</Badge>;
      case 'preparing':
        return <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-300">Preparing</Badge>;
      case 'out_for_delivery':
        return <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-300">Out for delivery</Badge>;
      case 'delivered':
        return <Badge variant="outline" className="bg-green-50 text-green-800 border-green-300">Delivered</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return null;
    }
  };

  const OrderCard = ({ order, allowActions = false }: { order: Order, allowActions?: boolean }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-medium">{order.customerName}</p>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <Phone className="h-3 w-3 mr-1" />
              <span>{order.customerPhone}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              <span>{order.address}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <Clock className="h-3 w-3 mr-1" />
              <span>
                {order.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {' '}
                ({Math.round((new Date().getTime() - order.createdAt.getTime()) / 60000)} min ago)
              </span>
            </div>
          </div>
          <StatusBadge status={order.status} />
        </div>
        
        <div className="mt-3 pt-3 border-t">
          {order.items.map(item => (
            <div key={item.id} className="flex justify-between text-sm mb-1">
              <span>{item.quantity}x {item.name}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between font-medium mt-2 pt-2 border-t">
            <span>Total</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>
        
        {allowActions && (
          <div className="mt-3 pt-3 border-t grid grid-cols-2 gap-2">
            {order.status === 'new' && (
              <>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => updateOrderStatus(order.id, 'cancelled')}
                >
                  Reject
                </Button>
                <Button 
                  className="w-full"
                  onClick={() => updateOrderStatus(order.id, 'preparing')}
                >
                  Accept
                </Button>
              </>
            )}
            
            {order.status === 'preparing' && (
              <Button 
                className="w-full col-span-2"
                onClick={() => updateOrderStatus(order.id, 'out_for_delivery')}
              >
                Mark Out for Delivery
              </Button>
            )}
            
            {order.status === 'out_for_delivery' && (
              <Button 
                className="w-full col-span-2"
                onClick={() => updateOrderStatus(order.id, 'delivered')}
              >
                Mark as Delivered
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <MobileLayout>
      <PageHeader title="Manage Orders" showBackButton />
      
      <Tabs defaultValue="active" className="w-full">
        <div className="px-4 pt-2">
          <TabsList className="w-full">
            <TabsTrigger value="active" className="flex-1">
              Active Orders
              {activeOrders.length > 0 && (
                <span className="ml-2 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {activeOrders.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="past" className="flex-1">Past Orders</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="active" className="p-4 pt-2">
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <Card key={`skeleton-${i}`} className="mb-4">
                <CardContent className="p-4">
                  <div className="h-5 bg-gray-200 rounded w-1/3 mb-3 animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : activeOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No active orders at the moment.
            </div>
          ) : (
            activeOrders.map(order => (
              <OrderCard key={order.id} order={order} allowActions={true} />
            ))
          )}
        </TabsContent>
        
        <TabsContent value="past" className="p-4 pt-2">
          {isLoading ? (
            [...Array(2)].map((_, i) => (
              <Card key={`skeleton-past-${i}`} className="mb-4">
                <CardContent className="p-4">
                  <div className="h-5 bg-gray-200 rounded w-1/3 mb-3 animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : pastOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No past orders to display.
            </div>
          ) : (
            pastOrders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </MobileLayout>
  );
};

export default VendorOrders;
