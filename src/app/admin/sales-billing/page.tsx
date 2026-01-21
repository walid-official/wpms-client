"use client"
import { PharmacyBilling } from '@/components/dashboard/admin/pharmacy-billing';
import { ROLE } from '@/constants/role';
import { withRole } from '@/libs/auth/WithRole';
import React from 'react';

const SalesBilling = () => {
    return (
        <div>
            <PharmacyBilling />
        </div>
    );
};

export default withRole(SalesBilling, [ROLE.ADMIN, ROLE.MANAGER]);