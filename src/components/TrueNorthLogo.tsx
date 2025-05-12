
import React from "react";

export const TrueNorthLogo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img
        src="/lovable-uploads/e66f3961-0728-4178-9acf-b242e0d3196e.png"
        alt="True North Land Surveying Logo"
        className="h-12"
      />
      <span 
        className="font-black italic text-white text-2xl whitespace-nowrap"
        style={{ fontFamily: "'Arial Black', Arial, sans-serif" }}
      >
        TRUE NORTH LAND SURVEYING INC.
      </span>
    </div>
  );
};
