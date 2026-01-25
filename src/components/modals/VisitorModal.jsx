import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
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
import DitheredImageCanvas from "../utils/DitheredImageCanvas";

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

export function VisitorModal({
  clickedImage,
  clickedImageDithered,
  clickedFormData,
  isMobile,
  isPlaying,
  containerRef,
  onClose,
}) {
  const boundingRef = useRef(null);
  const mobileCardRef = useRef(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isEntered, setIsEntered] = useState(false);
  const [ditherMode, setDitherMode] = useState(false);
  const [gyroPermission, setGyroPermission] = useState(false);
  const [needsPermission, setNeedsPermission] = useState(false);
  const rafIdRef = useRef(null);
  const cardRef = useRef(null);

  const handleClose = () => {
    setIsClosing(true);

    setTimeout(() => {
      onClose();
      setIsClosing(false);
      setDitherMode(false);
    }, 400); // Match animation duration
  };

  const handleModeSwitch = () => {
    setDitherMode(!ditherMode);
  };

  const handleGyroPermission = async () => {
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      try {
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission === "granted") {
          setGyroPermission(true);
          setNeedsPermission(false);
        }
      } catch (error) {
        console.log("Gyroscope permission denied:", error);
      }
    }
  };

  // Reset closing state and trigger entrance animation when modal opens
  useEffect(() => {
    if (clickedImage) {
      setIsClosing(false);
      setIsEntered(false);
      // Trigger entrance animation after a small delay
      const timer = setTimeout(() => {
        setIsEntered(true);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setIsEntered(false);
    }
  }, [clickedImage]);

  // Lock scroll - avoid overflow:hidden which breaks iOS Safari backdrop
  useEffect(() => {
    if (!clickedImage || !isMobile) return;

    // Store original styles
    const originalTouchAction = document.body.style.touchAction;

    // Only use touch-action to prevent scrolling (no overflow:hidden!)
    document.body.style.touchAction = "none";

    return () => {
      document.body.style.touchAction = originalTouchAction;
    };
  }, [clickedImage, isMobile]);

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  // Gyroscope effect for mobile
  useEffect(() => {
    if (!isMobile || !clickedImage || ditherMode) return;

    // Initialize CSS custom properties
    if (mobileCardRef.current) {
      mobileCardRef.current.style.setProperty("--x-rotation", "0deg");
      mobileCardRef.current.style.setProperty("--y-rotation", "0deg");
      mobileCardRef.current.style.setProperty("--x", "50%");
      mobileCardRef.current.style.setProperty("--y", "50%");
    }

    const handleOrientation = (event) => {
      if (!mobileCardRef.current) return;

      // Get device orientation (beta = front/back tilt, gamma = left/right tilt)
      const beta = event.beta || 0; // -180 to 180 (front/back)
      const gamma = event.gamma || 0; // -90 to 90 (left/right)

      // Normalize and limit rotation values
      const xRotation = Math.max(-15, Math.min(15, gamma * 0.5)); // Left/right tilt
      const yRotation = Math.max(-15, Math.min(15, (beta - 45) * 0.3)); // Front/back tilt (offset by 45 for natural holding angle)

      // Calculate position for shine effect
      const xPercent = ((gamma + 90) / 180) * 100;
      const yPercent = ((beta + 180) / 360) * 100;

      mobileCardRef.current.style.setProperty(
        "--x-rotation",
        `${yRotation}deg`,
      );
      mobileCardRef.current.style.setProperty(
        "--y-rotation",
        `${xRotation}deg`,
      );
      mobileCardRef.current.style.setProperty("--x", `${xPercent}%`);
      mobileCardRef.current.style.setProperty("--y", `${yPercent}%`);
    };

    // Check if permission is needed and set up gyroscope
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      // iOS 13+ requires explicit permission
      setNeedsPermission(true);

      // If permission already granted, add listener
      if (gyroPermission) {
        window.addEventListener("deviceorientation", handleOrientation);
      }
    } else {
      // Non-iOS devices or older iOS - permission not required
      setGyroPermission(true);
      window.addEventListener("deviceorientation", handleOrientation);
    }

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [isMobile, clickedImage, ditherMode, gyroPermission]);

  if (!clickedImage) return null;

  // Desktop Modal with 3D Perspective Effect
  if (!isMobile) {
    return createPortal(
      <div
        className="modal-backdrop"
        style={{
          position: "fixed",
          top: "0",
          right: "0",
          left: "calc(3vw + 284px)",
          bottom: 0,
          zIndex: 99,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
        onClick={handleClose}
      >
        <div
          className="arc-card-wrapper"
          onClick={(e) => e.stopPropagation()}
          style={{
            paddingBottom: isClosing ? "175vh" : "0vh",
            transition: "padding-bottom 0.5s ease-in-out",
            left: isPlaying
              ? "calc(50% + (3vw + 284px) / 2 - 40px)"
              : undefined,
          }}
        >
          <div
            ref={cardRef}
            className={`arc-card ${
              ditherMode ? "arc-card-sketch" : "arc-card"
            }`}
            style={{
              willChange: ditherMode ? "auto" : "transform",
            }}
            onMouseLeave={() => {
              if (ditherMode) return;
              boundingRef.current = null;
              if (rafIdRef.current) {
                cancelAnimationFrame(rafIdRef.current);
                rafIdRef.current = null;
              }
            }}
            onMouseEnter={(ev) => {
              if (ditherMode) return;
              boundingRef.current = ev.currentTarget.getBoundingClientRect();
            }}
            onMouseMove={(ev) => {
              if (ditherMode) return;
              if (!boundingRef.current) return;

              const x = ev.clientX - boundingRef.current.left;
              const y = ev.clientY - boundingRef.current.top;
              const xPercentage = x / boundingRef.current.width;
              const yPercentage = y / boundingRef.current.height;
              const xRotation = (xPercentage - 0.5) * 20;
              const yRotation = (0.5 - yPercentage) * 20;

              // Cancel any pending animation frame
              if (rafIdRef.current) {
                cancelAnimationFrame(rafIdRef.current);
              }

              // Schedule update for next frame
              rafIdRef.current = requestAnimationFrame(() => {
                if (cardRef.current) {
                  cardRef.current.style.setProperty(
                    "--x-rotation",
                    `${yRotation}deg`,
                  );
                  cardRef.current.style.setProperty(
                    "--y-rotation",
                    `${xRotation}deg`,
                  );
                  cardRef.current.style.setProperty(
                    "--x",
                    `${xPercentage * 100}%`,
                  );
                  cardRef.current.style.setProperty(
                    "--y",
                    `${yPercentage * 100}%`,
                  );
                }
              });
            }}
          >
            <div>
              <div>
                <img
                  className="arc-card-image"
                  src={clickedImageDithered}
                  alt="clickedImage"
                />
              </div>
              <div
                className="arc-card-footer"
                style={{
                  paddingTop: ".1rem",
                  paddingBottom: ".5rem",
                  color: ditherMode ? "lightgray" : "gray",
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
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 210 210"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    position: "absolute",
                    bottom: "5px",
                    right: "8px",
                    color: "rgb(255, 0, 90)",
                    opacity: 1,
                  }}
                >
                  <path d="M0 0H25.2V210H0V0Z" fill="currentColor" />
                  <path d="M184.8 0H210V210H184.8V0Z" fill="currentColor" />
                  <path d="M0 25.2V0H210V25.2H0Z" fill="currentColor" />
                  <path d="M0 210V184.8H210V210H0Z" fill="currentColor" />
                  <path
                    d="M92.4 50.4H117.6V159.6H92.4V50.4Z"
                    fill="currentColor"
                  />
                  <path
                    d="M159.6 92.4V117.6H50.4V92.4H159.6Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                flex: 1,
              }}
            >
              {/* Top section - Username and profession */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                }}
              >
                <div
                  style={{
                    fontSize: "15px",
                    fontFamily: "dot",
                    fontStyle: "italic",
                    color: "black",
                    textTransform: "uppercase",
                    paddingLeft: "10px",
                    paddingRight: "10px",
                  }}
                >
                  {clickedFormData.username}
                </div>
                <div
                  style={{
                    paddingBottom: "0",
                    fontSize: "15px",
                    fontFamily: "dot",
                    fontStyle: "italic",
                    color: ditherMode ? "lightgray" : "gray",
                    textTransform: "uppercase",
                    paddingLeft: "10px",
                    paddingRight: "10px",
                  }}
                >
                  {clickedFormData.profession}
                </div>
              </div>

              {/* Bottom section - Question and answer */}
              <div style={{ paddingBottom: "15px" }}>
                <div
                  style={{
                    lineHeight: "1.1",
                    padding: "10px",
                    paddingLeft: "10px",
                    paddingRight: "10px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "NeueBit-Regular",
                      fontSize: "18px",
                      color: ditherMode ? "lightgray" : "rgba(67, 74, 71, 0.5)",
                      display: "block",
                    }}
                  >
                    <a
                      href={
                        clickedFormData.questionAuthorInstagram ||
                        "https://instagram.com/radioproject.live"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: "PPNeueBit-Bold",
                        color: "#a1a4a3",
                        textDecoration: "none",
                        transition:
                          "color 0.2s ease, background-color 0.2s ease",
                        padding: "2px 0px",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = "#FFFFFF";
                        e.target.style.backgroundColor = "#434a47";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = ditherMode
                          ? "lightgray"
                          : "rgba(67, 74, 71, 0.7)";
                        e.target.style.backgroundColor = "transparent";
                      }}
                    >
                      {clickedFormData.questionAuthor || "RADIO Project"}
                    </a>{" "}
                    asked...
                  </span>
                  <span
                    className="pulsing-label"
                    style={{
                      fontFamily: "NeueBit-Regular",
                      fontSize: "24px",
                      color: ditherMode ? "white" : "rgba(67, 74, 71, 0.7)",
                      display: "block",
                      paddingBottom: "8px",
                      lineHeight: "0.8",
                    }}
                  >
                    {clickedFormData.question ||
                      "No question provided. This is a bug, please report it."}
                  </span>
                </div>
                <div
                  style={{
                    lineHeight: "1.1",
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    paddingBottom: "10px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "NeueBit-Regular",
                      fontSize: "20px",
                      color: "#a1a4a3",
                      display: "block",
                      lineHeight: "0.5",
                      paddingBottom: "5px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "PPNeueBit-Bold",
                        color: "rgba(67, 74, 71, 0.7)",
                        padding: "2px 4px",
                        paddingLeft: "0",
                      }}
                    >
                      {clickedFormData.username}
                    </span>
                    replied...
                  </span>
                  <span
                    style={{
                      fontFamily: "NeueBit-Regular",
                      fontSize: "30px",
                      display: "block",
                      color: "#8c8f8e",
                      lineHeight: "0.9",
                    }}
                  >
                    {'"' + clickedFormData.answer + '"'}
                  </span>
                </div>
              </div>
            </div>
            <div className="arc-card-hover-overlay" />
          </div>
        </div>
      </div>,
      document.body,
    );
  }

  // Mobile Modal - iOS Safari fix: use env() safe area insets
  return createPortal(
    <>
      {/* Inject CSS for iOS Safari dynamic viewport */}
      <style>{`
        .ios-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          /* Fallback */
          min-height: 100vh;
          /* iOS Safari dynamic viewport */
          min-height: 100dvh;
          min-height: -webkit-fill-available;
          /* Extend into safe areas */
          padding-top: env(safe-area-inset-top);
          padding-bottom: env(safe-area-inset-bottom);
          margin-top: calc(-1 * env(safe-area-inset-top, 0px));
          margin-bottom: calc(-1 * env(safe-area-inset-bottom, 0px));
          box-sizing: content-box;
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: translateX(-50%) scale(1);
            opacity: 1;
          }
          50% {
            transform: translateX(-50%) scale(1.05);
            opacity: 0.9;
          }
        }
      `}</style>
      <div
        className="ios-modal-backdrop"
        style={{
          zIndex: 99999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={handleClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            transform: isClosing
              ? "translateY(100dvh)"
              : isEntered
                ? "translateY(0) scale(1)"
                : "translateY(50dvh)",
            opacity: isClosing ? 0 : isEntered ? 1 : 0,
            transition: "transform 0.4s ease-in-out, opacity 0.3s ease-out",
            perspective: "1000px",
          }}
        >
          <div
            ref={mobileCardRef}
            onClick={needsPermission ? handleGyroPermission : handleModeSwitch}
            style={{
              width: "85vw",
              maxWidth: "400px",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
              backgroundColor: "white",
              transform: ditherMode
                ? "none"
                : "rotateX(var(--x-rotation, 0deg)) rotateY(var(--y-rotation, 0deg))",
              transition: ditherMode
                ? "transform 0.3s ease-out"
                : "transform 0.1s ease-out",
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              willChange: ditherMode ? "auto" : "transform",
              position: "relative",
            }}
          >
            {/* Username and Profession - above image */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px",
                paddingBottom: "3px",
                paddingTop: "6px",
              }}
            >
              <div
                style={{
                  fontFamily: "dot",
                  fontSize: "14px",
                  fontStyle: "italic",
                  color: "black",
                  textTransform: "uppercase",
                }}
              >
                {clickedFormData.username}
              </div>
              <div
                style={{
                  fontFamily: "dot",
                  fontSize: "14px",
                  fontStyle: "italic",
                  color: "gray",
                  textTransform: "uppercase",
                }}
              >
                {clickedFormData.profession}
              </div>
            </div>
            <div style={{ padding: "0 8px 8px 8px", position: "relative" }}>
              <img
                src={clickedImageDithered}
                alt="clickedImage"
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                }}
              />
              {/* Shine overlay effect */}
              {!ditherMode && gyroPermission && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                    background: `radial-gradient(
                      at var(--x, 50%) var(--y, 50%),
                      rgba(255, 255, 255, 0.2) 20%,
                      transparent 80%
                    )`,
                    opacity: 0.6,
                    transition: "opacity 0.3s ease",
                  }}
                />
              )}
              <svg
                width="20"
                height="20"
                viewBox="0 0 210 210"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  position: "absolute",
                  bottom: "14px",
                  right: "14px",
                  color: "rgb(255, 0, 90)",
                  opacity: 0.9,
                }}
              >
                <path d="M0 0H25.2V210H0V0Z" fill="currentColor" />
                <path d="M184.8 0H210V210H184.8V0Z" fill="currentColor" />
                <path d="M0 25.2V0H210V25.2H0Z" fill="currentColor" />
                <path d="M0 210V184.8H210V210H0Z" fill="currentColor" />
                <path
                  d="M92.4 50.4H117.6V159.6H92.4V50.4Z"
                  fill="currentColor"
                />
                <path
                  d="M159.6 92.4V117.6H50.4V92.4H159.6Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            {/* Question section */}
            <div style={{ padding: "4px 12px 12px 12px" }}>
              <span
                style={{
                  fontFamily: "NeueBit-Regular",
                  fontSize: "18px",
                  color: "rgba(67, 74, 71, 0.5)",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                <span
                  style={{
                    fontFamily: "PPNeueBit-Bold",
                    color: "rgba(67, 74, 71, 0.7)",
                  }}
                >
                  {clickedFormData.questionAuthor || "RADIO Project"}
                </span>{" "}
                asked...
              </span>
              <span
                className="pulsing-label"
                style={{
                  fontFamily: "NeueBit-Regular",
                  fontSize: "24px",
                  color: "rgba(67, 74, 71, 0.7)",
                  display: "block",
                  lineHeight: "0.9",
                }}
              >
                {clickedFormData.question || "No question provided."}
              </span>
              {/* Answer section */}
              <span
                style={{
                  fontFamily: "NeueBit-Regular",
                  fontSize: "18px",
                  color: "rgba(67, 74, 71, 0.5)",
                  display: "block",
                  marginTop: "12px",
                  marginBottom: "4px",
                }}
              >
                <span
                  style={{
                    fontFamily: "PPNeueBit-Bold",
                    color: "rgba(67, 74, 71, 0.7)",
                  }}
                >
                  {clickedFormData.username}
                </span>{" "}
                replied...
              </span>
              <span
                className="pulsing-label"
                style={{
                  fontFamily: "NeueBit-Regular",
                  fontSize: "30px",
                  color: "#434a47",
                  display: "block",
                  lineHeight: "0.9",
                }}
              >
                {'"' + clickedFormData.answer + '"'}
              </span>
            </div>
            {/* Gyroscope permission prompt */}
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}
