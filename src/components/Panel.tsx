import React from "react";

export default function Panel({
  children,
  className = "",
}: React.PropsWithChildren<{ className?: string}>) {
  return (
    <div
      className={`rounded-lg bg-black/5 dark:bg-[#0F2B40]/100 p-6 space-y-8 ${className}`}
    >
      {children}
    </div>
  );
}