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
    <div className="radiogram-7" ref={containerRef}>
      <p style={{ width: isMobile ? "80%" : undefined }}>
        I could count on one hand the number of things I’ve actually paid for
        online.
        <strong>A guilty pleasure Patreon. A comic. Some albums. </strong>
        Every time I typed my card details in, I flinched, the way you flinch
        when you think you're being had. Maybe it sounds entitled, but for most
        of my life I’ve believed most things online should be available for
        free.
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        On Sundays, my Dad bought Hollywood DVDs from street vendors. We came
        home once with <strong>twenty-eight Jim Carrey films</strong> on a
        single disc, <strong>Ace Ventura</strong> through to{" "}
        <strong>I Love You Phillip Morris</strong>. Stacked on wooden planks,
        rubberbanded, held out through car windows like hot cakes at a football
        game. Filmed in cinemas in India, shipped across to West Africa, bought
        at the ports, lined with paper slips and plastic sheets, loaded onto
        carts and paraded down the street. Guys stood outside the actual cinema
        selling the new <strong>Mission Impossible</strong>, or{" "}
        <strong>Osuofia</strong> in London, and you rolled the window down, gave
        them the naira, took it home, slotted it in and hoped. Sometimes it
        skipped an entire act. Sometimes it jumped from{" "}
        <strong>The Mask</strong> to <strong>Bruce Almighty</strong> with no
        warning. Sometimes it was a different film altogether.
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        I didn’t question it until my cousins came over from Ireland with
        something I had never seen before. A real Blu-Ray. Shiny plastic case.
        Glossy insert. <strong>High School Musical 2</strong> in perfect
        resolution, with the deleted “Humuhumunukunukuapua’a” scene.
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        It was perfect, but unattainable. Nowhere, and I mean nowhere, sold the
        same copy. No distributor had bothered with us. So upon seeing them
        leave, I knew I wouldn't get that experience back. And for a while, I
        missed it.
      </p>
      <br />

      <p style={{ width: isMobile ? "80%" : undefined }}>
        When streaming replaced DVDs, and torrents replaced the compact discs,
        things started to get strange.
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        Twelve. First spots of puberty forming across my face. Some of those
        never left. Clicking between PirateBay, kickasstorrents, and God forbid,
        putlocker, downloading films by <strong>Jean Vigo</strong>, listening to
        my Soulseek copy of <strong>Bound 2</strong>; reading{" "}
        <strong>Batman comics</strong>. The only real hiccup was my Wi-Fi. I’d
        leave the download running overnight, wake up to the entire{" "}
        <strong>Odd Future discography</strong> waiting in the morning.
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        Fourteen. They gave us school laptops and we built a country inside
        them. <strong>GTA San Andreas cheat codes</strong> on 1GB Lenovos.
        Everything on SoundCloud was free already. If it wasn't there it was on
        DatPiff. If it wasn't on DatPiff we found a way. I was one of the first
        ten thousand people to hear <strong>Safe House by Lil Uzi Vert</strong>.
        After school became an afterlife: boxed ice lollies, tabbed browsers,
        download queues, rap forums.
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        We listened to <strong>The Life of Pablo</strong> huddled around one
        laptop with four USBs sticking out the sides. USB City.
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        Kanye spent that spring furious about people stealing it. It had leaked
        minutes after the Tidal release and been downloaded half a million times
        in a day, making it one of the most pirated albums of all time. Then,
        weeks later, he tweeted a screenshot of his own laptop with a Pirate Bay
        tab open, hunting for <strong>Serum.</strong>
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        I loved him for it. Not because he was a hypocrite, everyone is a
        hypocrite, but because it proved the logic went all the way up. There
        was no floor and here he was standing in the same queue, waiting on the
        same seeders, like any of us.
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        In high school I bought Supreme off Depop. I only worked out it was fake
        later, once I'd started buying <strong>fake Supreme</strong> from Taobao
        on purpose. r/FashionReps was monastic about it. Thread count, the shape
        of the e, the weight of the cotton. I ended up with as many fakes as
        reals, and the fakes had more bite, a rarer bogo you were never getting
        anyway. It was naughty. I liked that.
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        A London kid clocked the sweater at lunch once. I shrugged and kept
        wearing it.
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        But I knew. A bogo is more than a jumper, it’s a receipt. It says you
        were in the right city on the right Thursday and you got there before
        the resellers. You were faster, richer, or smarter than the average Joe
        in line trying to cop the latest piece. Buy the rep and you get the
        jumper, and the jumper on its own has no story.
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        Though I knew, in its fakeness, perhaps I had betrayed some sort of code
        between the skaters, James Jebbia, and myself. After high school, I
        threw most of them all away, aside from a hilariously{" "}
        <strong>very-fake Supreme camo bogo</strong> that I used as pajamas for
        the next three years. Part of me is convinced we broke the fashion
        industry. Streetwear, the logo-mania, Wechat, Taobao, it all began with
        a couple dudes and we could see how things would change even before
        people started calling it quiet luxury, many jumped from the hype
        threads to fake Loro, dupe Miu Miu, and foo-foo The Row. It’s why I
        swore off most new clothes and started only wearing vintage, and started
        Rentre.
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        The most popular pirated content is actually pornography. Every day,
        millions of terabytes of storage are spent transferring hardcore porn
        across the Internet. <strong>PLEASE SEED.</strong>
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        We can now hear, watch and read very nearly everything that has ever
        been recorded, and nobody is torrenting{" "}
        <strong>In Search of Lost Time</strong>. Infinite access didn't widen
        anybody out. It made us extremely efficient at getting more of exactly
        what we already wanted, faster, with less friction and less shame.
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        Piracy might have made us dumber. Without piracy, we would probably
        never have had the current streaming era. We spent years training
        ourselves on the idea that the correct amount of anything is all of it
        and the correct wait is none, and then streaming turned up and offered
        to do the queueing for us, and we said yes on the spot, because we were
        already living that way.
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        The shops are almost all gone, and instead of discovering films to watch
        through recommendations from clerks, an experience in itself, we
        replaced it with a flat algorithm. That was real curation, it was free,
        and none of us knew it was a service, because it looked like a man being
        mildly rude to you about Michael Mann. Now we trudge through slop.
        <br /> If you haven’t already, <strong>please delete Netflix.</strong>
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        I myself switched from Apple Music to Nina Protocol, in protest, but
        then Spotify after. Nina Protocol shut down this year. Though I am here
        with you, across a cable under the ocean and I can appear to you as a
        real person telling you a real story. There is nothing “real” about
        being online.
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        It’s overwhelming to wade through endless streams of ‘content’, so
        overwhelming that anything that might purify our consumption cannot
        satisfy us. Maybe, I’m atoning by running a listings website.
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        We didn't just lose the shops. We also lost the feeling of finding
        something by accident. I grew up yearning for what was already lost to
        time. It's depressing. We will never get it back.
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        Thankfully, the record shops are doing okay.
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        Anyway. I'm not going to sit here and pretend I'd hand any of it back.
        <strong>I needed to drive the Infernus in GTA Vice City.</strong>
      </p>
    </div>
  );
};
