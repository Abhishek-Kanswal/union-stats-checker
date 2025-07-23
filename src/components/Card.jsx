import React from "react";

export function Card({ children }) {

  return (
    <div
      className="w-full mx-auto max-w-[650px] flex flex-col justify-center items-center bg-[#101013] pb-0 overflow-hidden rounded-2xl shadow-[0px_170px_48px_0px_rgba(18,_18,_19,_0.00),_0px_109px_44px_0px_rgba(18,_18,_19,_0.01),_0px_61px_37px_0px_rgba(18,_18,_19,_0.05),_0px_27px_27px_0px_rgba(18,_18,_19,_0.09),_0px_7px_15px_0px_rgba(18,_18,_19,_0.10)]"
    >
      <div className="flex flex-col items-center gap-4 flex-1 text-center w-full p-8 pb-4">
        
        <div className="flex flex-col gap-4">{children}</div>
      </div>
    </div>
  );
}
