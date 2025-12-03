"use client";

import React from "react";
import Button from "./Button";
import { X } from "lucide-react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
};

export default function Modal({ isOpen, onClose, children, title }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <Button
          onClick={onClose}
          className="absolute top-4 right-4 !p-2 text-gray-500 hover:text-gray-800 bg-transparent hover:bg-gray-100"
          variant="secondary"
        >
          <X size={20}/>
        </Button>
        {title && <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">{title}</h2>}
        {children}
      </div>
    </div>
  );
}
