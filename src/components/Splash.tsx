import React from "react";
import { getFeedback } from "./ScoreCalc";
type SplashProps = {
  duration: number; 
  firstPlayInSequence: boolean;
  gameInterval: number
  
}

export default function Splash({ duration ,firstPlayInSequence,gameInterval}: SplashProps) {
  const startScale = Math.max(0.3, (duration / 500) * 1.5); 
  const feedback = getFeedback(duration, firstPlayInSequence,gameInterval); 
  const text = feedback.text; 

  const style: React.CSSProperties = {
    position: 'absolute',
    bottom: '150px',
    left: '50%',
    transform: 'translateX(-20%)',
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    background: feedback.color,
    boxShadow: '0 0 10px 5px gold, 0 0 20px 10px orange, 0 0 30px 15px red',
    animation: 'splashAnim 0.4s ease-out forwards',
    textShadow: '2px 2px 6px rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '800',
    font: 'bitcount-grid-single-myheader',
    fontSize: '20px',
    color: '#fff',
  };


  return (
    <>
      <style>
        {`
          @keyframes splashAnim {
            0% { transform: translateX(-50%) scale(${startScale}); opacity: 1; }
            100% { transform: translateX(-50%) scale(2.5); opacity: 0; }
          }
        `}
      </style>
      <div style={style}>{text}</div>
    </>
  );
}

