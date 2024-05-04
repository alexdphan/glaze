'use client';
import { useState, useRef, useEffect } from 'react';
import { Pause, Play, Rewind, FastForward, FileAudio2 } from 'lucide-react';
import { Spinner } from './Spinner';
import CopyLink from './CopyLink';

interface AudioPlayerProps {
  src: string;
  size: number;
}

export default function AudioPlayer({ src, size }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);

  // This ref is attached to the audio element to control playback and access playback properties like current time and duration.
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, [src]); // added src because it's a prop, so that the audio player can be re-initialized when the src changes

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio) {
      setCurrentTime(audio.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (audio) {
      setDuration(audio.duration);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = e.currentTarget;
    const audio = audioRef.current;
    if (audio) {
      const rect = progressBar.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      const newTime = percentage * audio.duration;
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  return (
    <div>
      <div className="flex flex-row sm:space-x-6 space-x-3 items-center justify-center">
        <div className=" flex">
          {!src ? (
            <div className="flex flex-col items-center justify-center space-y-3">
              <Spinner color="hsl(27, 100%, 55%)" size={40} />
              <p className="text-foreground ">Generating Glaze Audio...</p>
            </div>
          ) : (
            <div className="loader h-10 w-10 sm:h-full ">
              <svg
                id="wave"
                data-name="Layer 1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 50 38.05"
                className={`${
                  isPlaying
                    ? 'playing'
                    : 'grid h-full grid-cols-11 justify-center gap-[2px] bg-transparent'
                }`}
              >
                <path
                  id="Line_1"
                  data-name="Line 1"
                  d="M0.91,15L0.78,15A1,1,0,0,0,0,16v6a1,1,0,1,0,2,0s0,0,0,0V16a1,1,0,0,0-1-1H0.91Z"
                />
                <path
                  id="Line_2"
                  data-name="Line 2"
                  d="M6.91,9L6.78,9A1,1,0,0,0,6,10V28a1,1,0,1,0,2,0s0,0,0,0V10A1,1,0,0,0,7,9H6.91Z"
                />
                <path
                  id="Line_3"
                  data-name="Line 3"
                  d="M12.91,0L12.78,0A1,1,0,0,0,12,1V37a1,1,0,1,0,2,0s0,0,0,0V1a1,1,0,0,0-1-1H12.91Z"
                />
                <path
                  id="Line_4"
                  data-name="Line 4"
                  d="M18.91,10l-0.12,0A1,1,0,0,0,18,11V27a1,1,0,1,0,2,0s0,0,0,0V11a1,1,0,0,0-1-1H18.91Z"
                />
                <path
                  id="Line_5"
                  data-name="Line 5"
                  d="M24.91,15l-0.12,0A1,1,0,0,0,24,16v6a1,1,0,0,0,2,0s0,0,0,0V16a1,1,0,0,0-1-1H24.91Z"
                />
                <path
                  id="Line_6"
                  data-name="Line 6"
                  d="M30.91,10l-0.12,0A1,1,0,0,0,30,11V27a1,1,0,1,0,2,0s0,0,0,0V11a1,1,0,0,0-1-1H30.91Z"
                />
                <path
                  id="Line_7"
                  data-name="Line 7"
                  d="M36.91,0L36.78,0A1,1,0,0,0,36,1V37a1,1,0,1,0,2,0s0,0,0,0V1a1,1,0,0,0-1-1H36.91Z"
                />
                <path
                  id="Line_8"
                  data-name="Line 8"
                  d="M42.91,9L42.78,9A1,1,0,0,0,42,10V28a1,1,0,1,0,2,0s0,0,0,0V10a1,1,0,0,0-1-1H42.91Z"
                />
                <path
                  id="Line_9"
                  data-name="Line 9"
                  d="M48.91,15l-0.12,0A1,1,0,0,0,48,16v6a1,1,0,1,0,2,0s0,0,0,0V16a1,1,0,0,0-1-1H48.91Z"
                />
              </svg>
            </div>
          )}
        </div>

        {src && (
          <div className="flex flex-row">
            <div className="flex flex-col text-left">
              <h2 className="sm:text-foreground sm:text-base text-sm text-white text-left">
                Generated Glaze
              </h2>
              <div className="text-muted-heading sm:text-base text-sm text-thin">
                Audio Player Name
              </div>
            </div>
            <div>
              <CopyLink size={18} link={src} />
            </div>
          </div>
        )}
      </div>

      {src && (
        <>
          <div className="mb-2 flex justify-center">
            <div className="flex items-center">
              <div className="text-foreground mr-4">
                <div className="flex items-center">
                  <audio ref={audioRef} src={src} />
                  <button
                    onClick={handlePlayPause}
                    className="flex justify-center items-center"
                  >
                    {isPlaying ? (
                      <Pause
                        fill="white"
                        size={18}
                        strokeWidth={1}
                        color="white"
                      />
                    ) : (
                      <Play
                        fill="white"
                        size={18}
                        strokeWidth={1}
                        color="white"
                      />
                    )}
                  </button>
                </div>
                {/* {formatTime(currentTime)} */}
              </div>
              <div className="relative w-2/3">
                <div
                  className="progress-bar"
                  style={{
                    width: `${(currentTime / duration) * 100}%`,
                  }}
                ></div>
                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={currentTime}
                  onChange={(e) => {
                    const audio = audioRef.current;
                    if (audio) {
                      audio.currentTime = Number(e.target.value);
                      setCurrentTime(audio.currentTime);
                    }
                  }}
                  className="slider w-full mb-3"
                />
              </div>
              <div className="text-foreground ml-4">{formatTime(duration)}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
