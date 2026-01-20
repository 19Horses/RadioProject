// CameraSnapBayerLiveDither.js
import React, { useState, useRef, useEffect, useCallback } from "react";
import Sketch from "react-p5";
import AriesIcon from "../../assets/starsigns/aries.svg";
import TaurusIcon from "../../assets/starsigns/taurus.svg";
import GeminiIcon from "../../assets/starsigns/gemini.svg";
import CancerIcon from "../../assets/starsigns/cancer.svg";
import LeoIcon from "../../assets/starsigns/leo.svg";
import VirgoIcon from "../../assets/starsigns/virgo.svg";
import LibraIcon from "../../assets/starsigns/libra.svg";
import ScorpioIcon from "../../assets/starsigns/scorpio.svg";
import SagittariusIcon from "../../assets/starsigns/sagitarrius.svg";
import CapricornIcon from "../../assets/starsigns/capricorn.svg";
import AquariusIcon from "../../assets/starsigns/aquarius.svg";
import PiscesIcon from "../../assets/starsigns/pisces.svg";
// import chevron from "../../assets/chevron.png";
import { uploadToBackend } from "../../utils/s3Upload";
import { useNavigate } from "react-router-dom";
import "./RPHead.css";
import {
  CURRENT_QUESTION,
  CURRENT_QUESTION_AUTHOR,
  CURRENT_QUESTION_AUTHOR_INSTAGRAM,
} from "../../utils/constants";

const questionAuthor = CURRENT_QUESTION_AUTHOR;
const questionAuthorInstagram = CURRENT_QUESTION_AUTHOR_INSTAGRAM;
const questions = [CURRENT_QUESTION];

export default function RPHead({ isMobile, isPlaying }) {
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
    const targetAspect = isMobile ? 4 / 3 : 4 / 3;
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
      window.dispatchEvent(new CustomEvent("photoSnapped"));
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
  // const [showNameLabel, setShowNameLabel] = useState(true);
  // const [showProfessionLabel, setShowProfessionLabel] = useState(true);
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
      // setShowNameLabel(false);
      setTimeout(() => setStep(1), 200);
    } else if (step === 1) {
      // setShowProfessionLabel(false);
      setTimeout(() => setStep(2), 200);
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const generateRandomQuestion = useCallback(() => {
    const index = Math.floor(Math.random() * questions.length);
    const question = questions[index];
    setRandomQuestion(question);

    setInputs((prev) => ({
      ...prev,
      question, // ✅ Save question in form inputs
      questionAuthor, // Save who asked the question
      questionAuthorInstagram, // Save their Instagram
      timestamp: new Date().toISOString(), // Add timestamp
    }));
  }, []);

  useEffect(() => {
    if (snapped) {
      generateRandomQuestion();
    }
  }, [snapped, generateRandomQuestion]);

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
      let dx = isMobile
        ? (p5canvas.width - displayWidth) / 2 - 420
        : (p5canvas.width - displayWidth) / 2;
      const dy = 0;

      if (isMobile) {
        // Crop extra from the right side (e.g., 40px)
        const extraCrop = 0;
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

    // Set the target aspect ratio
    const targetAspect = isMobile ? 3 / 4 : 4 / 3;

    // Determine crop area from the original
    let sx, sy, sWidth, sHeight;
    if (originalWidth / originalHeight > targetAspect) {
      // Too wide → crop sides
      sHeight = originalHeight;
      sWidth = sHeight * targetAspect;
      sx = (originalWidth - sWidth) / 2;
      sy = 0;
    } else {
      // Too tall → crop top/bottom
      sWidth = originalWidth;
      sHeight = sWidth / targetAspect;
      sx = 0;
      sy = (originalHeight - sHeight) / 2;
    }

    // Set canvas size to the cropped size
    unditheredCanvas.width = sWidth;
    unditheredCanvas.height = sHeight;

    const ctx = unditheredCanvas.getContext("2d");
    ctx.drawImage(
      originalCanvas,
      sx,
      sy,
      sWidth,
      sHeight, // source crop
      0,
      0,
      sWidth,
      sHeight // destination
    );

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
    setTimeout(() => navigate("/visitorlog"), 1100);
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

  // Listen for retake event from bookmark
  useEffect(() => {
    const handleRetake = () => {
      setSnapped(false);
      setInputs({
        username: "",
        profession: "",
        starsign: "",
        question: "",
        answer: "",
        deviceType: isMobile ? "mobile" : "desktop",
      });
    };

    window.addEventListener("retakePhoto", handleRetake);
    return () => window.removeEventListener("retakePhoto", handleRetake);
  }, [isMobile]);

  // Dispatch form validity state to bookmark component
  useEffect(() => {
    const isFormValid =
      inputs.username?.trim().length >= 2 &&
      inputs.profession?.trim().length >= 2 &&
      inputs.answer?.trim().length >= 2;

    window.dispatchEvent(
      new CustomEvent("formValidityChanged", {
        detail: { isValid: isFormValid },
      })
    );
  }, [inputs.username, inputs.profession, inputs.answer]);

  const currentSign = inputs.starsign || "Aries";
  const currentIcon = starSignIcons[currentSign];

  return (
    <div
      className={`rphead-wrapper ${
        isMobile ? "rphead-wrapper-mobile" : "rphead-wrapper-desktop"
      }`}
    >
      {/* Spacer for bookmark on desktop */}
      {!isMobile && <div className="rphead-spacer" />}

      {/* RPHead content container */}
      <div
        className={`rphead-container ${
          isMobile ? "rphead-container-mobile" : "rphead-container-desktop"
        } ${
          submitted
            ? "rphead-container-submitted"
            : "rphead-container-not-submitted"
        } ${isPlaying && !isMobile ? "rphead-container-playing" : ""}`}
      >
        <div
          className={`rphead-content-wrapper ${
            isMobile
              ? "rphead-content-wrapper-mobile"
              : "rphead-content-wrapper-desktop"
          } ${
            snapped
              ? "rphead-content-wrapper-snapped"
              : "rphead-content-wrapper-not-snapped"
          } ${
            isMobile && window.innerWidth <= 400
              ? "rphead-content-wrapper-mobile-scale-small"
              : isMobile
              ? "rphead-content-wrapper-mobile-scale-medium"
              : ""
          }`}
        >
          <div className="visitor-log-form">
            <div
              className={`rphead-canvas-container ${
                isMobile
                  ? "rphead-canvas-container-mobile"
                  : "rphead-canvas-container-desktop"
              } ${
                snapped
                  ? "rphead-canvas-container-snapped"
                  : "rphead-canvas-container-not-snapped"
              } rphead-canvas-container-transition`}
            >
              <div ref={canvasContainerRef} className="p5Container">
                <div
                  className={`rphead-canvas-wrapper ${
                    isMobile
                      ? "rphead-canvas-wrapper-mobile"
                      : "rphead-canvas-wrapper-desktop"
                  } ${
                    snapped
                      ? "rphead-canvas-wrapper-snapped"
                      : "rphead-canvas-wrapper-not-snapped"
                  }`}
                  style={{
                    width: `${canvasSize.width}px`,
                    height: `${canvasSize.height}px`,
                  }}
                  onClick={handleSnap}
                >
                  <Sketch setup={setup} draw={draw} className="rphead-sketch" />
                </div>
              </div>
            </div>
          </div>

          <div
            className={`rphead-textform ${
              isMobile ? "rphead-textform-mobile" : "rphead-textform-desktop"
            } ${
              isMobile
                ? snapped
                  ? "rphead-textform-mobile-snapped"
                  : "rphead-textform-mobile-not-snapped"
                : snapped
                ? "rphead-textform-desktop-snapped"
                : "rphead-textform-desktop-not-snapped"
            }`}
          >
            <form
              onSubmit={handleSubmit}
              autoComplete="off"
              className="rphead-form"
            >
              <div className="rphead-form-inner">
                <div
                  className={`rphead-form-content ${
                    isMobile
                      ? "rphead-form-content-mobile"
                      : "rphead-form-content-desktop"
                  }`}
                >
                  <>
                    <div className="rphead-fields-container">
                      <div className="rphead-fields-inner">
                        <div
                          className={`rphead-input-group ${
                            isMobile
                              ? "rphead-input-group-mobile"
                              : "rphead-input-group-desktop"
                          }`}
                        >
                          <div className="rphead-input-row">
                            <input
                              id="username"
                              type="text"
                              name="username"
                              pattern="[A-Za-z0-9]*"
                              value={inputs.username || ""}
                              onChange={handleChange}
                              readOnly={step > 0}
                              maxLength={32}
                              placeholder="enter name..."
                              className={`rphead-input ${
                                step > 0
                                  ? "rphead-input-step-greater-than-0"
                                  : "rphead-input-step-0"
                              }`}
                            />
                          </div>

                          <div className="rphead-input-row">
                            <input
                              id="profession"
                              type="text"
                              name="profession"
                              pattern="[A-Za-z0-9]*"
                              value={inputs.profession || ""}
                              onChange={handleChange}
                              readOnly={step > 1}
                              maxLength={32}
                              placeholder="enter profession..."
                              className={`rphead-input ${
                                step > 0
                                  ? "rphead-input-step-greater-than-0"
                                  : "rphead-input-step-0"
                              }`}
                            />
                          </div>
                        </div>

                        {/* Question and Answer - pushed to bottom */}
                        <div className="rphead-question-answer">
                          <span className="rphead-question-author">
                            a question from{" "}
                            <a
                              href={questionAuthorInstagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rphead-question-author-link"
                            >
                              {questionAuthor}
                            </a>
                            ...
                          </span>
                          <label
                            htmlFor="question"
                            className="pulsing-label rphead-question-label"
                          >
                            {randomQuestion}
                          </label>
                          <div className="rphead-textarea-container">
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
                              placeholder="enter answer..."
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                  e.preventDefault(); // prevent newline
                                  handleSubmit(e); // manually trigger submit
                                }
                              }}
                              rows={3}
                              className="rphead-textarea"
                              maxLength={150}
                              ref={textareaRef}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
