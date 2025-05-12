
import React from "react";

export const TrueNorthLogo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img
        src="/lovable-uploads/541e7d0a-4bb0-4230-9dee-980fd9598990.png"
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
