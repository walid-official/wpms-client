// Single medicine type
export interface IMedicineValues {
  _id?: string;
  name: string;
  strength?: string;
  manufacturer?: string;
  category?: string;
  batchNumber?: string;
  expiryDate: string;
  mrp: number;
  price: number;
  quantity: number;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

// Backend pagination response (inside data)
export interface IMedicinesData {
  medicines: IMedicineValues[];
  total: number;
  page: number;
  limit: number;
}

// Full API response
export interface IMedicinesResponse {
  data: IMedicinesData;   // actual medicines + pagination info
  message: string;
  statusCode: number;
}