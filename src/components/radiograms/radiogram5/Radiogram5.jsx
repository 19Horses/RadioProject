import React, { useEffect, useRef, useState } from "react";
import "./Radiogram5.css";

export const Radiogram5 = () => {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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
          textAlign: isMobile ? "left" : "justify",
        }}
      >
        Making the music video for Bunny Leap’s first single was a process of revisiting and re-encountering
        a familiar childhood landscape.{" "}
      </p>
      <p style={{ width: isMobile ? "80%" : undefined }}>
      As a self-claimed filmmaker who has been shooting projects over the past five years, this
collaboration with BUNNY LEAP marked my first music video project. It started from a very random
position in November 2024, during the time I was on holiday in Shanghai, away from my artist
(semi-unemployed) life in London. One day, I was hanging out with my friend since high school,
Oliver (the vocalist of Bunny Leap), and learned that they were producing their first single.
      </p>
      <br />

      <p style={{ width: isMobile ? "80%" : undefined }}>
      In an attempt to make myself feel less depressing and less life-wasting as a person, I offered to
shoot a music video for them. At that point, there was only a demo. But the simplicity and sense of
alienation in the music struck me immediately—it aligned closely with my own artistic practice. I
became committed to visualising it and saw this as an opportunity to record once-familiar
surroundings.
      </p>

      <p style={{ width: isMobile ? "80%" : undefined }}>
      In this pop-rock song, No One Can Leave This Place (没有人从这里离开), I sense a deeply personal
touch beneath modernisation, both in the lyrics and the compositions. I see the perspective of a
person wandering in the city without aim, crossing people, and the ever-changing scenario and,
more importantly, the object remains. I hoped we could film in places that hold both the past and
the present. When visualising it, I take the process as a personal memory collection and discovery,
making it very intimate, in an almost home-video style.
      </p>
      
      <p style={{ width: isMobile ? "80%" : undefined }}>
      As someone born and raised in Yangpu District, a district that shifted away from labour-intensive
industry in the early 2000s in Shanghai, I used to live in a very small old apartment with my entire
family. My family had to cooperate to share the very limited space, and I tended not to view the
surroundings in a sentimental way. Physical forms could hardly be personal. I had my own “private”
in my imagination, when I was under my duvet. This still leaves its trace on me — I have been living
in my room of a houseshare in Brixton for three years. I keep it minimalist, zero decoration, a large
baggage case as a coat “hanger.
”
      </p>
      <p style={{ width: isMobile ? "80%" : undefined }}>
      On the contrary, Oliver always puts so much effort into his living spaces, and that really amazed me.
That’s why I became so obsessed with filming the cute little objects in his small backyard—one of
the main locations for the video: Pokémon figurines staring at each other, and the Haier Brothers
logo on an outdoor air-conditioning unit.
      </p>
      <p style={{ width: isMobile ? "80%" : undefined }}>
      As the song suggests, we walked a lot during the making of the video. Oliver took me on a walking
tour as a scouting day; we wandered around his familiar neighbourhood in Yangpu. It became a
process of revisiting and rediscovering a landscape that felt both familiar and distant in memory. I
was camcording all the way along with my vintage camcorder — roadside mopeds, tree hollows
with small birds, plastic water bottles hanging from windows.
      </p>
      <p style={{ width: isMobile ? "80%" : undefined }}>
      Eventually, we reached a wasteland, which used to be the neighbourhood Oliver lived in when he
was a school kid, now fully demolished. He mentioned how interesting it felt: the same place that
once seemed so large when he walked through the alleys after school now appeared incredibly
small after the buildings had disappeared. This emotional sense of loss and displacement resonates
with the lyrics in a light-hearted yet poignant way: “Am I still walking, faster?” (“我是不是还在走得更快走得更快”).
      </p>
      <p style={{ width: isMobile ? "80%" : undefined }}>We knew immediately that we had to shoot there. Even the mannequin limbs arranged along the
      wall felt perfectly placed, carrying an unexpected sense of utopia.
      </p>
      <p style={{ width: isMobile ? "80%" : undefined }}>
      Although we share similar backgrounds in a metropolitan environment, Bunny Leap arrives at a
more positive response to urban life than my own often passive or reluctant attitude toward
humanity. Even if we are all somehow trapped within norms, we still choose to walk past people on
the street.
      </p>
      <p style={{ width: isMobile ? "80%" : undefined }}>
      “I am glad just to be in the world as an observer—not to make a change, but simply
to have a look.
”
      </p>
      <p style={{ width: isMobile ? "80%" : undefined }}>
      They question whether the “I” is the same as everybody else: should I keep the same pace walking
down the street, or walk faster? Would it make any difference? Their answer lies in rejection—so
long as we keep walking, it doesn’t matter where to go.. Even if this rejection is subjective, its
subjectivity is precisely what we value.
      </p>
      <p style={{ width: isMobile ? "80%" : undefined }}>
      Regarding the creation of the single, DaMi (the guitarist and composer) shared that she was initially
inspired by the Japanese band Pasteboard while working on early demos in 2021. It was not until
early 2024 that she brought these demos to Oliver and Shiwan (the lyricist) to develop the themes
and lyrics together. Looking back, this journey began during the pandemic, when she started
reflecting more deeply on how our minds process all information—how our perspectives are
formed by memories, which are somehow preserved through subjectivity. The resulting focus and
neglect have constructed the world’s sense of unreality.
      </p>
      <p style={{ width: isMobile ? "80%" : undefined }}>
      For those living in cities, we adhere to norms and conventions of urbanised behaviour. In order for
tens of millions of people to coexist in shared spaces, true freedom through social identity becomes
impossible. While constrained by urbanisation, we also benefit from it. Thus we realise that no one
can leave this place.
      </p>
      <p style={{ width: isMobile ? "80%" : undefined }}>
      This song can be our answer.
      </p>
      <p style={{ width: isMobile ? "80%" : undefined }}>
      We hope it carries a sense of hope.
      </p>
    </div>
  );
};
