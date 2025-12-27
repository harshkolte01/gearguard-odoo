'use client';

import { useEffect, useState } from 'react';

export default function AuthVisual() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="auth-visual" />;

  return (
    <div className="auth-visual">
      {/* Dynamic Background Grid */}
      <div className="technical-grid">
        <div className="grid-overlay" />
        <div className="coordinate-lines" />
      </div>

      {/* Rotating Mechanical Elements */}
      <div className="mechanical-core">
        <svg viewBox="0 0 200 200" className="gear gear-large">
          <path
            fill="currentColor"
            d="M100,60c-22.1,0-40,17.9-40,40s17.9,40,40,40s40-17.9,40-40S122.1,60,100,60z M100,125c-13.8,0-25-11.2-25-25s11.2-25,25-25 s25,11.2,25,25S113.8,125,100,125z"
          />
          <path
            fill="currentColor"
            d="M185.3,86.6l-15.6-2.7c-1.3-4.8-3.1-9.4-5.3-13.7l10.2-12.2c1.7-2.1,1.5-5.2-0.5-7.1l-14.1-14.1 c-2-2-5-2.2-7.1-0.5l-12.2,10.2c-4.3-2.2-8.9-4-13.7-5.3l-2.7-15.6C124,23.3,121.6,21,118.8,21H98.8c-2.8,0-5.2,2.3-5.5,5.1 l-2.7,15.6c-4.8,1.3-9.4,3.1-13.7,5.3L64.7,36.8c-2.1-1.7-5.2-1.5-7.1,0.5L43.5,51.4c-2,2-2.2,5-0.5,7.1l10.2,12.2 c-2.2,4.3-4,8.9-5.3,13.7l-15.6,2.7C29.4,87.4,27.1,89.8,27.1,92.6v20c0,2.8,2.3,5.2,5.1,5.5l15.6,2.7c1.3,4.8,3.1,9.4,5.3,13.7 l-10.2,12.2c-1.7,2.1-1.5,5.2,0.5,7.1l14.1,14.1c2,2,5,2.2,7.1,0.5l12.2-10.2c4.3,2.2,8.9,4,13.7,5.3l2.7,15.6 c0.3,2.8,2.7,5.1,5.5,5.1h20c2.8,0,5.2-2.3,5.5-5.1l2.7-15.6c4.8-1.3,9.4-3.1,13.7-5.3l12.2,10.2c2.1,1.7,5.2,1.5,7.1-0.5 l14.1-14.1c2-2,2.2-5,0.5-7.1l-10.2-12.2c2.2-4.3,4-8.9,5.3-13.7l15.6-2.7c2.8-0.3,5.1-2.7,5.1-5.5v-20 C190.4,89.3,188.1,87,185.3,86.6z M170.4,110.1l-18.4,3.2c-0.8,4.1-2.1,8-3.9,11.7l12.1,14.4l-7.1,7.1l-14.4-12.1 c-3.7,1.8-7.6,3.1-11.7,3.9l-3.2,18.4h-10l-3.2-18.4c-4.1-0.8-8-2.1-11.7-3.9l-14.4,12.1l-7.1-7.1l12.1-14.4 c-1.8-3.7-3.1-7.6-3.9-11.7l-18.4-3.2v-10l18.4-3.2c0.8-4.1,2.1-8,3.9-11.7L60.2,64.2l7.1-7.1l14.4,12.1 c3.7-1.8,7.6-3.1,11.7-3.9l3.2-18.4h10l3.2,18.4c4.1,0.8,8,2.1,11.7,3.9l14.4-12.1l7.1,7.1l-12.1,14.4c1.8,3.7,3.1,7.6,3.9,11.7 l18.4,3.2V110.1z"
          />
        </svg>
      </div>

      {/* HUD Elements */}
      <div className="hud-corner top-left" />
      <div className="hud-corner top-right" />
      <div className="hud-corner bottom-left" />
      <div className="hud-corner bottom-right" />

      {/* Watermark Logo */}
      <div className="auth-watermark">
        <span>GEARGUARD</span>
        <div className="watermark-line" />
      </div>
    </div>
  );
}

