import React from 'react';


export const UserLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className=''>
      <div className='w-full'>{children}</div>
    </div>
  );
};
