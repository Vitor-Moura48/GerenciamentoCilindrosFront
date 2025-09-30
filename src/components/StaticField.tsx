export default function StaticField({ 
    label,
    value, 
}: { label?: string; value?: string}) {
  return (
    <div className="flex flex-col gap-1">
        <p className="text-sm text-gray-500">{label}</p>

        <div className={`w-full rounded-md border px-3 py-4 bg-transparent`}>
        <span>{value ?? "-"}</span>
        </div>
    </div>
  );
}