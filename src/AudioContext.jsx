import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const audioRef = useRef(new Audio());
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("--:--");

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (audioRef.current) {
      audioRef.current.muted = false; // Unmute on interaction
      audioRef.current.play().catch(console.error);
      setIsPlaying(!audioRef.current.paused);
    }

    if (audio) {
      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            console.log("Playback started");
          })
          .catch((error) => {
            console.error("Playback prevented:", error);
          });
      } else {
        console.warn("No play promise available");
      }
    }
  };

  useEffect(() => {
    const audio = audioRef.current;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
        setCurrentTime(formatTime(audio.currentTime));
      }
    };

    audio.addEventListener("timeupdate", updateProgress);
    return () => audio.removeEventListener("timeupdate", updateProgress);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <AudioContext.Provider
      value={{
        audioRef,
        isPlaying,
        setIsPlaying,
        progress,
        setProgress,
        currentTime,
        setCurrentTime,
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
