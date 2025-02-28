import { useEffect } from "react";
import "../css/welcomeanimation.css"; // Updated to match renamed file

const WelcomeAnimation = ({ onAnimationEnd }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onAnimationEnd();
    }, 8000);

    return () => clearTimeout(timer);
  }, [onAnimationEnd]);

  const texts = ["W", "e", "l", "c", "o", "m", "e", ":)"];
  const numParticles = 12;

  return (
    <div className="welcome-container">
      {texts.map((_, i) => (
        <div key={i} className={`background background${i}`} />
      ))}
      <div className="criterion">
        {texts.map((char, i) => (
          <span key={i} className={`text text${i}`}>
            {char}
          </span>
        ))}
        {texts.map((_, i) => (
          <div key={i} className={`frame frame${i}`} />
        ))}
        {texts.map((_, i) =>
          Array.from({ length: numParticles }).map((_, j) => (
            <div key={`${i}-${j}`} className={`particle particle${i}${j}`} />
          ))
        )}
      </div>
    </div>
  );
};

export default WelcomeAnimation;