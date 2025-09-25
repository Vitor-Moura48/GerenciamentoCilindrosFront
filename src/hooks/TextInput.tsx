"use client";

import React from "react";

type Props = {
  name: string;
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
  type?: string;
  icon?: React.ElementType;
};

export default function TextInput({
  name,
  placeholder,
  value,
  onChange,
  type = "text",
  icon: Icon,
}: Props) {
  return (
    <div className="relative">
      {Icon && (
        <div
          className="absolute 
          inset-y-0 
          left-0 
          flex 
          items-center 
          pl-3 
          text-gray-400 
          dark:text-gray-500 
          pointer-events-none"
        >
          <Icon size={20} />
        </div>
      )}
      <input
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={`
          w-full border border-gray-700 dark:border-gray-600 p-4 rounded-sm
          focus:outline-none focus:ring-2
          ${Icon ? "pl-12" : "pl-4"}
        `}
      />
    </div>
  );
}
