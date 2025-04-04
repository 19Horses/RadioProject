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
  const [progress, setProgress] = useState(0);

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

  return (
    <AudioContext.Provider
      value={{
        audioRef,
        progress,
        setProgress,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export function useAudio() {
  return useContext(AudioContext);
}
