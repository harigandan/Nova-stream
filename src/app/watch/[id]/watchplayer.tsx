"use client";

import React, { useEffect, useRef, useState } from "react";
import { create, isPlayerSupported, Player } from "amazon-ivs-player";

type WatchPlayerProps = {
  playbackUrl: string;
};

export const WatchPlayer: React.FC<WatchPlayerProps> = ({ playbackUrl }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<Player | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isPlayerSupported) {
      console.warn("IVS Player not supported in this browser.");
      return;
    }
    if (!videoRef.current) return;

    // 🔹 Properly create player with WASM paths
    const player = create({
      wasmWorker: "/ivs/amazon-ivs-wasmworker.min.js",
      wasmBinary: "/ivs/amazon-ivs-wasmworker.min.wasm",
    });
    playerRef.current = player;

    player.attachHTMLVideoElement(videoRef.current);
    player.load(playbackUrl);
    player.setAutoplay(true);

    // Events
    player.addEventListener("playing", () => setIsPlaying(true));
    player.addEventListener("ended", () => setIsPlaying(false));
    player.addEventListener("error", (err) => console.error("IVS Player error:", err));

    return () => {
      player.pause();
      player.delete();
      playerRef.current = null;
    };
  }, [playbackUrl]);

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) playerRef.current.pause();
    else playerRef.current.play();
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="relative w-full max-w-7xl aspect-video bg-black">
      <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={togglePlay}
            className="bg-white/20 backdrop-blur-sm rounded-full p-6"
          >
            Play
          </button>
        </div>
      )}
    </div>
  );
};
