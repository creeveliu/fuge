"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";

type VoicePlayerProps = {
  text: string;
  personaId: string;
  autoPlay?: boolean;
};

export default function VoicePlayer({
  text,
  personaId,
  autoPlay = false,
}: VoicePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  const fetchAndPlay = useCallback(async () => {
    if (isLoading || isPlaying) return;

    setIsLoading(true);
    setError(null);

    try {
      // If we already have the audio URL, use it
      if (audioUrlRef.current && audioRef.current) {
        audioRef.current.play();
        setIsPlaying(true);
        setIsLoading(false);
        return;
      }

      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, personaId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to generate audio");
      }

      // Get audio blob
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      audioUrlRef.current = audioUrl;

      // Create audio element and play
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setIsPlaying(false);
      };

      audio.onerror = () => {
        setError("Audio playback failed");
        setIsPlaying(false);
      };

      await audio.play();
      setIsPlaying(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [text, personaId, isLoading, isPlaying]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, []);

  // Cleanup blob URL and audio on unmount
  useEffect(() => {
    return () => {
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Auto-play on mount if enabled
  // Note: We don't auto-play here because we need to wait for
  // the complete response. This is handled in ChatShell.

  if (error) {
    return (
      <button
        onClick={fetchAndPlay}
        className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600"
        title={error}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
        重试
      </button>
    );
  }

  if (isLoading) {
    return (
      <span className="flex items-center gap-1 text-xs text-[color:var(--muted)]">
        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
          <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
        </svg>
        加载中
      </span>
    );
  }

  if (isPlaying) {
    return (
      <button
        onClick={stop}
        className="flex items-center gap-1 text-xs hover:text-[color:var(--accent)]"
        title="停止播放"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="4" width="4" height="16" rx="1" />
          <rect x="14" y="4" width="4" height="16" rx="1" />
        </svg>
        停止
      </button>
    );
  }

  return (
    <button
      onClick={fetchAndPlay}
      className="flex items-center gap-1 text-xs hover:text-[color:var(--accent)]"
      title="播放语音"
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      </svg>
      播放
    </button>
  );
}