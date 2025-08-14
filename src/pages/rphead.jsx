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
import { $Command } from "@aws-sdk/client-s3";

export default function RPHead({ isMobile }) {
  const [canvasSize, setCanvasSize] = useState({
    width: 640, // Will be updated by camera
    height: 480, // Will be updated by camera
  });

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
    "What is the most life-changing decision you’ve ever made on a whim?",
  ];

  const navigate = useNavigate();

  const [snapped, setSnapped] = useState(false);
  const videoRef = useRef(null);
  const animationStartTime = useRef(null);
  const snapshotRef = useRef(null);
  const currentTime = new Date().toLocaleDateString();
  const [step, setStep] = useState(0); // Tracks which question we're on
  const textareaRef = useRef();
  const [randomQuestion, setRandomQuestion] = useState("");
  const [submitted, setSubmitted] = useState(false);

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

    canvas.style("height", "100%");
    canvas.style("width", "auto");
    // canvas.style("display", "block");
    // canvas.style("margin", "0 auto");
    p5.background(0);

    if (!videoRef.current) {
      videoRef.current = p5.createCapture(
        {
          video: {
            facingMode: "user",
            // Let the device choose its native resolution
            width: { ideal: isMobile ? 480 : 640 },
            height: { ideal: isMobile ? 640 : 480 },
          },
        },
        () => {
          videoRef.current.hide();
          // Update canvas to match camera's native resolution
          const actualWidth = videoRef.current.width;
          const actualHeight = videoRef.current.height;

          setCanvasSize({
            width: actualWidth,
            height: actualHeight,
          });
          // Resize canvas to match camera resolution
          p5.resizeCanvas(actualWidth, actualHeight);
        }
      );
      // Don't force resize the video - let it use native dimensions
    }
  };

  const draw = (p5) => {
    p5.background(0);
    const video = videoRef.current;
    if (!video) return;

    let scaleFactor = 13;

    p5.push();

    // Mirror horizontally for selfie
    if (isMobile) {
      p5.translate(p5.width, 0);
      p5.scale(-1, 1);
    }

    // Desired aspect ratio
    const targetAspect = isMobile ? 3 / 4 : 4 / 3;
    let sx, sy, sWidth, sHeight;

    if (video.width / video.height > targetAspect) {
      // video too wide → crop sides
      sHeight = video.height;
      sWidth = sHeight * targetAspect;
      sx = (video.width - sWidth) / 2;
      sy = 0;
    } else {
      // video too tall → crop top/bottom
      sWidth = video.width;
      sHeight = sWidth / targetAspect;
      sx = 0;
      sy = (video.height - sHeight) / 2;
    }

    // How large to display the feed (without stretching)
    const displayWidth = p5.height * targetAspect;
    const displayHeight = p5.height;
    const dx = isMobile
      ? (p5.width - displayWidth) / 2 + 140
      : (p5.width - displayWidth) / 2; // ✅ push 20px right
    const dy = 0; // already fills vertically

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

        p5.image(
          img,
          dx,
          dy,
          displayWidth,
          displayHeight,
          sx,
          sy,
          sWidth,
          sHeight
        );
      }
    } else {
      const frame = video.get();
      applyBayerDither(p5, frame, scaleFactor);

      p5.image(
        frame,
        dx,
        dy,
        displayWidth,
        displayHeight,
        sx,
        sy,
        sWidth,
        sHeight
      );
    }

    p5.pop();
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
    setInputs({});
  };

  const [inputs, setInputs] = useState({
    username: "",
    profession: "",
    starsign: "",
    question: "",
    answer: "",
    deviceType: isMobile ? "mobile" : "desktop",
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

    async function getCroppedCanvasBlob() {
      const p5canvas = document.querySelector("canvas");
      if (!p5canvas) throw new Error("Canvas element not found");

      const targetAspect = isMobile ? 3 / 4 : 4 / 3;
      let displayWidth = p5canvas.height * targetAspect;
      const displayHeight = p5canvas.height;
      let dx = (p5canvas.width - displayWidth) / 2;
      const dy = 0;

      if (isMobile) {
        // Crop extra from the right side (e.g., 40px)
        const extraCrop = 421;
        displayWidth -= extraCrop; // shrink the crop width
        // dx stays the same so crop comes off the right side
      }

      const cropCanvas = document.createElement("canvas");
      cropCanvas.width = displayWidth;
      cropCanvas.height = displayHeight;
      const ctx = cropCanvas.getContext("2d");

      ctx.drawImage(
        p5canvas,
        dx,
        dy,
        displayWidth,
        displayHeight,
        0,
        0,
        displayWidth,
        displayHeight
      );

      return new Promise((resolve) => {
        cropCanvas.toBlob((blob) => resolve(blob), "image/png");
      });
    }

    // Convert the dithered canvas to a blob
    const ditheredBlob = await getCroppedCanvasBlob();

    // Create an offscreen canvas for the undithered image
    const originalCanvas = snapshotRef.current?.canvas;
    if (!originalCanvas) {
      alert("No valid image data found in snapshotRef");
      return;
    }

    const originalWidth = originalCanvas.width;
    const originalHeight = originalCanvas.height;

    const unditheredCanvas = document.createElement("canvas");
    unditheredCanvas.width = originalWidth;
    unditheredCanvas.height = originalHeight;

    const ctx = unditheredCanvas.getContext("2d");

    // Draw the full image (no cropping or aspect ratio adjustments)
    ctx.drawImage(originalCanvas, 0, 0);

    const unditheredBlob = await canvasToBlob(unditheredCanvas);

    // Prep file names
    const timestamp = new Date().toISOString();
    const name =
      inputs.username?.replace(/\s+/g, "_").toLowerCase() || "anonymous";

    const ditheredKey = `images/${name}-${timestamp}-dithered.png`;
    const unditheredKey = `images/${name}-${timestamp}-undithered.png`;
    const formKey = `data/${name}-${timestamp}.json`;

    const formBlob = new Blob([JSON.stringify(inputs)], {
      type: "application/json",
    });
    setSubmitted(true);

    try {
      await Promise.all([
        uploadToBackend(ditheredBlob, ditheredKey, "image/png"),
        uploadToBackend(unditheredBlob, unditheredKey, "image/png"),
        uploadToBackend(formBlob, formKey, "application/json"),
      ]);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed. Check console.");
    }
    setTimeout(() => navigate("/visitorcheck"), 1100);
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

    // Camera will set its own dimensions - no resize observer needed
  }, []);

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
    <div
      className="rphead-container"
      style={{
        transform: submitted ? "translateY(-100vh)" : "translateY(0vh)",
        transition: "transform 1s ease-in-out",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: ".5rem",
          padding: "1rem",
          paddingRight: ".9rem",
          scale: isMobile ? "0.85" : "",

          background: snapped ? "white" : "unset",
          borderRadius: "8px",
          boxShadow: snapped ? "0 4px 20px rgba(0,0,0,0.2)" : "unset",
          transition: "all 1.3s ease-in-out",
        }}
      >
        <div
          className="visitor-log-form"
          style={{
            display: "flex",
            justifyContent: "center", // 👈 always center, use transform for movement
            alignItems: "center", // 👈 optional: center vertically
            transition: "width 1.3s ease-in-out",
          }}
        >
          <div
            style={{
              width: isMobile ? "80vw" : "min(90vw, 45vw)",
              height: "auto",
              // Let the canvas determine its own aspect ratio based on camera
              position: "relative",
              transitionDelay: snapped ? "0.5s" : "0s",
              transition: "all 1.3s ease-in-out",
              display: "flex",
            }}
          >
            <div
              ref={canvasContainerRef}
              className="p5Container"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center", // 👈 centers vertically
                alignItems: "center", // 👈 centers horizontally
                width: "100%",
                height: "100%", // 👈 important so it has space to center within
              }}
            >
              <div
                style={{
                  width: `${canvasSize.width}px`,
                  height: `${canvasSize.height}px`,
                  aspectRatio: isMobile ? "3 / 4" : "4 / 3",
                  maxWidth: "100%",
                  maxHeight: "100%",
                  overflow: "hidden",
                  cursor: snapped ? "default" : "pointer",
                  pointerEvents: snapped ? "none" : "auto",
                }}
                onClick={handleSnap}
              >
                <Sketch
                  setup={setup}
                  draw={draw}
                  style={{
                    display: "block",
                    margin: "0 auto", // ✅ centers horizontally
                    maxWidth: "100%", // ✅ responsive
                    height: "auto",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div
          className={
            isMobile ? "visitor-log-textform-mobile" : "visitor-log-textform"
          }
          style={{
            display: "flex",
            justifyContent: isMobile ? "" : "center", // 👈 always center, use transform for movement
            height: isMobile ? (snapped ? "35vh" : "0vh") : "auto",
            width: isMobile ? "0" : snapped ? "320px" : "0",
            opacity: snapped ? "1" : "0",
            pointerEvents: snapped ? "auto" : "none",
            transition: isMobile
              ? snapped
                ? "height 1.3s ease-in-out, opacity 1.3s ease-in-out .7s"
                : "height 1.3s ease-in-out, opacity .5s ease-in-out "
              : snapped
              ? "width 1.3s ease-in-out, opacity 1.3s ease-in-out .7s"
              : "width 1.3s ease-in-out, opacity .5s ease-in-out ",
          }}
        >
          <form
            onSubmit={handleSubmit}
            autoComplete="off"
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <div style={{ flexGrow: 1, overflowY: "auto" }}>
              <div
                style={{
                  flex: 1,
                  background: "#f7f7f7",
                  borderRadius: "8px",
                  padding: "1rem",
                  fontSize: "14px",
                  maxHeight: 480,
                  overflow: "auto",
                  width: isMobile ? "73vw" : 300,
                }}
              >
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
                        justifyContent: "space-between", // add this line
                        alignItems: "flex-start", // aligns items at the top
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: isMobile ? "0" : "0.5vh",
                          position: "relative", // Make sure it's not statically positioned
                          overflow: "visible", // ✅ allow children to overflow
                          zIndex: 1, // This can stay, but child must be higher
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            width: "100%",
                          }}
                        >
                          <input
                            id="username"
                            type="text"
                            name="username"
                            pattern="[A-Za-z0-9]*"
                            value={inputs.username || ""}
                            onChange={handleChange}
                            readOnly={step > 0}
                            placeholder="enter name"
                            style={{
                              fontSize: "4vh",
                              fontWeight: "900",
                              textTransform: "uppercase",
                              width: "100%",
                              paddingLeft: "0",
                              // borderBottom: "1px solid",
                              // borderColor: step > 0 ? "transparent" : "#000",
                              marginBottom: step > 0 ? "0vh" : "",
                              transition: " border-color .2s ease-in-out",
                            }}
                          />
                        </div>
                        <div
                          style={{
                            fontSize: "1.4vh",
                            fontWeight: "900",
                            textTransform: "uppercase",
                            display: "flex",
                            flexDirection: "row",
                          }}
                        >
                          <input
                            id="profession"
                            type="text"
                            name="profession"
                            value={inputs.profession || ""}
                            onChange={handleTAChange}
                            readOnly={step > 1}
                            placeholder="enter profession"
                            style={{
                              fontSize: "2vh",
                              fontWeight: "900",
                              textTransform: "uppercase",
                              width: "75%",
                              paddingLeft: "0",
                              // borderBottom: "1px solid",
                              // borderColor: step > 0 ? "transparent" : "#000",

                              marginBottom: step > 0 ? "0vh" : "",
                              transition: " border-color .2s ease-in-out",
                            }}
                          />
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: ".3rem",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <img
                            src={currentIcon}
                            width="40vh"
                            height="40vh"
                            style={{
                              justifyContent: "flex-end",
                              animation: "fadeIn 1s forwards",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    paddingLeft: isMobile ? "2.3vw" : "1vw",
                    paddingTop: "1vh",
                    color: "gray",
                    fontSize: "1.3vh",
                    fontFamily: "dot",
                  }}
                >
                  {currentTime}
                </div>
                <div
                  style={{
                    paddingLeft: "1vw",
                    paddingTop: ".5vh",
                    paddingRight: "1vw",
                  }}
                >
                  <StarSignStep
                    inputs={inputs}
                    setInputs={setInputs}
                    step={2}
                    handleNext={handleNext}
                    setStep={setStep}
                    style={{ left: "20vw" }}
                    isMobile={isMobile}
                  />
                </div>
              </div>
              <div
                style={{
                  paddingLeft: ".85vw",
                  paddingTop: "1vh",
                  paddingBottom: "0",
                  fontSize: "1.6vh",
                  fontFamily: "dot",
                  color: "gray",
                }}
              >
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
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column-reverse",
                      }}
                    >
                      <textarea
                        id="answer"
                        name="answer"
                        value={inputs.answer || ""}
                        onChange={(e) => {
                          handleTAChange(e);

                          const el = textareaRef.current;
                          if (el) {
                            el.style.height = "auto"; // Reset height to shrink if needed
                            el.style.height = `${el.scrollHeight}px`; // Set to scroll height
                          }
                        }}
                        placeholder="ENTER ANSWER"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault(); // prevent newline
                            handleSubmit(e); // manually trigger submit
                          }
                        }}
                        rows={3}
                        style={{
                          paddingBottom: ".5vh",
                          marginBottom: ".5vh",
                          resize: "none",
                          overflow: "hidden",
                          fontFamily: "dot",
                          border: "none",
                          backgroundColor: "transparent",
                          fontSize: isMobile ? "2vh" : "1.6vh",
                          width: "95%",
                          borderBottom: "1px solid #000000",
                          minHeight: "1vh", // 👈 prevents the jumpiness
                          lineHeight: "1", // 👈 makes growth more consistent
                        }}
                        maxLength={150}
                        ref={textareaRef}
                      />
                    </div>
                    <label
                      htmlFor="question"
                      className="pulsing-label"
                      style={{
                        paddingTop: "1vh",
                        width: "100%",
                        fontFamily: "dot",
                        fontSize: isMobile ? "2vh" : "1.6vh",
                        color: "black",
                      }}
                    >
                      {randomQuestion}
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-end",
              }}
            >
              <button
                type="button"
                style={{ fontSize: "2vh", fontFamily: "dot", color: "black" }}
                onClick={handleReset}
              >
                RETAKE
              </button>
              <button
                type="submit"
                disabled={
                  !inputs.answer ||
                  !inputs.profession ||
                  !inputs.username ||
                  !inputs.answer ||
                  !inputs.starsign
                }
                style={{ fontSize: "2vh", fontFamily: "dot", color: "black" }}
              >
                POST
              </button>
            </div>
          </form>
        </div>
      </div>
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
              height: 267,
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
                        aspectRatio: "1 / 1",
                        objectFit: "cover",
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
              isMobile={isMobile}
              imageUrl={clickedImage}
              deviceType={clickedFormData.deviceType}
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
            width: clickedFormData.deviceType === "mobile" ? "70vw" : "80vw",
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
              isMobile={isMobile}
              imageUrl={clickedImage}
              deviceType={clickedFormData.deviceType}
            />
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                flex: 1,
                background: "#f7f7f7",
                borderRadius: "8px",
                padding: "1rem",
                fontSize: "14px",
                maxHeight: 480,
                width: "70%",
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
              className="pulsing-label"
              style={{
                paddingLeft: ".85vw",
                paddingTop: "1vh",
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
                maxWidth: "100%",
                paddingLeft: ".85vw",
                paddingTop: "1vh",
                fontFamily: "dot",
                fontSize: "2vh",
                wordBreak: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "normal",
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
