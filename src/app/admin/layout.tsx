import { Navbar } from '@/components/homePage/navbar';
import { AdminLayout } from './AdminLayout';

export default function UserDashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>
    <Navbar />
    <div className='min-h-[90vh]'>
      {children}
    </div>
    </AdminLayout>;
}
