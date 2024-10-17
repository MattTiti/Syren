import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Radiating waves */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[5, 6, 7, 8, 9, 10, 11, 12, 13].map((i) => (
          <div
            key={i}
            className={`absolute rounded-full border-2 border-red-500 opacity-20
                        animate-pulse-custom`}
            style={{
              width: `${i * 15}vmin`,
              height: `${i * 15}vmin`,
              animationDelay: `${i * 0.1}s`,
              animationDuration: "3s",
            }}
          ></div>
        ))}
      </div>
      <div className="relative z-10 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-black mb-6">
          Amplify Your Voice
        </h1>
        <p className="text-xl md:text-2xl text-black/70 mb-8">
          Reach your audience with powerful messaging
        </p>
        <div className="space-x-4">
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Get Started
            </Button>
          </Link>
          <Link href="#features">
            <Button
              size="lg"
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-100"
            >
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
