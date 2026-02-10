import React, { createContext, useContext, useState } from "react";

interface ThreeDContextType {
  is3DEnabled: boolean;
  toggle3D: () => void;
  isHoveringToggle: boolean;
  setIsHoveringToggle: (value: boolean) => void;
}

const ThreeDContext = createContext<ThreeDContextType | undefined>(undefined);

export function ThreeDProvider({ children }: { children: React.ReactNode }) {
  const [is3DEnabled, setIs3DEnabled] = useState(false);
  const [isHoveringToggle, setIsHoveringToggle] = useState(false);

  const toggle3D = () => {
    setIs3DEnabled((prev) => !prev);
  };

  return (
    <ThreeDContext.Provider
      value={{ is3DEnabled, toggle3D, isHoveringToggle, setIsHoveringToggle }}
    >
      {children}
    </ThreeDContext.Provider>
  );
}

export function useThreeD() {
  const context = useContext(ThreeDContext);
  if (!context) {
    throw new Error("useThreeD must be used within ThreeDProvider");
  }
  return context;
}
