import Logo from "./Logo";

export default function LeftPanel() {
  return (
    <aside
      className="flex flex-col 
        items-center
        bg-gradient-to-b
        from-[#0F2B40]
        via-[#0F2B40]
        to-[#0F0C29] gap-y-9 w-1/3"
    >
      <Logo />
      <h2 className="text-3xl font-bold text-center text-white">
        Conectando
        <br />
        Tecnologia e Vida
      </h2>
    </aside>
  );
}
