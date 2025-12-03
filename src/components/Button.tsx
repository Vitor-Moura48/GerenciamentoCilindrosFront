import React, { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  icon?: React.ElementType;
  variant?: 'primary' | 'secondary';
};

export default function Button({
  children,
  icon: Icon,
  variant = 'primary',
  className,
  ...props
}: ButtonProps) {
  const baseClasses = "px-4 py-2 rounded-lg font-semibold text-sm inline-flex items-center justify-center transition-colors";
  
  const variantClasses = {
    primary: "bg-[#0F2B40] text-white hover:bg-[#1A4A6F] disabled:bg-[#526A7A]",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-100",
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      <span>{children}</span>
      {Icon && (
        <span aria-hidden="true" className="ml-2">
          <Icon size={18} />
        </span>
      )}
    </button>
  );
}

