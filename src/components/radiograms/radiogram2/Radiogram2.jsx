import React, { useEffect, useRef, useState } from "react";
import "./Radiogram2.css";
// eslint-disable-next-line
import { rpa2 } from "../../../assets/rpa2"; // Kept for future use (lyric_sheet image)

export const Radiogram2 = () => {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
  }, []);

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
    <div className="radiogram-2" ref={containerRef}>
      <p style={{ width: isMobile ? "80%" : "60%" }}>
        <span className="rp-question" style={{ lineHeight: "1.3" }}>
          RP: For those that don't know you, who are you and what do you do?
        </span>
        <br />
        <span className="ebk-answer">
          EBK: "I'm MANNY! or just Manny. Or Emmanuel Borges-Karikari. I'm a
          25-year-old pop artist now based in Angel. I work in a music studio in
          Soho and I'm also a piano teacher for kids. I also just got married…
          what a life."
        </span>
      </p>

      <p
        className="column-break col-2"
        style={{ width: isMobile ? "80%" : "60%" }}
      >
        <span className="rp-question" style={{ lineHeight: "1.3" }}>
          RP: "Jesus Hates My Porn Addiction" feels both deeply personal and a
          commentary on religious attitudes toward sexuality. What inspired you
          to explore such a vulnerable theme, and how do you see that balance
          between personal storytelling and broader critique?
        </span>
        <br />
        <span
          className="ebk-answer"
          style={{ fontSize: "16px", lineHeight: "1.6" }}
        >
          EBK: "Honestly, I don't know. I think a lot of people were expecting a
          massive answer in terms of why I wrote the song, most people boiling
          it down to some sort of moral duty as a Christian to talk about these
          taboo topics. I just wanted to write a song, and I wrote the line
          "I've got to get this off my chest, I'd never seen a pair of breasts."
          So I committed to finishing off the song, and here we are. Between you
          and me, if I'm writing about something, it's probably because I've
          already gone through it and have no attachment to it anymore. I never
          thought, "Oh no, this is very exposing, what if people have thoughts?"
          I don't really find it exposing because… I don't really care about it
          anymore; the porn addiction is behind me. It's not my life anymore."
        </span>
      </p>

      <p className="column-break" style={{ width: isMobile ? "80%" : "60%" }}>
        <span className="rp-question" style={{ lineHeight: "1.3" }}>
          RP: How has your own experience with the tension between sexuality and
          religion shaped you, and what have you learned, or are you still
          learning from navigating that conflict?
        </span>
        <br />
        <span
          className="ebk-answer"
          style={{ fontSize: "16px", lineHeight: "1.6" }}
        >
          EBK: "I grew up a very sheltered kid, but quite accidentally. I don't
          think my mother was intentionally stopping me from listening to the
          radio, for example, but she wasn't rushing to switch it on, and I
          wasn't a curious kid either. So, during my teenage years, though I'd
          experience the sensation of horniness, I didn't have the terminology
          for it, nor did I have any understanding of what or why it was
          happening. Therefore, I internally demonised it. Which made engaging
          with Christianity a lot easier since I was under the assumption that I
          don't get tempted. It's funny, the line{" "}
          <span style={{ fontFamily: "NeueHaasDisplayMedium" }}>
            "I felt like Adam, you were Eve, I bit the apple from the tree"
          </span>{" "}
          really describes the start of my complicated relationship with my
          faith and sexual desire. I first engaged in sexual activity when I was
          18. From that point, I really found out how hard lust and temptation
          were to overcome. Then I started masturbating at 21 and watching porn
          at 22. At all those points, I still loved Jesus; I just found myself
          falling deeper and deeper into territory that I had no tactics to deal
          with. And then, at some point, the cycle becomes "oooooh, I enjoy
          watching porn and masturbating, but I know God isn't happy, maybe I'll
          do it one more time, and then I'll stop. Oh gosh, why did I do it
          AGAIN? God must hate me. I hate me. Urgh, I'm never going to do that
          again. But oooooh, I enjoy…". I really hated myself for a year but
          after speaking to many friends and older people, I learned to take it
          easier on myself, address my problem as an addiction and to have grace
          on myself (there's a verse in the Bible about this sort of problem,
          somewhere in Romans, good read). I learned to love myself because God
          still loves me despite my shortcomings, which are many, and He
          continuously believes in me to do the right thing."
        </span>
      </p>

      <p className="column-break" style={{ width: isMobile ? "80%" : "60%" }}>
        <span className="rp-question" style={{ lineHeight: "1.3" }}>
          RP: Many religions, including Christianity, have strong views on
          pornography… how have those teachings influenced your personal
          understanding of desire, guilt, or morality?
        </span>
        <br />
        <span
          className="ebk-answer"
          style={{ fontSize: "16px", lineHeight: "1.6" }}
        >
          EBK: "Not to blame the church or people, but it's very easy to build
          up guilt complexes because, although these things are spoken about,
          it's rare, and it's super easy for people to assimilate the behaviour
          of a "good Christian". Being in a church environment can sometimes
          feel like being on stage with performers who don't want to be seen as
          human or sinners or weak, so they try to convince everybody that their
          life is good. I know because I've done it before. And, for some
          reason, it's very easy to perceive these performances as the truth; I
          remember leaving church many times feeling insecure about my
          relationship with God and guilty because "It's just me who's dealing
          with this addiction", which is just a lie. There are probably at least
          2 people in every friendship circle who are dealing with a porn
          addiction, yet everyone bears the shame of being the "only one".
          Weird. Now, conviction? That's another topic, and one thing being at
          church did for me was to help me remember my convictions. It reminded
          me that I don't want to live life like this. That it's not okay for me
          to live life completely dependent on masturbating and watching porn.
          And it's given me a massive sense of humility and grace. A lot of the
          moral code I do tend to adhere by is based on Jesus. He's the best
          role model I know, quite the cringe sentence, but one of upmost
          sincerity. I also do not think I'm better than anybody else on this
          Earth. I do not see myself as holier or a better Christian than others
          who are dealing with this. I have endless amounts of grace and empathy
          for those who are trying to fight their demons."
        </span>
      </p>

      <p className="column-break" style={{ width: isMobile ? "80%" : "60%" }}>
        <span
          className="rp-question"
          style={{
            lineHeight: "1.3",
            color: "#434a47",
          }}
        >
          RP: You reference Matthew 5:29 in the song... what does that verse
          mean to you personally, and why did you choose to highlight it?
        </span>
        <br />
        <span className="ebk-answer">
          EBK:"I just thought I would be a clever chorus line. The imagery of
          "if anything is causing you to sin, cut it off or remove it" is
          fascinating to me. How far are we willing to avoid doing the wrong
          thing? Funnily enough, now that I'm writing this, I do remember at
          some point in my porn addiction, thinking, "…what if I just chopped
          off my penis? Wouldn't that stop the problem?" I obviously decided
          against doing so… thank God. So maybe the Matthew bible verse came
          subconsciously from that memory. Who knows?"
        </span>
      </p>

      <p className="column-break" style={{ width: isMobile ? "80%" : "60%" }}>
        <span
          className="rp-question"
          style={{
            lineHeight: "1.3",
            color: "#434a47",
          }}
        >
          RP: "Speech marks are an indication of my irony"... What does this
          mean to you?
        </span>
        <br />
        <span
          className="ebk-answer"
          style={{ fontSize: "16px", lineHeight: "1.6" }}
        >
          EBK:"Well, the full title is "Speech marks an an indication of my
          irony… There are no speech marks." After I wrote "Jesus Hates…", I
          remember trying to come up with a title, and a conversation came to
          mind where I had used speech marks via text to imply sarcasm/irony,
          and the person didn't understand why I did. I thought it would be
          funny to lean into that here, whenever you saw speech marks. But
          that's the thing; there are no speech marks. I am in no way being
          sarcastic or ironic. "There's Something Wrong With Me", "Jesus
          Hates…", "Comfort", "Will You Be My Friend?", "This Feeling" ; all of
          these songs are so sincere, earnest and honest. Now the meta joke here
          is… speech marks have to be used when quoting these songs, so… am I
          being sarcastic? Am I being honest? Is this all one big gag to make
          people insert the speech marks for me? No. But…"
        </span>
      </p>
    </div>
  );
};
