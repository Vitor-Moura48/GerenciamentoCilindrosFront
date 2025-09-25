import React, { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  icon?: React.ElementType;
};

export default function Button({
  children,
  icon: Icon,
  ...props
}: ButtonProps) {
  return (
    <button {...props}>
      <span>{children}</span>
      <span aria-hidden></span>
      {Icon && (
        <span aria-hidden="true" className="ml-2">
          <Icon size={18} />
        </span>
      )}
    </button>
  );
}
