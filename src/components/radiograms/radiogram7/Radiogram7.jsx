import React, { useEffect, useRef, useState } from "react";
import "./Radiogram7.css";

export const Radiogram7 = () => {
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
      <p style={{ width: isMobile ? "80%" : undefined }}>
        I could count on one hand the number of things I’ve actually paid for
        online.
        <br /> The Bliss Foster Patreon. A comic, maybe. Some albums. And every
        time I typed in my card details, I caught myself thinking, why am I even
        doing this?
        <br /> Maybe that sounds entitled, but for most of my life I’ve believed
        everything should be available for free.{" "}
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        I’m not a cheapskate, maybe. On Sundays, my dad used to buy Hollywood
        DVDs from street vendors.
        <br />
        Hell, we’d come home with a bundle of 28 Jim Carrey movies on a single
        disc, from Ace Ventura to I Love You Phillip Morris.
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        That was my introduction to piracy. You could find entire filmographies
        crammed onto one disc, stacked on wooden planks, rubberbanded together,
        then held out through car windows like hot cakes at a football game. It
        felt normal. Watching 30 movies starring Eddie Murphy, Anne Hathaway, or
        Vince Vaughn didn’t seem like theft.
      </p>

      <p style={{ width: isMobile ? "80%" : undefined }}>
        I didn’t question it until my cousins came over from Ireland with
        something I had never seen before. A real Blu-Ray. Shiny plastic case.
        Glossy insert. High School Musical 2 in perfect resolution, with the
        deleted “Humuhumunukunukuapua’a” scene.
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        When the film ended, that disc meant more. My love destroyed the memory.
        The pirated DVDs had a much shorter shelf life. They’d skip entire acts.
        Jump from The Mask to Bruce Almighty without warning.
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        Maybe that’s where it started: piracy passed down like furniture. Really
        shitty, 144p stuff, sometimes filmed in cinemas in India, then
        transported across the globe to West Africa, bought at shipping ports,
        lined with paper slips and plastic sheets, then placed on carts, and
        paraded down the street, all funny guys with the new Mission Impossible
        or Osuofia in London, roll a window, take home, where I’d sit down, slot
        them in the player and hope they didn’t skip, glitch, or turn out to be
        a totally different movie.
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        When streaming replaced DVDs, and torrents replaced the comp discs,
        things started to get strange.
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        12. First spots of puberty forming across my face. Bumps on my nose that
        never left.
        <br /> Clicking between PirateBay, kickasstorrents, and God forbid,
        putlocker, downloading films by Jean Vigo, listening to my cracked copy
        of Bound 2; reading Batman comics. The only real hiccup was my Wi-Fi.
        I’d leave the download running overnight, wake up to the entire Odd
        Future discog waiting in the morning.
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        14. They gave us school laptops, and we built a whole network for
        ourselves.
        <br /> GTA San Andreas cheat codes on 1GB RAM Lenovos. It felt like the
        world was finally turning in our direction.
        <br /> All music on SoundCloud was already free. If it wasn’t, maybe it
        was on DatPiff. If it wasn’t there, we found a way.
        <br /> I was one of the first 10,000 people to listen to Safe House by
        Lil Uzi.
        <br /> After school became an afterlife: boxed ice lollies, tabbed
        browsers, download queues and rap forums.
        <br /> Even Kanye couldn’t help himself. In 2016, he tweeted a
        screenshot of his laptop with a Pirate Bay tab open, clearly searching
        for production software, Serum. It was surreal. Just weeks earlier, he
        was raging about people pirating The Life of Pablo, which had leaked
        minutes after its exclusive Tidal release and was downloaded half a
        million times in a day, making it one of the most pirated albums of all
        time.
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        He called it theft. But he was stealing too.
        <br /> Maybe that’s the thing. We grew up thinking everything online
        should be free: music, movies, software. Even the people who “built” the
        culture felt the same way. <br />
        We listened to The Life of Pablo together in class, huddled around one
        laptop with four USBs sticking out the sides. USB city.
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        In high school, I bought Supreme from Depop. I only realised it was fake
        later, when I started buying fake Supreme from Taobao. r/FashionReps
        would teach you all about the thread count and how the ‘e’ should be. It
        was monk-like in its detail and fresh for the peak late 2010s vibe when
        the hype was ballooning faster than product. I had as many fakes as I
        had reals, and I thought whatever looked cool.
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        At lunch, I got called out for the sweater by a London kid who was a
        more avid collector. I just shrugged, I still loved it. Though I knew,
        in its fakeness, perhaps I had betrayed some sort of code between the
        skaters, James Jebbia, and myself.
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        The most popular pirated content is actually pornography. Every day,
        millions of terabytes of storage is spent downloading and transferring
        hardcore porn across the Internet. PLEASE SEED. We’re deep into this
        now, where we can listen, watch, and read almost everything that has
        ever been recorded, yet it’s not like the torrenter is going through In
        Search of Lost Time.
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        It can be argued that piracy has made us dumber.
        <br /> It’s overwhelming to wade through endless streams of ‘content’,
        so overwhelming, anything that might purify our consumption cannot
        satisfy us. <br />
        Online piracy opened the doors for the streaming era. Video shops
        shuttered, and instead of discovering films to watch, recommendations
        from clerks, an experience in itself, we replaced it with a flat
        algorithm.
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        We didn’t just lose video shops. We lost the clerks, the shelves, the
        feeling of finding something by accident. It’s depressing. I grew up
        yearning what was already lost to time.
        <br /> All things fair, I needed to drive the Infernus in GTA Vice City.
      </p>
    </div>
  );
};
