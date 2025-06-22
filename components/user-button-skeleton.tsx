import React from "react";

export default function UserButtonSkeleton() {
  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
      <div className="flex items-center gap-3 animate-pulse">
        <div className="w-8 h-8 bg-gray-700 rounded-full" />
        <div className="flex-1 min-w-0">
          <div className="h-4 bg-gray-700 rounded w-1/2 mb-1" />
          <div className="h-3 bg-gray-600 rounded w-3/4" />
        </div>
      </div>
    </div>
  );
}