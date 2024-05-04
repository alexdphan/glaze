'use client';
import Image from 'next/image';
import Form from '../components/Form';
import './globals.css';
import MultiStepComponent from '../components/MultiStepComponent';
import { useState } from 'react';

export default function Home() {
  const [showMultiStep, setShowMultiStep] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12 text-black space-y-8 bg-background">
      <div className="absolute top-10 flex flex-row text-foreground sm:text-xl text-lg">
        Made by&nbsp;
        <a
          href="https://twitter.com/alexdphan"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="font-bold underline text-highlight sm:text-xl text-lg">
            AP
          </div>
        </a>
      </div>
      <div className="text-center">
        <h1 className="sm:text-6xl text-4xl font-bold mb-4 tracking-tight italic bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent title">
          <span className="shine">Glaze</span>
        </h1>
        <p className="sm:text-xl text-lg text-foreground tracking-tight">
          The place to congratulate your friends, in a weird way...
        </p>
      </div>
      <MultiStepComponent />
    </main>
  );
}
