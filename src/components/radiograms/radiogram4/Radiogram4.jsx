import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./Radiogram4.css";

// Import location images
import stonehengeImg from "./Stonehenge2007_07_30.webp";
import cursusBarrowImg from "./Stonehenge_tumulus.webp";
import innerCircleImg from "./0002-Stonehenge-Restored-plan-q85-1165x1066.webp";
import catAndMuttonImg from "./Regent's_Canal,_Cat_and_Mutton_Bridge_and_Acton's_Lock_-_geograph.org.uk_-_1727977.webp";
import victoriaParkImg from "./victoria-park-london-1748262143.webp";
import wohnheimImg from "./210_020-021.webp";
import parkBenchImg from "./unnamed-2.webp";
import malagaImg from "./Vista_de_Málaga_desde_el_castillo_de_Gibralfaro,_España,_2023-05-20,_DD_113.webp";

// Location data with coordinates
const locations = {
  cursusBarrow: {
    name: "Cursus Barrows",
    coords: "51.1833° N, 1.8167° W",
    lat: 51.1833,
    lng: -1.8167,
    place: "Wiltshire, England",
    image: cursusBarrowImg,
  },

  innerCircle: {
    name: "Inner Circle, Stonehenge",
    coords: "51.1789° N, 1.8262° W",
    lat: 51.1789,
    lng: -1.8262,
    place: "Wiltshire, England",
    image: innerCircleImg,
  },
  catAndMutton: {
    name: "Cat and Mutton Bridge",
    coords: "51.5377° N, 0.0593° W",
    lat: 51.5377,
    lng: -0.0593,
    place: "Hackney, London",
    image: catAndMuttonImg,
  },
  wohnheim: {
    name: "Wohnheim Franz-Mehring-Platz",
    coords: "52.5134° N, 13.4380° E",
    lat: 52.5134204,
    lng: 13.4380178,
    place: "Berlin, Germany",
    image: wohnheimImg,
  },
  parkBench: {
    name: "Original Gemüse Kebab",
    coords: "52.4914° N, 13.3948° E",
    lat: 52.4914372,
    lng: 13.3947508,
    place: "Kreuzberg, Berlin",
    image: parkBenchImg,
  },
  malaga: {
    name: "Málaga",
    coords: "36.7213° N, 4.4214° W",
    lat: 36.7213,
    lng: -4.4214,
    place: "Andalusia, Spain",
    image: malagaImg,
  },
};

// Location cursor component
const LocationCursor = ({ location, mousePos, isFadingOut }) => {
  if (!location || !mousePos) return null;

  return createPortal(
    <div
      className={`location-cursor ${isFadingOut ? "fading-out" : ""}`}
      style={{
        left: mousePos.x + 15,
        top: mousePos.y - 10,
      }}
    >
      {location.image && (
        <img
          className="location-cursor-image"
          src={location.image}
          alt={location.name}
        />
      )}
      <div className="location-cursor-info">
        <div className="location-cursor-coords">
          {location.coords} → {location.place}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export const Radiogram4 = () => {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [hoveredLocation, setHoveredLocation] = useState(null);
  const [mousePos, setMousePos] = useState(null);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const fadeTimeoutRef = useRef(null);

  // Track mouse position when hovering over a location
  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleLocationEnter = (locationKey, e) => {
    if (isMobile) return;
    // Clear any pending fade out
    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current);
      fadeTimeoutRef.current = null;
    }
    setIsFadingOut(false);
    setHoveredLocation(locations[locationKey]);
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleLocationClick = (locationKey) => {
    const location = locations[locationKey];
    // Open in Google Maps
    const mapsUrl = `https://maps.google.com/?q=${location.lat},${location.lng}`;
    window.open(mapsUrl, "_blank");
  };

  const handleLocationLeave = () => {
    setIsFadingOut(true);
    fadeTimeoutRef.current = setTimeout(() => {
      setHoveredLocation(null);
      setMousePos(null);
      setIsFadingOut(false);
    }, 250); // Match animation duration
  };

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Use requestAnimationFrame to batch DOM updates for better performance
          requestAnimationFrame(() => {
            entry.target.classList.add("visible");

            // Remove will-change after animation completes to free up resources
            setTimeout(() => {
              entry.target.style.willChange = "auto";
            }, 2000); // Match longest transition duration
          });
        }
      });
    }, observerOptions);

    // Observe all paragraphs
    const paragraphs = containerRef.current?.querySelectorAll("p");

    // Batch DOM updates with requestAnimationFrame
    requestAnimationFrame(() => {
      paragraphs?.forEach((p) => {
        p.classList.add("fade-blur");
        observer.observe(p);
      });
    });

    return () => {
      paragraphs?.forEach((p) => {
        observer.unobserve(p);
      });
      observer.disconnect();
    };
  }, []);

  return (
    <div className="radiogram-4" ref={containerRef}>
      <p
        style={{
          width: isMobile ? "80%" : undefined,
          fontFamily: "lust-display",
          opacity: 0.7,
          fontSize: "1.3rem",
          letterSpacing: "-0.1rem",
        }}
      >
        I
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        We waited on a{" "}
        <span
          className="location-link"
          onMouseEnter={(e) => handleLocationEnter("cursusBarrow", e)}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleLocationLeave}
          onClick={() => handleLocationClick("cursusBarrow")}
        >
          cursus barrow
        </span>{" "}
        as the queues had melded into a mass. It would ease up and we’d be
        closer to the sunset here. It was marked by high drumsong collapsing
        into human shouts. There were few sheep on the fields beneath, babies
        and mothers, clipped ears. I took pictures of Gaby and Luke in the pink
        dusk that turned lilac and indigo.{" "}
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        Dianne and George in heavy gear parked their e-bikes at the barrow’s
        base. They wore white and black bandanas and did their best to tolerate
        us, the newly high, just out of London. They had been to every such
        landmark in England, pulling up a youtube video about a nearby valley of
        prehistoric stones, ‘worth a visit’. I asked if they were
        archaeologists, ‘just old’ Diane offered ‘and nothing better to do than
        look at stones’.{" "}
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        They were spending the night on the barrow, watching the solstice from
        outside Stonehenge, ‘not until we get our stones back’. In 1977
        Stonehenge was roped off, then formally fenced in 1978, with visitors
        only allowed to walk up to them at pre-arranged dates and times. You
        used to be able to drive right up to the stones, touch them, carve
        pictures in their moss.
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        Luke asked about the meaning. ‘That’s the point, no one knows, it’s all
        conjecture at this point!’ George’s eyes widened behind sunglasses.
        Dianne laughed when I told her I’d only brought the clothes I was
        wearing.
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined, textAlign: "center" }}>
        - - -
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        It felt like any other festival, food trucks and merchandise. There was
        no Momo truck, maybe next year. Mapping where the nearest dark kitchen
        could be. The improperness of the opening scene struck something hollow
        in me, ‘funny’, I’d repeat.
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        A lone trumpet played a standard, a couple with elven ears pressed their
        heads against a stone in silence. The stones hold heat from the day’s
        sun. They were cast in a deep blue, like a UV. Drumming at the{" "}
        <span
          className="location-link"
          onMouseEnter={(e) => handleLocationEnter("innerCircle", e)}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleLocationLeave}
          onClick={() => handleLocationClick("innerCircle")}
        >
          inner circle
        </span>
        , Lost Marys flirting on altar stones, a young man in an overly styled
        suit laughing 7ft above the ground, his legs swinging against the stars.
        Drums and large rocks around us, something fallen, something of a
        reminder. We are dancing on the dead. We are playing drums on the dead.
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        We kept close watch of the sky, stargazing, shutting our eyes at the
        same time, making sounds to find each other. The mound has filled up
        with bodies lying in all orientations. We knock on shoes and whisper
        sorries. I’m lying down when I overhear two men talking about war,
        insisting they will never let their sons go.{" "}
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        The sky, a continuation of dark and light. I think to ask if it has
        happened yet. My hair is caught in the dried moss of a stone which has
        lost its heat. It is the same temperature as my skin and feels
        unshakeable. We were crowded faces pinkened, facing east past the A303,
        where the earth began to bend.{" "}
      </p>
      <br />
      <br />
      <p
        style={{
          width: isMobile ? "80%" : undefined,
          fontFamily: "lust-display",
          opacity: 0.7,
          fontSize: "1.3rem",
          letterSpacing: "-0.1rem",
        }}
      >
        II
      </p>
      <p style={{ width: isMobile ? "80%" : undefined }}>
        From{" "}
        <span
          className="location-link"
          onMouseEnter={(e) => handleLocationEnter("catAndMutton", e)}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleLocationLeave}
          onClick={() => handleLocationClick("catAndMutton")}
        >
          Cat and Mutton Bridge
        </span>{" "}
        , I hear fireworks from Victoria Park. It was bonfire night this past
        Wednesday. Throughout the week before and now the days after, I’d
        glimpse firework shows between buildings, in the distance over treetops,
        pyrochemical smell upon leaving the house.
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        On bonfire night, I met a black cat, her back curved into a frightened
        shape, she kept grazing past me, back and forth, she couldn't sit still.
        I think she only came to me because I was dressed all in black,
        apparently black cats do that. I read somewhere that all cats think
        we're big cats who serve them. They think we must be stupid to share our
        food.{" "}
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined, textAlign: "center" }}>
        - - -
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        I live with a cat now. She is 13 years old and never learned to retract
        her claws. She is forgetful, relieving herself at the wrong end of the
        house, waiting at open doors. Thrice out of nowhere, she has scratched
        my feet and hissed. There are three Buddhas in the backyard. I watch her
        from the kitchen window, she sits there for hours in the afternoon sun,
        bowing to the head of the Buddha. When she does this, I think she is
        preparing to die. I remain open to the inevitability, keeping watch of
        her moods and whereabouts.
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        My 20-year-old cat stopped eating because all her teeth had fallen out.
        Her claws too, were weakened, some of them ripped from her paws, leaving
        red gapes. On the last day of her life, I was 6 years old, having fried
        fish for breakfast. Over the course of the meal, I’d go looking for her,
        squidging up some fish meat so she could suck on it.{" "}
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        The third time I went to find her, she was on our sheep wool rug. She
        was dead and stretched out frozen, the fish from my last visit splayed
        out on the floor. I'd never seen her stretched out like that, all four
        legs straight stiff, her eyes wide open. Though it was morning, my
        father came home from work. He lifted her, she stayed just as stiff. He
        brought her to the front garden. She was so stiff and straightened as my
        father put her in the ground.{" "}
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        She had a chunk of marble as a tombstone. I dug up yellow wildflowers to
        plant at her grave. Today I learn they are called Singapore Daisies. We
        said prayers for her, me in pyjamas, my father, the sleeves of his white
        shirt rolled up till his elbows, the noon sun and quiet leaves. A year
        later, it rained throughout the day and I saw a Daisy stalk shoot up an
        inch then tremour. I wondered if she could feel the rain through the
        earth. Two years later, we relevelled that part of the garden, work
        boots crushing the flowers. I told my mother they were stepping on her
        grave.
      </p>
      <br />
      <br />
      <p
        style={{
          width: isMobile ? "80%" : undefined,
          fontFamily: "lust-display",
          opacity: 0.7,
          fontSize: "1.3rem",
          letterSpacing: "-0.1rem",
        }}
      >
        III
      </p>
      <p style={{ width: isMobile ? "80%" : undefined }}>
        I decided I’d leave the group. I turned this over in my heart as we
        exited Douniya’s room, where the sun never shone directly through the
        cramped windows and the carpet reminded me of a children’s play area,
        with spaceships and stars, down the dim lift into the foyer of the{" "}
        <span
          className="location-link"
          onMouseEnter={(e) => handleLocationEnter("wohnheim", e)}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleLocationLeave}
          onClick={() => handleLocationClick("wohnheim")}
        >
          700-room student accommodation
        </span>
        , with the crisp foosball table, mineral water vending machines, faux
        tungsten bulbs strung up.{" "}
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        In a mix of wrong and right, I said I was going home and turned the
        other way. I headed to the U-Bahn and walked past it. Through
        residential estates and ugly buildings, sun streaming through the
        leaves, past the canal bar onto the bridge where I started to cry
        uncontrollably and wore my sunglasses. It was 8 in the morning, the
        first of May. I’d kept stopping along the pavement, me and others, pair
        and trios, trying to discern where the sounds were coming from.{" "}
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        May Day and Kreuzberg was empty, two large police vans were parked
        neatly in the deserted street. I must have missed it. The houses were
        pastel yellow, they filled the street, beaming light back into my eyes.
        I bought a lighter for too much money and entered a park. I’d run out of
        filters and wanted to speak to someone. I sat{" "}
        <span
          className="location-link"
          onMouseEnter={(e) => handleLocationEnter("parkBench", e)}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleLocationLeave}
          onClick={() => handleLocationClick("parkBench")}
        >
          a seat away
        </span>{" "}
        from a man in a large wool coat with long black and white hair. He was
        drinking coca-cola from a glass bottle. I asked for a filter, he told me
        he didn’t use them. His fingernails were long, dark, and pointed. We
        smoked our tobacco just from the paper, pinching it at the lips.{" "}
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined, textAlign: "center" }}>
        - - -
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        When I suggested I had to get my train, he said to be careful that it
        wasn’t the train to Busan. I hadn’t seen it at the time. He didn’t have
        a computer and taught me about many movies I hadn’t heard of, straight
        to DVD, back of the shelf. He only drank from glass bottles. He taught
        me about the 1862 International Exhibition in London where Plastic was
        first exhibited to the world and Prince Albert bought in early. He said
        they knew it was dangerous, that it would augment and destroy us. He
        didn't have a phone or email. He had a player for DVDs and VHS. He told
        me to never forget that any channel has two sides, a telephone is a
        channel, a screen is a channel. He told me he doesn’t care about people.
        He told me everyone is stupid. It would only take a meteor to crash near
        a nuclear power plant for our world to be non. When I look around,
        everyone is already dead.{" "}
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        When this happened, he said we would reunite and go to{" "}
        <span
          className="location-link"
          onMouseEnter={(e) => handleLocationEnter("malaga", e)}
          onMouseLeave={handleLocationLeave}
          onMouseMove={handleMouseMove}
          onClick={() => handleLocationClick("malaga")}
        >
          Malaga
        </span>
        , the South of Spain, live out the end of the world together. His name
        was Martin and he had been to London in 1972 with a past girlfriend
        where they had made fun of his name. He gave me his address to write to
        him. He explained all the digits, meaning he lived down an alley then a
        staircase, leading to an outbuilding where his was the fourth door.{" "}
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        When I got up to leave, he stood up as well, and he was twice my height
        and smiled so kindly that I hugged him and cried, pressing my face into
        his wool coat. I was sorry for all of the dead, the disbelievers. He
        said we would see each other again when the world ended and we'd go to
        the South of Spain. I never wrote to him. I kept his address for a long
        time, a year or two. I moved twice in that time. The second time, I must
        have felt guilty. His odd writing in red marker ink, his odd address,
        his Polish last name that began with a K.{" "}
      </p>
      {/* Location cursor tooltip */}
      <LocationCursor
        location={hoveredLocation}
        mousePos={mousePos}
        isFadingOut={isFadingOut}
      />
    </div>
  );
};
