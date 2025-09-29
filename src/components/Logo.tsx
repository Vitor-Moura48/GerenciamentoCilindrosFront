import Image from "next/image";

interface LogoProps {
  width: number;
  height: number;
}

export default function Logo({ width, height }: LogoProps) {
  return (
    <div>
      <Image
        src="/logo oxitech.svg"
        alt="Logo Oxitech"
        width={width}
        height={height}
      />
    </div>
  );
}
