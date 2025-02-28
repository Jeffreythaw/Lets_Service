// src/components/ProgressButton.jsx
import { useEffect, useState } from "react";

const ProgressButton = ({ loadingTime, onComplete, startProgressImmediately }) => {
  const [progress, setProgress] = useState(startProgressImmediately ? 0 : 100);

  useEffect(() => {
    if (startProgressImmediately) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            onComplete();
            return 100;
          }
          return prev + 100 / (loadingTime / 100);
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [loadingTime, onComplete, startProgressImmediately]);

  return (
    <button className="submitButton" disabled>
      Signing In... {Math.round(progress)}%
    </button>
  );
};

export default ProgressButton;