import Image from "next/image";

export default function Logo() {
  return (
    <div>
      <Image
        src="/logo oxitech.svg"
        alt="Logo Oxitech"
        width={300}
        height={300}
      />
    </div>
  );
}
