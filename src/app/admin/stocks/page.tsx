"use client"
import { StockDashboard } from '@/components/dashboard/stock';
import { ROLE } from '@/constants/role';
import { withRole } from '@/libs';
import React from 'react';

const StocksPage = () => {
    return <StockDashboard />
};

export default withRole(StocksPage, [ROLE.ADMIN])