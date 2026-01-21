"use client"
import { Reports } from "@/components/dashboard/reports";
import { ROLE } from "@/constants/role";
import { withRole } from "@/libs";

const ReportsPage = () => {
    return <Reports />
}

export default withRole(ReportsPage, [ROLE.ADMIN, ROLE.MANAGER])