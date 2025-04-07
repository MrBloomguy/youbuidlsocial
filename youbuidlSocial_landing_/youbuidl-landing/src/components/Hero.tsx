import type React from 'react';
import { useEffect, useRef } from 'react';

const Hero: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Auto-play the video when component mounts
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Video autoplay failed:", error);
      });
    }
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Video background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          className="h-full w-full object-cover opacity-50"
          loop
          muted
          playsInline
          autoPlay
        >
          <source src="https://ext.same-assets.com/840946650/3607396785.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Gradient overlay on video */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-purple-900/70 via-blue-900/70 to-yellow-700/70 mix-blend-multiply"
          style={{
            background: 'linear-gradient(135deg, rgba(44, 39, 107, 0.8) 0%, rgba(28, 56, 121, 0.8) 50%, rgba(120, 111, 49, 0.8) 100%)'
          }}
        />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-6 text-center md:p-12">
        <h1 className="max-w-xl font-syne-bold text-5xl leading-tight md:text-7xl">
          Explore,<br />
          connect,<br />
          and vibe with builders in web3.<br />
        </h1>

        <div className="mt-8 flex items-center gap-4">
          <div className="font-syne text-sm md:text-base space-y-1">
  <p className="flex items-center gap-2">
    <img src="/assets/Givestation.png" alt="QR Icon" className="h-7 w-8" />
    Created by GiveStation
  </p>
  <p className="flex items-center gap-2">
    <img src="/assets/OP-Sunny_Emoji-Sparkly_2C-Red-RGB_v01.svg" alt="Lightning Icon" className="h-8 w-8" />
    Powered by Public Goods Funding.
  </p>
</div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
