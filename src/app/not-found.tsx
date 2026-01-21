import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center px-4 py-24 text-center lg:flex-row lg:text-left'>
      <div className='mt-8 w-full lg:mt-0 lg:w-1/2'>
        <h1 className='text-3xl font-bold text-heading dark:text-heading-dark'>
          {`Oops! This page doesn't exist.`}
        </h1>
        <p className='mt-4 text-lg text-heading dark:text-heading-dark'>
          {`The page you are looking for might have been removed or is temporarily unavailable.`}
        </p>
        <Link href='/'>
          <button className='mt-6 rounded bg-primary-300 px-8 py-4 text-center text-white hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50'>
            {`Go Home`}
          </button>
        </Link>
      </div>
    </div>
  );
}
