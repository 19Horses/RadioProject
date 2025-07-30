// CameraSnapBayerLiveDither.js
import React, { useState, useRef, useEffect } from "react";
import Sketch from "react-p5";
import StarSignStep from "../components/starSignSelector"; // Adjust the import path as necessary
import AriesIcon from "../assets/starsigns/aries.svg"; // Adjust the import path as necessary
import TaurusIcon from "../assets/starsigns/taurus.svg"; // Adjust the import path as necessary
import GeminiIcon from "../assets/starsigns/gemini.svg"; // Adjust the import path as necessary
import CancerIcon from "../assets/starsigns/cancer.svg"; // Adjust the import path as necessary
import LeoIcon from "../assets/starsigns/leo.svg"; // Adjust the import path as necessary
import VirgoIcon from "../assets/starsigns/virgo.svg"; // Adjust the import path as necessary
import LibraIcon from "../assets/starsigns/libra.svg"; // Adjust the import path as necessary
import ScorpioIcon from "../assets/starsigns/scorpio.svg"; // Adjust the import path as necessary
import SagittariusIcon from "../assets/starsigns/sagitarrius.svg"; // Adjust the import path as necessary
import CapricornIcon from "../assets/starsigns/capricorn.svg"; // Adjust the import path as necessary
import AquariusIcon from "../assets/starsigns/aquarius.svg"; // Adjust the import path as necessary
import PiscesIcon from "../assets/starsigns/pisces.svg"; // Adjust the import path as necessary
import chevron from "../assets/chevron.png"; // Adjust the import path as necessary
import { uploadToBackend } from "../utils/s3Upload";
import { CustomCursor } from "../components/CustomCursor";
import DitheredImageCanvas from "../components/DitheredImageCanvas"; // import your new component

import { useNavigate } from "react-router-dom";

export default function RPHead({ isMobile }) {
  const [canvasSize, setCanvasSize] = useState({ width: 640, height: 480 });

  const canvasContainerRef = useRef(null);

  const starSignIcons = {
    Aries: AriesIcon,
    Taurus: TaurusIcon,
    Gemini: GeminiIcon,
    Cancer: CancerIcon,
    Leo: LeoIcon,
    Virgo: VirgoIcon,
    Libra: LibraIcon,
    Scorpio: ScorpioIcon,
    Sagittarius: SagittariusIcon,
    Capricorn: CapricornIcon,
    Aquarius: AquariusIcon,
    Pisces: PiscesIcon,
  };
  const questions = [
    "How was your day today?",
    "If you replace all the parts of a boat, is it still the same boat?",
    "Do we have free will?",
    "What book had the most significant impact on your life?",
    "What is the lie you tell yourself most often?",
    "If you could tell your younger self any one thing, what would it be?",
    "What do you think the world will look like in 300 years?",
    "What is the most life-changing decision you’ve ever made on a whim?",
    "If you were a ghost, what location do you think you would haunt?",
  ];

  const navigate = useNavigate();

  const [snapped, setSnapped] = useState(false);
  const videoRef = useRef(null);
  const animationStartTime = useRef(null);
  const snapshotRef = useRef(null);
  const [rand, setRand] = useState(
    Math.floor(Math.random() * questions.length)
  );
  const [step, setStep] = useState(0); // Tracks which question we're on
  const textareaRef = useRef();
  const [randomQuestion, setRandomQuestion] = useState("");

  const bayerMatrix = [
    [15, 7, 13, 5],
    [3, 11, 1, 9],
    [12, 4, 14, 6],
    [0, 8, 2, 10],
  ];

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  const applyBayerDither = (p5, img, scaleFactor) => {
    img.loadPixels();
    const matrixSize = 4;

    for (let y = 0; y < img.height; y++) {
      for (let x = 0; x < img.width; x++) {
        const index = (x + y * img.width) * 4;

        const r = img.pixels[index + 0];
        const g = img.pixels[index + 1];
        const b = img.pixels[index + 2];

        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        const threshold =
          bayerMatrix[y % matrixSize][x % matrixSize] * scaleFactor;
        const newValue = gray < threshold ? 0 : 255;

        img.pixels[index + 0] = newValue;
        img.pixels[index + 1] = newValue;
        img.pixels[index + 2] = newValue;
      }
    }

    img.updatePixels();
  };

  const setup = (p5, canvasParentRef) => {
    const canvas = p5.createCanvas(canvasSize.width, canvasSize.height);
    canvas.parent(canvasParentRef);
    p5.background(0);

    if (!videoRef.current) {
      videoRef.current = p5.createCapture(
        {
          video: {
            facingMode: "user",
            width: { ideal: canvasSize.width },
            height: { ideal: canvasSize.height },
          },
        },
        () => {
          videoRef.current.hide();
        }
      );
      videoRef.current.size(canvasSize.width, canvasSize.height);
    }
  };

  const draw = (p5) => {
    p5.background(0);
    const video = videoRef.current;
    if (!video) return;

    let scaleFactor = 13;

    if (snapped) {
      const duration = 2000;
      const now = Date.now();
      const elapsed = now - animationStartTime.current;
      const t = Math.min(elapsed / duration, 1);
      const easedT = easeOutCubic(t);

      const minScale = 8;
      const maxScale = 15;
      const clampedMouseX = Math.max(
        0,
        Math.min(smoothedMouseX, window.innerWidth)
      );
      const mouseScaleFactor =
        minScale + ((maxScale - minScale) * clampedMouseX) / window.innerWidth;

      scaleFactor = mouseScaleFactor * easedT;

      if (snapshotRef.current) {
        const img = snapshotRef.current.get();
        applyBayerDither(p5, img, scaleFactor);

        p5.image(img, 0, 0, p5.width, p5.height);
      }
    } else {
      const frame = video.get();
      applyBayerDither(p5, frame, scaleFactor);
      p5.image(frame, 0, 0, p5.width, p5.height);
    }
  };

  const handleSnap = () => {
    if (videoRef.current) {
      snapshotRef.current = videoRef.current.get();
      animationStartTime.current = Date.now();
      setSnapped(true);
    }
  };

  const handleReset = () => {
    setSnapped(false);
    setShowNameLabel(true);
    setShowProfessionLabel(true);

    setStep(0); // Reset step to 0
    setInputs({});

    snapshotRef.current = null;
  };

  const [inputs, setInputs] = useState({
    username: "",
    profession: "",
    starsign: "",
    question: "",
    answer: "",
  });
  const [showNameLabel, setShowNameLabel] = useState(true);
  const [showProfessionLabel, setShowProfessionLabel] = useState(true);
  const [mouseX, setMouseX] = useState(window.innerWidth / 2); // default center
  const [smoothedMouseX, setSmoothedMouseX] = useState(window.innerWidth / 2);

  function canvasToBlob(canvas) {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/png");
    });
  }

  function handleChange(e) {
    const { name, value } = e.target;

    // Allow only alphanumeric characters
    const cleanValue = value.replace(/[^a-z0-9 ]/gi, "");

    setInputs((prev) => ({
      ...prev,
      [name]: cleanValue,
    }));

    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto"; // Reset height
      el.style.height = `${el.scrollHeight}px`; // Set to content height
    }
  }

  function handleTAChange(e) {
    const { name, value } = e.target;

    // Allow only alphanumeric characters

    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));

    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto"; // Reset height
      el.style.height = `${el.scrollHeight}px`; // Set to content height
    }
  }

  const handleNext = (e) => {
    e.preventDefault();

    if (step === 0) {
      setShowNameLabel(false);
      setTimeout(() => setStep(1), 200);
    } else if (step === 1) {
      setShowProfessionLabel(false);
      setTimeout(() => setStep(2), 200);
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const generateRandomQuestion = () => {
    const index = Math.floor(Math.random() * questions.length);
    const question = questions[index];
    setRandomQuestion(question);

    setInputs((prev) => ({
      ...prev,
      question, // ✅ Save question in form inputs
      timestamp: new Date().toISOString(), // Add timestamp
    }));
  };

  useEffect(() => {
    if (snapped) {
      generateRandomQuestion();
    }
  }, [snapped]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const p5canvas = document.querySelector("canvas");
    if (!p5canvas) {
      alert("Canvas element not found!");
      return;
    }

    // Convert the dithered canvas to a blob
    const ditheredBlob = await canvasToBlob(p5canvas);

    // Create offscreen canvas for the undithered image
    const unditheredCanvas = document.createElement("canvas");
    unditheredCanvas.width = snapshotRef.current.width;
    unditheredCanvas.height = snapshotRef.current.height;
    const ctx = unditheredCanvas.getContext("2d");
    console.log(ditheredBlob); // Should show Blob with type "image/png"

    if (snapshotRef.current.canvas) {
      const imgData = snapshotRef.current.canvas
        .getContext("2d")
        .getImageData(
          0,
          0,
          snapshotRef.current.width,
          snapshotRef.current.height
        );
      ctx.putImageData(imgData, 0, 0);
    } else {
      alert("No valid image data found in snapshotRef");
      return;
    }

    const unditheredBlob = await canvasToBlob(unditheredCanvas);

    // Prep file names
    const timestamp = new Date().toISOString();
    const name =
      inputs.username?.replace(/\s+/g, "_").toLowerCase() || "anonymous";

    const ditheredKey = `images/${name}-${timestamp}-dithered.png`;
    const unditheredKey = `images/${name}-${timestamp}-undithered.png`;
    console.log(unditheredBlob); // Same

    const formKey = `data/${name}-${timestamp}.json`;

    const formBlob = new Blob([JSON.stringify(inputs)], {
      type: "application/json",
    });
    console.log(formBlob); // Should show type "application/json"

    try {
      await Promise.all([
        uploadToBackend(ditheredBlob, ditheredKey, "image/png"),
        uploadToBackend(unditheredBlob, unditheredKey, "image/png"),
        uploadToBackend(formBlob, formKey, "application/json"),
      ]);
      navigate("/visitorcheck");
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed. Check console.");
    }
  };

  useEffect(() => {
    // Resize on first mount
    if (textareaRef.current) {
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.remove(); // Clean up webcam on unmount
        videoRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => setMouseX(e.clientX);

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const container = canvasContainerRef.current;

    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;

        // Ensure we use integer values for canvas pixels
        setCanvasSize({
          width: Math.floor(width),
          height: Math.floor(height),
        });
      }
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (p5InstanceRef.current) {
      p5InstanceRef.current.resizeCanvas(canvasSize.width, canvasSize.height);
    }
  }, [canvasSize]);

  useEffect(() => {
    let animationFrameId;

    const smoothMouseX = () => {
      setSmoothedMouseX((prev) => {
        const lerpFactor = 0.1; // lower is slower (e.g., 0.05)
        return prev + (mouseX - prev) * lerpFactor;
      });
      animationFrameId = requestAnimationFrame(smoothMouseX);
    };

    animationFrameId = requestAnimationFrame(smoothMouseX);

    return () => cancelAnimationFrame(animationFrameId);
  }, [mouseX]);

  const currentSign = inputs.starsign || "Aries";
  const currentIcon = starSignIcons[currentSign];

  return (
    <div className="rphead-container">
      <div
        className="visitor-log-form"
        style={{
          display: "flex",
          justifyContent: "center", // 👈 center horizontally
          alignItems: "center", // 👈 optional: center vertically
          height: "100vh", // 👈 optional: full-height vertical centering
        }}
      >
        <div
          style={{
            width: "min(90vw, 640px)", // Responsive up to 640px
            aspectRatio: "4 / 3", // ✅ auto-calculate height
            transform: isMobile
              ? snapped
                ? "translateY(-22vh)"
                : "translateY(0)"
              : snapped
              ? "translateX(-20vw)"
              : "translateX(0)",
            transitionDelay: snapped ? "0.5s" : "0s",
            transition: "all 1.3s ease-in-out",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div ref={canvasContainerRef} className="p5Container">
            <Sketch setup={setup} draw={draw} />
            <div className="buttons">
              {!snapped && (
                <button
                  onClick={handleSnap}
                  style={{
                    fontSize: "3vh",
                    fontWeight: "900",
                    backgroundColor: "black",
                    color: "white",
                  }}
                >
                  Shoot!
                </button>
              )}
              {snapped && (
                <button
                  onClick={handleReset}
                  style={{
                    fontSize: "3vh",
                    fontWeight: "900",
                    backgroundColor: "black",
                    color: "white",
                  }}
                >
                  Retake
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {snapped && (
        <div className="visitor-log-textform">
          <form
            onSubmit={handleSubmit}
            autoComplete="off"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {step >= 0 && (
                  <div
                    style={{
                      opacity: 0,
                      animation: "fadeIn 1s ease-in-out forwards",
                      animationDelay: "0.7s",
                      marginBottom: step > 0 ? "0vh" : "1rem",
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <input
                          id="username"
                          type="text"
                          name="username"
                          pattern="[A-Za-z0-9]*"
                          value={inputs.username || ""}
                          onChange={handleChange}
                          readOnly={step > 0}
                          style={{
                            borderBottom: "1px solid",
                            borderColor: step > 0 ? "transparent" : "#000",
                            marginBottom: step > 0 ? "0vh" : "",
                            transition: " border-color .2s ease-in-out",
                          }}
                        />
                      </div>
                      {step === 0 && (
                        <label
                          htmlFor="username"
                          style={{
                            opacity: showNameLabel ? 1 : 0,
                            transition: "opacity .2s ease-in-out",
                          }}
                        >
                          NAME
                        </label>
                      )}
                    </div>
                    {step === 0 && (
                      <button
                        onClick={handleNext}
                        disabled={!inputs.username}
                        style={{
                          opacity: showNameLabel ? 1 : 0,
                          transition: "opacity .2s ease-in-out",
                        }}
                      >
                        <img src={chevron} />
                      </button>
                    )}
                  </div>
                )}

                {step >= 1 && (
                  <div
                    style={{
                      marginBottom: "1rem",
                      display: "flex",
                      flexDirection: "row",
                      opacity: 0,
                      animation: "fadeIn 1s ease-in-out forwards",
                      animationDelay: "0.1s",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <input
                          id="profession"
                          type="text"
                          name="profession"
                          value={inputs.profession || ""}
                          onChange={handleTAChange}
                          readOnly={step > 1}
                          style={{
                            fontSize: step > 1 ? "1.4vh" : "4vh",
                            borderBottom: "1px solid",
                            borderColor: step > 1 ? "transparent" : "#000",
                            transition:
                              "font-size 0.3s ease-in-out, border-color 0.2s ease-in-out",
                          }}
                        />
                      </div>
                      <div style={{ opacity: step > 1 ? "0" : "1" }}>
                        {step >= 1 && (
                          <label
                            htmlFor="profession"
                            style={{
                              opacity: showProfessionLabel ? 1 : 0,
                              transition: "opacity .2s ease-in-out",
                            }}
                          >
                            WHAT'S YOUR PROFESSION?
                          </label>
                        )}
                      </div>
                    </div>
                    {step == 1 && (
                      <button
                        onClick={handleNext}
                        disabled={!inputs.username}
                        style={{
                          opacity: showProfessionLabel ? 1 : 0,
                          transition: "opacity .2s ease-in-out",
                        }}
                      >
                        <img src={chevron} />
                      </button>
                    )}
                  </div>
                )}
              </div>
              {step >= 2 && (
                <img
                  src={currentIcon}
                  width="50vh"
                  height="50vh"
                  style={{ animation: "fadeIn 1s forwards" }}
                />
              )}
            </div>

            {step >= 2 && (
              <StarSignStep
                inputs={inputs}
                setInputs={setInputs}
                step={step}
                handleNext={handleNext}
                setStep={setStep}
              />
            )}
            {step >= 3 && (
              <div
                style={{
                  marginBottom: "1rem",
                  display: "flex",
                  flexDirection: "row",
                  opacity: 0,
                  animation: "fadeIn 1s ease-in-out forwards",
                  animationDelay: "0.1s",
                }}
              >
                <div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <textarea
                      id="answer"
                      name="answer"
                      value={inputs.answer || ""}
                      onChange={handleTAChange}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault(); // prevent newline
                          handleSubmit(e); // manually trigger submit
                        }
                      }}
                      rows={1}
                      style={{
                        resize: "none", // Optional: prevent manual resizing
                        overflow: "hidden", // Hide scrollbars
                        fontFamily: "Helvetica",
                        border: "none",
                        backgroundColor: "transparent",
                        fontSize: "4vh",
                        width: "20vw",
                        borderBottom: "1px solid #000000",
                      }}
                      maxlength={150}
                      ref={textareaRef}
                    />
                  </div>
                  <label
                    htmlFor="username"
                    style={{ textTransform: "uppercase", width: "80%" }}
                  >
                    {randomQuestion}
                  </label>
                </div>
                {step == 3 && (
                  <button
                    type="submit"
                    disabled={!inputs.answer}
                    style={{ marginLeft: "2vh", fontSize: "2vh" }}
                  >
                    ⏎
                  </button>
                )}
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
}

const IMAGES_API = "https://visitor-backlog-new.onrender.com/api/images";
const DATA_API = "https://visitor-backlog-new.onrender.com/api/data";

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Helper to fetch JSON content from a URL
async function fetchJson(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch JSON from ${url}`);
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

export function RPGrid({ isPlaying, isMobile }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredForm, setHoveredForm] = useState();
  const [clickedImage, setClickedImage] = useState(null);
  const [clickedFormData, setClickedFormData] = useState(null);

  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setClickedImage(false); // update this line to use your actual state updater
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        const [imagesRes, dataRes] = await Promise.all([
          fetch(IMAGES_API),
          fetch(DATA_API),
        ]);

        const imageList = await imagesRes.json();
        const dataList = await dataRes.json();

        // Group images by base name
        const grouped = {};
        imageList.forEach(({ key, url }) => {
          const base = key
            .replace(/^images\//, "")
            .replace(/-dithered\.png$/, "")
            .replace(/-undithered\.png$/, "")
            .replace(/\.png$/, "")
            .toLowerCase();

          if (!grouped[base]) {
            grouped[base] = {
              baseName: base,
              images: [],
              formData: null,
            };
          }

          grouped[base].images.push({ key, url });
        });

        // Fetch and attach JSON form data to matching base names
        const dataWithContent = await Promise.all(
          dataList.map(async ({ key, url }) => {
            const json = await fetchJson(url);
            return { key, json };
          })
        );

        dataWithContent.forEach(({ key, json }) => {
          const base = key
            .replace(/^data\//, "")
            .replace(/\.json$/, "")
            .toLowerCase();
          if (!grouped[base]) {
            grouped[base] = {
              baseName: base,
              images: [],
              formData: json,
            };
          } else {
            grouped[base].formData = json;
          }
        });

        setItems(shuffle(Object.values(grouped)));
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load gallery data.");
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading)
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Helvetica",
        }}
      >
        <p
          style={{
            animation: "glow 1.5s ease-in-out infinite",
            fontSize: "2rem",
            color: "#000",
          }}
        >
          Loading...
        </p>
        <style>
          {`
          @keyframes glow {
            0% {
              opacity: 0.3;
              text-shadow: 0 0 5px rgba(0,0,0,0.2);
            }
            50% {
              opacity: 1;
              text-shadow: 0 0 20px rgba(0,0,0,0.4);
            }
            100% {
              opacity: 0.3;
              text-shadow: 0 0 5px rgba(0,0,0,0.2);
            }
          }
        `}
        </style>
      </div>
    );

  const starSignIcons = {
    Aries: AriesIcon,
    Taurus: TaurusIcon,
    Gemini: GeminiIcon,
    Cancer: CancerIcon,
    Leo: LeoIcon,
    Virgo: VirgoIcon,
    Libra: LibraIcon,
    Scorpio: ScorpioIcon,
    Sagittarius: SagittariusIcon,
    Capricorn: CapricornIcon,
    Aquarius: AquariusIcon,
    Pisces: PiscesIcon,
  };

  return (
    <>
      {hoveredForm && !isMobile && (
        <CustomCursor hoveredForm={hoveredForm} hovered={!!hoveredForm} />
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile
            ? "repeat(2,1fr)"
            : "repeat(auto-fill,minmax(260px,1fr))",
          gap: isMobile ? "1vw" : ".1vw",
          columnGap: isMobile ? "2vh" : "",
          rowGap: isMobile ? "1vh" : "",
          padding: "1vw",
          paddingTop: "11vh",

          filter: clickedImage ? "blur(5px)" : "none",
          transition: "filter 0.7s ease-out",
          width: isMobile ? (isPlaying ? "91%" : "") : isPlaying ? "94%" : "",
          pointerEvents: clickedImage ? "none" : "auto",
        }}
      >
        {!isMobile && (
          <div
            className="new-visitor"
            style={{
              width: 267,
              height: 200,
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: "10vh",
              border: "1px solid #ccc",
              pointerEvents: "auto",
              zIndex: "9999",
            }}
            onClick={() => {
              navigate("/visitorlog");
            }}
          >
            +
          </div>
        )}
        {items.map(({ baseName, images, formData }) => {
          return (
            <div
              key={baseName}
              style={{
                paddingBottom: isPlaying ? " " : "1vh",
                width: isMobile ? "100%" : "",
                height: isMobile ? "auto" : "",
              }}
            >
              {images
                .filter(({ key }) => key.endsWith("-dithered.png"))

                .map(({ key, url }, index) => {
                  const unditheredKey = key.replace(
                    "-dithered.png",
                    "-undithered.png"
                  );
                  const unditheredImage = images.find(
                    (img) => img.key === unditheredKey
                  );
                  return (
                    <img
                      key={key}
                      src={url}
                      alt={key}
                      className={`${isMobile ? "" : "hover-zoom"}`}
                      style={{
                        width: isMobile ? "100%" : 267,
                        height: "auto",
                        objectFit: "contain",
                        border: "1px solid #ccc",
                        cursor: "pointer",
                        alignItems: "center",
                        justifyContent: "center",
                        animation: "fadeIn 0.5s forwards",
                        pointerEvents: clickedImage ? "none" : "all",
                        transition:
                          "transform 0.3s ease, width 0.3s ease, height 0.3s ease",
                        animationDelay: `${index * 1}s`, // 👈 stagger here
                      }}
                      onClick={() => {
                        if (unditheredImage) {
                          setClickedImage(unditheredImage.url); // pass undithered image URL here
                          setClickedFormData(formData);
                        } else {
                          console.warn("No undithered image found for", key);
                        }
                      }}
                      onMouseEnter={() => {
                        setHoveredForm(formData);
                      }}
                      onMouseLeave={() => {
                        setHoveredForm(null);
                      }}
                    />
                  );
                })}
            </div>
          );
        })}
      </div>
      {clickedImage && !isMobile && (
        <div
          ref={containerRef}
          style={{
            display: "flex",
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            gap: "2rem",
            padding: "1rem",
            alignItems: "flex-start",
            background: "white",
            borderRadius: "8px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            zIndex: 1000,
            animation: "fadeIn 1s forwards",
            pointerEvents: "auto",
          }}
        >
          {/* Left: Dithered Image */}

          <div style={{ flex: 1 }}>
            <DitheredImageCanvas
              imageUrl={clickedImage}
              width={640}
              height={480}
            />
          </div>

          {/* Right: Form Data */}
          <div>
            <div
              style={{
                flex: 1,
                background: "#f7f7f7",
                borderRadius: "8px",
                padding: "1rem",
                fontSize: "14px",
                maxHeight: 480,
                overflow: "auto",
                width: 300,
              }}
            >
              {clickedFormData ? (
                <>
                  <div
                    style={{
                      fontFamily: "Helvetica, Arial, sans-serif",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "0.5rem",
                        justifyContent: "space-between", // add this line
                        alignItems: "flex-start", // aligns items at the top
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.5vh",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "4vh",
                            fontWeight: "900",
                            textTransform: "uppercase",
                          }}
                        >
                          {clickedFormData.username}
                        </div>
                        <div
                          style={{
                            fontSize: "1.4vh",
                            fontWeight: "900",
                            textTransform: "uppercase",
                          }}
                        >
                          {clickedFormData.profession}
                        </div>
                      </div>
                      <div>
                        <img
                          src={starSignIcons[clickedFormData.starsign]}
                          width="40vh"
                          height="40vh"
                          style={{
                            right: "0",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <p>No form data found</p>
              )}
            </div>
            <div
              style={{
                paddingLeft: ".8vw",
                paddingTop: "1vh",
                paddingBottom: "0",
                color: "gray",
                fontSize: "1.3vh",
                fontFamily: "dot",
              }}
            >
              {clickedFormData.timestamp
                ? (() => {
                    const date = new Date(clickedFormData.timestamp);
                    const day = date.getDate();
                    const month = date.getMonth() + 1;
                    const year = date.getFullYear().toString().slice(2);
                    const hours = date.getHours().toString().padStart(2, "0");
                    const minutes = date
                      .getMinutes()
                      .toString()
                      .padStart(2, "0");
                    return `${day}/${month}/${year} ${hours}:${minutes}`;
                  })()
                : "No timestamp available"}
            </div>
            <div
              style={{
                paddingLeft: ".85vw",
                paddingTop: "1vh",
                paddingBottom: "0",
                fontSize: "1.6vh",
                fontFamily: "dot",
                fontStyle: "italic",
                color: "gray",
              }}
            >
              {clickedFormData.question ||
                "No question provided. This is a bug, please report it."}
            </div>
            <div
              style={{
                paddingLeft: ".85vw",
                paddingTop: "1vh",
                fontFamily: "dot",
                fontSize: "1.6vh",
              }}
            >
              {"“" + clickedFormData.answer + "”"}
            </div>
          </div>
        </div>
      )}
      {clickedImage && isMobile && (
        <div
          ref={containerRef}
          style={{
            display: "flex",
            flexDirection: "column",
            position: "fixed",
            width: "80vw",
            top: "50%",
            left: isPlaying ? "47%" : "50%",
            transform: isPlaying
              ? "translate(-50%, -50%) "
              : "translate(-50%, -50%) ",
            gap: "1rem",
            padding: "1rem",
            paddingBottom: "4vh",
            alignItems: "flex-start",
            background: "white",
            borderRadius: "8px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            zIndex: 980,
            animation: "fadeIn 1s forwards",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "auto",
              overflow: "hidden",
            }}
          >
            <DitheredImageCanvas
              imageUrl={clickedImage}
              width={640}
              height={480}
            />
          </div>

          <div>
            <div
              style={{
                flex: 1,
                background: "#f7f7f7",
                borderRadius: "8px",
                padding: "1rem",
                fontSize: "14px",
                maxHeight: 480,
                overflow: "auto",
                width: "19.5rem",
              }}
            >
              {clickedFormData ? (
                <>
                  <div
                    style={{
                      fontFamily: "Helvetica, Arial, sans-serif",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "0.5rem",
                        justifyContent: "space-between", // add this line
                        alignItems: "flex-start", // aligns items at the top
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.5vh",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "3vh",
                            fontWeight: "900",
                            textTransform: "uppercase",
                          }}
                        >
                          {clickedFormData.username}
                        </div>
                        <div
                          style={{
                            fontSize: "1.7vh",
                            fontWeight: "900",
                            textTransform: "uppercase",
                          }}
                        >
                          {clickedFormData.profession}
                        </div>
                      </div>
                      <div>
                        <img
                          src={starSignIcons[clickedFormData.starsign]}
                          width="50vh"
                          height="50vh"
                          style={{
                            right: "0",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <p>No form data found</p>
              )}
            </div>

            <div
              style={{
                paddingLeft: ".85vw",
                paddingTop: "1vh",
                color: "gray",
                fontSize: "2vh",
                fontFamily: "dot",
                fontStyle: "italic",
              }}
            >
              {clickedFormData.question ||
                "No question provided. This is a bug, please report it."}
            </div>
            <div
              style={{
                paddingLeft: ".85vw",
                paddingTop: "1vh",
                fontFamily: "dot",
                fontSize: "2vh",
              }}
            >
              {"“" + clickedFormData.answer + "”"}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
