'use client';
import { clsx } from 'clsx';
import '../app/globals.css';
import React, { CSSProperties } from 'react';

const bars = Array(12).fill(0);

interface SpinnerProps {
  color?: string;
  size?: number;
}

interface CustomCSSProperties extends CSSProperties {
  '--spinner-size'?: string;
  '--spinner-color'?: string;
}

export function Spinner({ color, size = 20 }: SpinnerProps) {
  const style: CustomCSSProperties = {
    '--spinner-size': `${size}px`,
    '--spinner-color': color,
  };

  return (
    <div className="wrapper mb-3" style={style}>
      <div className="spinner">
        {bars.map((_, i) => (
          <div className="bar" key={`spinner-bar-${i}`} />
        ))}
      </div>
    </div>
  );
}
