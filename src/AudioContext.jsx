import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const audioRef = useRef(new Audio());
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    audio.addEventListener("timeupdate", updateProgress);
    return () => audio.removeEventListener("timeupdate", updateProgress);
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

  const togglePlayPause = useCallback(() => {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      audioRef.current.play().catch((error) => {
        console.error("Playback failed:", error);
      });
    } else {
      audioRef.current.pause();
    }

    setIsPlaying(!audioRef.current.paused);
  }, [audioRef, setIsPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      audio.load();

      const handleCanPlay = () => {
        audio.play().catch((error) => {
          console.error("iOS blocked playback:", error);
        });
        setIsPlaying(true);
      };

      audio.addEventListener("canplaythrough", handleCanPlay);

      return () => {
        audio.removeEventListener("canplaythrough", handleCanPlay);
      };
    }
  }, [audioRef]);

  return (
    <AudioContext.Provider
      value={{
        audioRef,
        progress,
        setProgress,
        isPlaying,
        skipBackward,
        skipForward,
        togglePlayPause,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export function useAudio() {
  return useContext(AudioContext);
}
