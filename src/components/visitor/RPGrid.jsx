import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CustomCursor } from "../ui/CustomCursor";
import { VisitorModal } from "../modals/VisitorModal";
import { shuffle, fetchJson } from "../../utils/arrayUtils";
import { IMAGES_API, DATA_API } from "../../utils/constants";

export function RPGrid({
  isPlaying,
  isMobile,
  darkMode,
  selectedQuestion,
  setSelectedQuestion,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  const [hoveredForm, setHoveredForm] = useState();
  const [clickedImage, setClickedImage] = useState(null);
  const [clickedImageDithered, setClickedImageDithered] = useState(null);
  const [clickedFormData, setClickedFormData] = useState(null);
  const [gyroPermission, setGyroPermission] = useState(false);

  const containerRef = useRef(null);

  // Request gyroscope permission on mobile
  const requestGyroPermission = async () => {
    if (!isMobile) return;
    
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      try {
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission === "granted") {
          setGyroPermission(true);
        }
      } catch (error) {
        console.log("Gyroscope permission denied:", error);
      }
    } else {
      // Non-iOS devices don't need permission
      setGyroPermission(true);
    }
  };

  // Filter items based on selected question
  const filteredItems = useMemo(() => {
    if (!selectedQuestion) return items;
    return items.filter(
      ({ formData }) => formData?.question === selectedQuestion
    );
  }, [items, selectedQuestion]);

  const closeModal = () => {
    setClickedImage(null);
    setClickedImageDithered(null);
    setClickedFormData(null);
  };

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
        // setError("Failed to load gallery data.");
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

  return (
    <>
      {hoveredForm && !isMobile && (
        <CustomCursor hoveredForm={hoveredForm} hovered={!!hoveredForm} />
      )}
      <div
        className="rpgrid-container"
        style={{
          display: isMobile ? "block" : "flex",
          position: isMobile ? "relative" : "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: isMobile ? "auto" : 0,
          width: "100%",
          padding: "1%",
          paddingTop: isMobile ? "80px" : "1%",
          paddingRight: !isMobile && isPlaying ? "110px" : "1%",
          boxSizing: "border-box",
          transition: "padding-right 0.3s ease, opacity 1s ease-out",
          overflowY: isMobile ? "visible" : "auto",
          overflowX: "hidden",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {!isMobile && (
          <div
            style={{
              width: "calc(3vw + 284px)", // Match bookmark's left position + width
              flexShrink: 0,
            }}
          />
        )}

        <div
          style={{
            display: "grid",
            flex: 1,
            gridTemplateColumns: isMobile
              ? "repeat(2, 1fr)"
              : "repeat(auto-fill,minmax(250px,1fr))",
            gap: isMobile ? "2vw" : "12px",
            filter: clickedImage ? "blur(5px)" : "none",
            transition: "filter 0.7s ease-out",
            pointerEvents: clickedImage ? "none" : "auto",
            alignContent: "start",
          }}
        >
          {!isMobile && (
            <div
              className="new-visitor"
              style={{
                width: "100%",
                aspectRatio: "1 / 1",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: "10vh",
                border: "1px solid #ccc",
                pointerEvents: "auto",
                zIndex: "99",
              }}
              onClick={() => {
                navigate("/visitorcheck");
              }}
            >
              +
            </div>
          )}

          {filteredItems.map(({ baseName, images, formData }) => {
            return (
              <div
                key={baseName}
                style={{
                  width: "100%",
                  height: "auto",
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
                          width: "100%",
                          height: "auto",
                          aspectRatio: "1 / 1",
                          objectFit: "cover",
                          border: isMobile ? "none" : "1px solid #ccc",
                          cursor: "pointer",
                          display: "block", // Removes inline image gap
                          animation: "fadeIn 0.5s forwards",
                          pointerEvents: clickedImage ? "none" : "all",
                          transition:
                            "transform 0.3s ease, width 0.3s ease, height 0.3s ease",
                          animationDelay: `${index * 1}s`,
                        }}
                        onClick={async (e) => {
                          // Prevent clicks when mobile menu is open
                          if (
                            document.body.classList.contains("mobile-menu-open")
                          ) {
                            e.preventDefault();
                            e.stopPropagation();
                            return;
                          }
                          
                          // Request gyroscope permission on mobile before opening modal
                          if (isMobile) {
                            await requestGyroPermission();
                          }
                          
                          if (unditheredImage) {
                            setClickedImage(unditheredImage.url); // Set undithered image as main
                            setClickedImageDithered(url); // Set dithered image
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

        <VisitorModal
          clickedImage={clickedImage}
          clickedImageDithered={clickedImageDithered}
          clickedFormData={clickedFormData}
          isMobile={isMobile}
          isPlaying={isPlaying}
          darkMode={darkMode}
          containerRef={containerRef}
          onClose={closeModal}
          gyroPermissionGranted={gyroPermission}
        />
      </div>
    </>
  );
}
