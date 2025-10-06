"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Eye,
  Package,
  Truck,
  CheckCircle,
  Clock,
  DollarSign,
  User,
  MapPin,
  Phone,
  Mail,
  MoreHorizontal,
  ArrowRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  status:
    | "new"
    | "payment_received"
    | "processing"
    | "delivered_to_agent"
    | "delivered";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  totalAmount: number;
  items: OrderItem[];
  shippingAddress: Address;
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
  notes?: string;
}

interface OrderItem {
  id: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  total: number;
}

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "1",
      orderNumber: "ORD-001",
      customerName: "Sarah Johnson",
      customerEmail: "sarah.johnson@email.com",
      customerPhone: "+1 (555) 123-4567",
      status: "processing",
      paymentStatus: "paid",
      totalAmount: 299.0,
      items: [
        {
          id: "1",
          productName: "Classic Leather Wallet",
          productImage: "/assets/images/leather1.jpg",
          quantity: 1,
          price: 299.0,
          total: 299.0,
        },
      ],
      shippingAddress: {
        street: "123 Main St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA",
      },
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-15T14:20:00Z",
      trackingNumber: "TRK123456789",
    },
    {
      id: "2",
      orderNumber: "ORD-002",
      customerName: "Mike Chen",
      customerEmail: "mike.chen@email.com",
      customerPhone: "+1 (555) 987-6543",
      status: "delivered_to_agent",
      paymentStatus: "paid",
      totalAmount: 149.5,
      items: [
        {
          id: "2",
          productName: "Minimalist Cardholder",
          productImage: "/assets/images/leather2.jpg",
          quantity: 1,
          price: 149.5,
          total: 149.5,
        },
      ],
      shippingAddress: {
        street: "456 Oak Ave",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90210",
        country: "USA",
      },
      createdAt: "2024-01-14T09:15:00Z",
      updatedAt: "2024-01-16T11:45:00Z",
      trackingNumber: "TRK987654321",
    },
    {
      id: "3",
      orderNumber: "ORD-003",
      customerName: "Emily Davis",
      customerEmail: "emily.davis@email.com",
      status: "new",
      paymentStatus: "pending",
      totalAmount: 89.99,
      items: [
        {
          id: "3",
          productName: "Luxury Key Holder",
          productImage: "/assets/images/leather5.jpg",
          quantity: 1,
          price: 89.99,
          total: 89.99,
        },
      ],
      shippingAddress: {
        street: "789 Pine St",
        city: "Chicago",
        state: "IL",
        zipCode: "60601",
        country: "USA",
      },
      createdAt: "2024-01-16T16:20:00Z",
      updatedAt: "2024-01-16T16:20:00Z",
    },
    {
      id: "4",
      orderNumber: "ORD-004",
      customerName: "David Wilson",
      customerEmail: "david.wilson@email.com",
      customerPhone: "+1 (555) 456-7890",
      status: "delivered",
      paymentStatus: "paid",
      totalAmount: 199.0,
      items: [
        {
          id: "4",
          productName: "Premium Watch Strap",
          productImage: "/assets/images/leather6.jpg",
          quantity: 1,
          price: 199.0,
          total: 199.0,
        },
      ],
      shippingAddress: {
        street: "321 Elm St",
        city: "Miami",
        state: "FL",
        zipCode: "33101",
        country: "USA",
      },
      createdAt: "2024-01-12T08:45:00Z",
      updatedAt: "2024-01-18T15:30:00Z",
      trackingNumber: "TRK456789123",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);

  const statusConfig = {
    new: {
      variant: "secondary" as const,
      label: "New Order",
      icon: Clock,
      color: "text-gray-600",
    },
    payment_received: {
      variant: "default" as const,
      label: "Payment Received",
      icon: DollarSign,
      color: "text-green-600",
    },
    processing: {
      variant: "default" as const,
      label: "Processing",
      icon: Package,
      color: "text-blue-600",
    },
    delivered_to_agent: {
      variant: "default" as const,
      label: "Delivered to Agent",
      icon: Truck,
      color: "text-orange-600",
    },
    delivered: {
      variant: "default" as const,
      label: "Delivered",
      icon: CheckCircle,
      color: "text-green-600",
    },
  };

  const paymentStatusConfig = {
    pending: { variant: "secondary" as const, label: "Pending" },
    paid: { variant: "default" as const, label: "Paid" },
    failed: { variant: "destructive" as const, label: "Failed" },
    refunded: { variant: "outline" as const, label: "Refunded" },
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: newStatus as Order["status"],
              updatedAt: new Date().toISOString(),
            }
          : order
      )
    );
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.new;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const config =
      paymentStatusConfig[status as keyof typeof paymentStatusConfig] ||
      paymentStatusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getNextStatus = (currentStatus: string) => {
    const statusFlow = [
      "new",
      "payment_received",
      "processing",
      "delivered_to_agent",
      "delivered",
    ];
    const currentIndex = statusFlow.indexOf(currentStatus);
    return currentIndex < statusFlow.length - 1
      ? statusFlow[currentIndex + 1]
      : null;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
        <p className="text-gray-600">Track and manage customer orders</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New Order</SelectItem>
                <SelectItem value="payment_received">
                  Payment Received
                </SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="delivered_to_agent">
                  Delivered to Agent
                </SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders ({filteredOrders.length})</CardTitle>
          <CardDescription>
            Manage customer orders and track fulfillment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">
                          {order.orderNumber}
                        </div>
                        {order.trackingNumber && (
                          <div className="text-sm text-gray-500">
                            Tracking: {order.trackingNumber}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">
                          {order.customerName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.customerEmail}
                        </div>
                        {order.customerPhone && (
                          <div className="text-sm text-gray-500">
                            {order.customerPhone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Image
                          src={order.items[0].productImage}
                          alt={order.items[0].productName}
                          width={32}
                          height={32}
                          className="h-8 w-8 rounded object-cover"
                        />
                        <div>
                          <div className="text-sm font-medium">
                            {order.items[0].productName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.items.length > 1 &&
                              `+${order.items.length - 1} more`}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      ${order.totalAmount.toFixed(2)}
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>
                      {getPaymentStatusBadge(order.paymentStatus)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleViewOrder(order)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          {getNextStatus(order.status) && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusUpdate(
                                  order.id,
                                  getNextStatus(order.status)!
                                )
                              }
                            >
                              <ArrowRight className="h-4 w-4 mr-2" />
                              Move to{" "}
                              {
                                statusConfig[
                                  getNextStatus(
                                    order.status
                                  ) as keyof typeof statusConfig
                                ]?.label
                              }
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Order Details - {selectedOrder?.orderNumber}
            </DialogTitle>
            <DialogDescription>
              Complete order information and tracking details
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Status */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Order Status</h3>
                  <div className="flex items-center space-x-2 mt-2">
                    {getStatusBadge(selectedOrder.status)}
                    {getPaymentStatusBadge(selectedOrder.paymentStatus)}
                  </div>
                </div>
                {getNextStatus(selectedOrder.status) && (
                  <Button
                    onClick={() => {
                      handleStatusUpdate(
                        selectedOrder.id,
                        getNextStatus(selectedOrder.status)!
                      );
                      setIsOrderDialogOpen(false);
                    }}
                  >
                    Move to{" "}
                    {
                      statusConfig[
                        getNextStatus(
                          selectedOrder.status
                        ) as keyof typeof statusConfig
                      ]?.label
                    }
                  </Button>
                )}
              </div>

              {/* Customer Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">
                        {selectedOrder.customerName}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {selectedOrder.customerEmail}
                      </span>
                    </div>
                    {selectedOrder.customerPhone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {selectedOrder.customerPhone}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Shipping Address</h4>
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                      <div className="text-sm text-gray-600">
                        <div>{selectedOrder.shippingAddress.street}</div>
                        <div>
                          {selectedOrder.shippingAddress.city},{" "}
                          {selectedOrder.shippingAddress.state}{" "}
                          {selectedOrder.shippingAddress.zipCode}
                        </div>
                        <div>{selectedOrder.shippingAddress.country}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-4 p-3 border rounded-lg"
                    >
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded object-cover"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{item.productName}</div>
                        <div className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          ${item.price.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600">
                          Total: ${item.total.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total Amount</span>
                    <span>${selectedOrder.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Order Timeline */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Order Timeline</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <div className="text-sm font-medium">Order Created</div>
                      <div className="text-xs text-gray-500">
                        {new Date(selectedOrder.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  {selectedOrder.status !== "new" && (
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <div className="text-sm font-medium">
                          Payment Received
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(selectedOrder.updatedAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  )}
                  {selectedOrder.status === "processing" && (
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div>
                        <div className="text-sm font-medium">Processing</div>
                        <div className="text-xs text-gray-500">In progress</div>
                      </div>
                    </div>
                  )}
                  {selectedOrder.status === "delivered_to_agent" && (
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <div>
                        <div className="text-sm font-medium">
                          Delivered to Agent
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(selectedOrder.updatedAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  )}
                  {selectedOrder.status === "delivered" && (
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <div className="text-sm font-medium">Delivered</div>
                        <div className="text-xs text-gray-500">
                          {new Date(selectedOrder.updatedAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
