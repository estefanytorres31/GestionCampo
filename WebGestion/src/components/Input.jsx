import React, { forwardRef } from "react";

export const Input = forwardRef(
  ({ placeholder, iconLeft, className, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {iconLeft && (
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
            {iconLeft}
          </span>
        )}
        <input
          ref={ref} // <-- Pasamos la referencia al input
          className={`border rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring w-full ${className}`}
          placeholder={placeholder}
          {...props}
        />
      </div>
    );
  }
);
