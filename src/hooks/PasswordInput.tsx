"use client";

import { useState } from "react";
import TextInput from "./TextInput";
import { Lock } from "lucide-react";

type PasswordInputProps = {
  name: string;
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
  icon?: React.ElementType;
};

export default function PasswordInput({
  name,
  placeholder,
  value,
  onChange,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="relative w-full">
      <TextInput
        name={name}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        icon={Lock}
      />
      <button
        type="button"
        onClick={() => setShowPassword((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500"
      >
        {showPassword ? "HIDE" : "SHOW"}
      </button>
    </div>
  );
}
