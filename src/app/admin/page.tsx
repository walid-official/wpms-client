"use client"

import { AdminPanel } from '@/components/dashboard/admin/adminPanel';
import { ROLE } from '@/constants/role';
import { withRole } from '@/libs';
import React from 'react';

const AdminPage = () => {
  return (
    <div>
      <AdminPanel />
    </div>
  );
};

export default withRole(AdminPage, [ROLE.ADMIN, ROLE.MANAGER]);