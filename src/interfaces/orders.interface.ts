// interfaces/orders.interface.ts

export interface UserInfo {
  name: string;
  phone: string;
}

export interface MedicineInfo {
  _id: string;
  name: string;
}

export interface OrderItem {
  _id: string;
  medicineId: MedicineInfo;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  _id: string;
  user: UserInfo;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  grandTotal: number;
  loyaltyPointsEarned: number;
  loyaltyPointsUsed: number;
  createdAt: string;
  updatedAt: string;
  invoiceUrl?: string;
}

export interface MetaData {
  page: number;
  limit: number;
  totalPage: number;
  total: number;
}

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  meta?: MetaData;
  data: T;
}

/* Create Order */
export interface CreateOrderRequest {
  userId: string;
  items: {
    medicineId: string;
    quantity: number;
  }[];
  discount?: number;
}

export interface CreateOrderResponseData {
  orderId: string;
}
