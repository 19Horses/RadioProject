import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";

const AudioContext = createContext();

const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${
      secs < 10 ? "0" : ""
    }${secs}`;
  }
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
};

export const AudioProvider = ({ children }) => {
  const audioRef = useRef(new Audio());
  const [progress, setProgress] = useState(0);
  const [formattedProgress, setFormattedProgress] = useState("--:--");
  const [formattedDuration, setFormattedDuration] = useState("--:--");
  const [isPlaying, setIsPlaying] = useState(false);
  const rafRef = useRef(null);

  useEffect(() => {
    const updateTime = () => {
      if (audioRef.current) {
        setProgress(
          Math.floor(
            (audioRef.current.currentTime / audioRef.current.duration) * 100
          )
        );
        setFormattedProgress(formatTime(audioRef.current.currentTime));
        rafRef.current = requestAnimationFrame(updateTime);
      }
    };

    rafRef.current = requestAnimationFrame(updateTime);

    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const skipForward = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        audioRef.current.currentTime + 10,
        audioRef.current.duration
      );
    }
  }, [audioRef]);

  const skipBackward = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(
        audioRef.current.currentTime - 10,
        0
      );
    }
  }, [audioRef]);

  const skipTo = useCallback((time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress(Math.floor((current / duration) * 100));
      setFormattedProgress(formatTime(time));
    }
  }, []);

  const togglePlayPause = useCallback(() => {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }

    setIsPlaying(!audioRef.current.paused);
  }, [audioRef, setIsPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;

      const handleCanPlayThrough = () => {
        if (audio.duration && !isNaN(audio.duration)) {
          setFormattedDuration(formatTime(audioRef.current.duration));
          audio.play();
          setIsPlaying(true);
        }
      };

      audio.addEventListener("canplaythrough", handleCanPlayThrough);

      return () => {
        audio.removeEventListener("canplaythrough", handleCanPlayThrough);
      };
    }
  }, [audioRef]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === " ") {
        e.preventDefault();
        togglePlayPause();
      } else if (e.key === "ArrowRight") {
        skipForward();
      } else if (e.key === "ArrowLeft") {
        skipBackward();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [skipBackward, skipForward, togglePlayPause]);

  return (
    <AudioContext.Provider
      value={{
        audioRef,
        progress,
        formattedProgress,
        formattedDuration,
        isPlaying,
        skipBackward,
        skipForward,
        togglePlayPause,
        skipTo,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export function useAudio() {
  return useContext(AudioContext);
}
