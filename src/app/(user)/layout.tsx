
import { Navbar } from '@/components/homePage/navbar';
import { UserLayout } from './UserLayout';

export default function UserDashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserLayout>
    <Navbar />
    <div className='min-h-[90vh]'>
      {children}
    </div>

    </UserLayout>;
}
