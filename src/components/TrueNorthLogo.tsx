
import React from "react";

export const TrueNorthLogo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src="/lovable-uploads/13a089f9-4171-47b2-bde2-b574a94a8945.png"
        alt="True North Land Surveying Logo"
        className="h-12"
      />
    </div>
  );
};
