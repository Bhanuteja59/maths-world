'use client';

import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gray-100 animate-pulse">
      <h1 className="text-4xl font-bold mb-6 text-center bg-gray-300 w-1/3 h-10 rounded"></h1>
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="card bg-base-100 shadow-md p-6 rounded-lg">
            <div className="w-1/2 h-6 bg-gray-300 rounded mb-2 mx-auto"></div>
            <div className="w-3/4 h-4 bg-gray-300 rounded mx-auto mb-2"></div>
            <div className="w-full h-10 bg-gray-300 rounded mb-3"></div>
            <div className="flex justify-between mt-3">
              <div className="bg-gray-300 w-24 h-10 rounded"></div>
              <div className="bg-gray-300 w-24 h-10 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
