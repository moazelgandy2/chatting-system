export default function NebulaGlow() {
  return (
    <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
      <div className="absolute top-[20%] left-[30%] w-[30%] h-[30%] rounded-full bg-[#4A00E0] blur-[80px]" />
      <div className="absolute bottom-[30%] right-[20%] w-[25%] h-[25%] rounded-full bg-[#8E2DE2] blur-[100px]" />
      <div className="absolute top-[60%] left-[10%] w-[20%] h-[20%] rounded-full bg-[#2E32E2] blur-[70px]" />
      <div className="absolute top-[10%] right-[30%] w-[15%] h-[15%] rounded-full bg-[#E22E8E] blur-[60px]" />
    </div>
  );
}
