const SkeletonCard = () => {
  return (
    <div className="animate-pulse bg-[#101013] border border-[#27272A] rounded-md h-[200px] w-[600px] flex flex-col">
      <div className="flex p-4">
        <div className="rounded-full bg-[#27272A] w-[130px] h-[130px]" />
        <div className="ml-4 flex flex-col justify-between">
          <div className="h-6 bg-[#27272A] w-[200px] rounded-md" />
          <div className="h-4 bg-[#27272A] w-[150px] rounded-md mt-2" />
          <div className="h-4 bg-[#27272A] w-[100px] rounded-md mt-2" />
        </div>
        <div className="ml-auto mt-4 h-6 bg-[#27272A] w-[50px] rounded-md" />
      </div>
      <div className="mx-4 h-4 bg-[#27272A] rounded-md mt-2" />
    </div>
  );
};

export default SkeletonCard;