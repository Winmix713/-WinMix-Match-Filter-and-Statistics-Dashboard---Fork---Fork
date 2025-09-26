import React, { useEffect, useState } from 'react';
export const Background: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    // Initial check
    checkMobile();
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  return <>
      {/* Background 3D Spline - load simpler version on mobile */}
      <div className="spline-container fixed top-0 w-full h-screen -z-10">
        <iframe src={isMobile ? 'https://my.spline.design/aidatamodelinteraction-mdTL3FktFVHgDvFr5TKtnYDV?quality=low' : 'https://my.spline.design/aidatamodelinteraction-mdTL3FktFVHgDvFr5TKtnYDV'} frameBorder="0" width="100%" height="100%" id="aura-spline"></iframe>
      </div>
      {/* Background glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] sm:w-[800px] md:w-[1100px] h-[600px] sm:h-[800px] md:h-[1100px] rounded-full blur-3xl opacity-35 bg-[radial-gradient(closest-side,rgba(138,92,246,0.5),rgba(10,10,18,0))]"></div>
        <div className="absolute -bottom-20 -right-20 w-[400px] sm:w-[600px] md:w-[800px] h-[400px] sm:h-[600px] md:h-[800px] rounded-full blur-3xl opacity-30 bg-[radial-gradient(closest-side,rgba(99,102,241,0.4),rgba(10,10,18,0))]"></div>
      </div>
    </>;
};