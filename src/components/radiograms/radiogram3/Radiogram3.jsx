import React, { useEffect, useRef, useState } from "react";
import "./Radiogram3.css";

export const Radiogram3 = () => {
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
        In an environment of consolidated platforms that make genuine artistic expression less and less profitable by the day, it is understandable why people would want an alternative. With latent 2000s nostalgia, there has been a growing want for, not only retrospective musical and artistic endeavours but also a blog-era style approach to consumption, socialisation and discovery.  A result of this has been a new wave of social, musical and artistic platforms promising to restore the internet to a time before big tech dominance, where the art was allegedly better and meritocracy reigned supreme. Most notable of these new platforms and services are music platform Nina Protocol and Instagram clone [!?] Zora. What makes these platforms interesting is their open committal (formally for Nina) to web3 and blockchain technology despite the distain the may artists seem to have for it.{" "}
      </p>
      <p style={{ width: isMobile ? "80%" : undefined }}>
      I could tell you about Nina Protocols many short comings, but that has been tackled wonderfully by people more eloquent than me. I could tell you how Nina protocol isn’t really decentralised or how they are burning through VC money and enshitification is around the corner. I could tell you about how harmful the blockchain being used is for the environment, despite the developer’s claims. I could even tell you about how the public ledger model of blockchain exposes your music for download without the need for a paywall. Instead I want to focus on why web3 technology spells bad news for creativity and why we have been easy targets for blockchain powered VC projects, scams and capers. A non-trivial population of post-internet (millennial) artists seem so easily impressed by the internet. Most of the commentary seems to be directed at the mundanity of online life, happy gesturing to existing parts of internet or meme culture just to talk about how vapid, fleeting it all is.  Never providing any critique or analysis, just placing it in front of you to gawk at creating the most tired (or even lack) of discourse. We think of art world as decentralised but what is the art school but a centre for a particular school of thought? The designers coming out of Central Saint Martin’s all look the same. in a similar vain we trust different institutions to offer insight into various aspects of artistic zeitgeist, you don’t look at Parsons students for their sculptures…
      </p>
      <p style={{ width: isMobile ? "80%" : undefined }}>
      Subcultures are born out of centralisation around certain guiding principles. Institutions like Rhizome become hubs for artistic commentary on connective society and their pioneering work in non critical analysis and techno illiteracy is propagated through artistic channels. <br />
      While this style of reasoning is ridiculous for describing liberal democracy, it perfectly models the theocratic similarities in artistic practice. To truly have an artistic vision is to pick your side and trust in it, to be like the Orthodox and believe every other practice is heretical and you have all the answers. Religious doctrine is disseminated via centralisation and when the text is faulty, the choirs sing nonsense. And what is up with the rhizome guys? The post internet movement seems to have been hijacked by technologically illiterate hacks. Just look at Jon Rafman's new project, Cloudy Heart, a post-ironic popstar for the internet age, completely AI generated from the music to the persona. Knowing these types it's probably an elaborate ruse and a real person has been situated behind the madness all along! Either way the music is still garbage. What started as an honest critique of our increasingly digital world
      </p>

      <p style={{ width: isMobile ? "80%" : undefined }}>
      I don’t know the people who are responsible for Nina protocol, but I do think they genuinely care about music. So I solemnly ask you, what does your platform achieve? How is this an improvement over Bandcamp? Postering as a series music platform by positioning themselves adjacent to cool music and good art. 

      </p>
      <p style={{ width: isMobile ? "80%" : undefined }}>
      Tech has embedded itself in every facet of modern life, therefore, it has become your job to embed yourself tech culture. And I’m not just talking about learning to code, any idiot can do that. I mean learning the different factions and ideologies at the centre of silicon valley and start-up culture. Become privy to crypto-related jargon and the promises of web3, almost every form of technology is also a political project. from a promise of a techno-libertarian future to post human dystopia you will find that these projects have potent ideologies behind them. Please please please be vigilant and never let this happen again. 
      </p>
      
    </div>
  );
};
