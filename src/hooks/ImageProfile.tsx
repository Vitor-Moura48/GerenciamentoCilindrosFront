import Image from "next/image";
import { Pencil } from "lucide-react";

export default function ImageProfile({
    src = "/profile.png",
    size = 80,
    editable = false,
}: {
    src?: string;
    size?: number;
    editable?: boolean; 
}) {
    return (
        <div className="relative w-max mx-auto">
            <Image
                src={src}
                alt="Profile Image"
                width={size}
                height={size}
                className="rounded-full mx-auto"
                />
            
            {editable && (
                <button
                    type="button"
                    className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow"
                    >
                    <Pencil className="w-4 h-4 text-gray-600" />
                </button>
            )}
        </div>
    );
}
