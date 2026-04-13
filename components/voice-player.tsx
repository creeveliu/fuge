"use client";

import { useState, useRef, useCallback } from "react";

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

  // Auto-play on mount if enabled
  // Note: We don't auto-play here because we need to wait for
  // the complete response. This is handled in ChatShell.

  if (error) {
    return (
      <button
        onClick={fetchAndPlay}
        className="text-xs text-red-500 hover:text-red-600"
        title={error}
      >
        重试
      </button>
    );
  }

  if (isLoading) {
    return (
      <span className="text-xs text-[color:var(--muted)]">
        加载中...
      </span>
    );
  }

  if (isPlaying) {
    return (
      <button
        onClick={stop}
        className="text-xs hover:text-[color:var(--accent)]"
        title="停止播放"
      >
        ⏹ 停止
      </button>
    );
  }

  return (
    <button
      onClick={fetchAndPlay}
      className="text-xs hover:text-[color:var(--accent)]"
      title="播放语音"
    >
      🔊 播放
    </button>
  );
}