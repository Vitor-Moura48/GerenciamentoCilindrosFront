import Panel from "@/components/Panel";

export default function InfoItem({
  label = "",
  value = "",

  label2 = "",
  value2 = "",
  className = "",
}: React.PropsWithChildren<{ label?: string, value?: string, label2?: string, value2?: string, className?: string }>) {
  return (
    <div 
      className={`flex flex-row gap-0.5 items-center mb-0 ${className}`}>

        <div>
          <div className={`bg-[#0F2B40] dark:bg-[#0F2B40]/100 p-0.5 text-center w-full rounded-l-lg`}>
            <span className="text-white mx-2" >{label}</span> <br />
          </div>
          <span className="text-center block mx-4" >{value}</span>
        </div>
        
        <div>
          <div className={`bg-[#0F2B40] dark:bg-[#0F2B40]/100 p-0.5 text-center w-full rounded-r-lg`}>
            <span className="text-white mx-2" >{label2}</span> <br />
          </div>
          <span className=" text-center block mx-4" >{value2}</span>
        </div>

    </div>
  );
}