import React from "react";

const Loading = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 z-50 space-y-5">
      <span className="text-3xl font-black text-base-content tracking-tight">
        Style<span className="text-primary">Decor</span>
      </span>

      <span className="loading loading-bars loading-md text-primary"></span>
    </div>
  );
};

export default Loading;
