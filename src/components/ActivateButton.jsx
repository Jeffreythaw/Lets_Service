// src/components/ActivateButton.jsx
import { useEffect, useState } from "react";

const ActivateButton = ({ autoStart, size }) => {
  const [isActive, setIsActive] = useState(autoStart);

  useEffect(() => {
    if (autoStart) setIsActive(true);
  }, [autoStart]);

  return (
    <div className={`activate-wrapper ${size}`}>
      {isActive && <span className="activate">⌀</span>}
    </div>
  );
};

export default ActivateButton;