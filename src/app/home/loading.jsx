import React from 'react';

const Loading = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-100 p-6">
      {/* Navbar Skeleton */}
      <div className="w-full max-w-6xl flex justify-between items-center p-4 bg-white shadow-md rounded-lg animate-pulse">
        <div className="skeleton h-8 w-32"></div>
        <div className="flex gap-4">
          <div className="skeleton h-8 w-20"></div>
          <div className="skeleton h-8 w-20"></div>
          <div className="skeleton h-8 w-20"></div>
        </div>
      </div>

      {/* Hero Section Skeleton */}
      <div className="mt-10 w-full max-w-4xl flex flex-col items-center text-center gap-4">
        <div className="skeleton h-10 w-60"></div>
        <div className="skeleton h-6 w-96"></div>
        <div className="skeleton h-12 w-40 rounded-lg"></div>
      </div>

      {/* Level Selection Skeleton */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <div className="skeleton h-14 w-full rounded-lg"></div>
        <div className="skeleton h-14 w-full rounded-lg"></div>
        <div className="skeleton h-14 w-full rounded-lg"></div>
      </div>

      {/* Services Section Skeleton */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
        <div className="skeleton h-40 w-full rounded-lg"></div>
        <div className="skeleton h-40 w-full rounded-lg"></div>
        <div className="skeleton h-40 w-full rounded-lg"></div>
      </div>

      {/* Footer Skeleton */}
      <div className="mt-16 w-full max-w-6xl skeleton h-12"></div>
    </div>
  );
};

export default Loading;