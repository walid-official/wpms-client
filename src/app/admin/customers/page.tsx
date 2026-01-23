"use client";
import { CustomersList } from "@/components/customers/CustomersList";
import { ROLE } from "@/constants/role";
import { withRole } from "@/libs";

const CustomersPage = () => {
  return <CustomersList />;
};

export default withRole(CustomersPage, [ROLE.ADMIN, ROLE.MANAGER]);
