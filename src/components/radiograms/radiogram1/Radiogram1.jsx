import React, { useEffect, useRef, useState } from "react";
import "./Radiogram1.css";

export const Radiogram1 = () => {
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
    <div className="radiogram-1" ref={containerRef}>
      <p
        style={{
          textAlign: isMobile ? "left" : "justify",
        }}
      >
        Freedom is consumed under the pretence that it is unlimited; there is no
        such thing as being "too free". Quite the contrary, freedom is the
        ultimate end, the manifestation of the good, the absence of all evil.{" "}
      </p>
      <p style={{ width: isMobile ? "80%" : undefined }}>
        The happy man is free, the free man is happy. But the word freedom is to
        humans what the bell is for Pavlov's dogs. We rarely question what
        freedom is, who provides it, or the cost that freedom is priced at. We
        indulge in it, consume it to its fullest, then cry for more.{" "}
        <strong>
          Like dogs, we eat what's served, beg for seconds, and thank our owner.
        </strong>
      </p>

      <p style={{ width: isMobile ? "80%" : undefined }}>
        The free-market economy claimed to increase employment, social mobility,
        choice of goods, and education, and therefore sustain higher degrees of{" "}
        freedom, compared to the heavily constricting traditional class
        hierarchies of the pre-industrial revolution. Its development has
        ultimately achieved the opposite; the subjugation of the individual into
        an economically productive tool that is utilised to serve as a means to
        the end of the dominating institutions. As H. Marcuse predicted in the
        1950s, the advanced capitalist society that supposedly increases liberty
        due to its "non-interventionist" ideology, measures freedom through
        economic activity; the access to material goods and the possession
        thereof. The illusion of choice then projects freedom, but ultimately,{" "}
        <strong>
          the only freedom the individual is granted is committing to the same
          orders that sustain these oppressive economic structures.
        </strong>{" "}
        Critical immaterial properties that constitute freedom, such as rights,
        individuality, liberty of thought, and its expression, may be met, but
        have lost their function in society. Rather,{" "}
        <strong>
          the extent to which the individual may participate unrestrictedly in
          the economy through the obtaining of monetary and material goods
          prevails over the essence of freedom.
        </strong>
      </p>

      <p style={{ width: isMobile ? "80%" : undefined }}>
        Variety of choice has therefore become the ultimate quantification of{" "}
        freedom; how extensive is the pool of goods you can choose from, and how
        much of that can you call your own? If freedom is derived from the
        free-market, you must participate to claim this liberty. The culture of
        mass-consumption then illusions individuals to be free in the Western
        civilization, as they are flooded with choices of material goods. The
        equation is simple: if the free market ensures your freedom, the more
        access you have, the greater your freedom. Therefore, needless
        variations of the same product are promoted, creating the illusion of
        innumerable choices to parallelly manifest unlimited freedom. Whilst
        individuals externalise freedom through the arbitrary choices made,
        their initial participation in the market was nothing but forced.{" "}
      </p>
      <p className="markedFor" style={{ width: isMobile ? "95%" : undefined }}>
        It does not matter what choice is made, only that a choice is made,
        repeatedly, consistently, and frequently. The pressure to submit to
        mass-consumption is severe; advertisements are pushed constantly,
        products are too cheap, trends change weekly.
      </p>
      <p style={{ width: isMobile ? "80%" : undefined }}>
        Consumption of goods is centralised in the current means of existence,
        even if it's inefficient or unproductive to the individual. Meanwhile,
        attention is sold as a commodity, and individuals will passively neglect
        demands for immaterial freedoms. "Independence of thought, autonomy, and
        the right to political opposition" are all properties that come at the
        cost of endless indulgence into consumption. The illusion of freedom
        through arbitrary choices keeps the people tamed, obedient, distracted.
        As long as they are sufficiently entertained, fed, and kept far enough
        from the ugly, no threat to those whose products are consumed is posed.
      </p>

      <p style={{ width: isMobile ? "80%" : undefined }}>
        This sounds like a conspiracy theory. Because, ultimately, people still
        claim their immaterial freedoms; we protest, we complain, we educate
        ourselves. But the economic system establishes the realm within which
        the individual may exist without risking the status quo;{" "}
        <strong>
          you may be angry, as long as your anger does not threaten to
          destabilize the current structures.
        </strong>{" "}
        The change you may enact is through increased commitment to the same
        structures that subject you as a means to their end; political
        candidates, policy changes, all embodying the same economic structures,
        only varying versions thereof. Rational contention must occur through
        positive improvements of the same mechanisms that structure the economic
        system, which thereby strengthens itself through claiming higher
        satisfaction with the individual and gaining legitimacy. The individual
        is granted as much executive decision-making power that satisfies her
        own demand for believing to have agency over her life in the political
        sphere. The only power the individual truly possesses is her function as
        an economic subject, being a minor fragment of the larger unit.
        Effective protest can thus only be expressed through the aggravated
        rejection of this function. This is evident as through the newly
        introduced Anti-Boycott Bill, the individual is prohibited to even
        freely choose how to economically participate. The paradoxical nature of
        a free-market economy that prohibits free economic activity should
        illuminate a glimpse of how individual liberty is not the primary end of
        capitalism.
      </p>

      <p style={{ width: isMobile ? "80%" : undefined }}>
        <strong>
          We are convinced to be free, yet all fall victim to the traps of
          consumption.
        </strong>{" "}
        Alienated from our morality, we look past the horrors of production, the
        path to destruction we are firmly walking, and our own kind we are
        sacrificing on the way. Why can't we stop buying iPhones or use
        Instagram? Why are we glued to a screen seven hours a day? Why do we own
        21 different t-shirts? When it is so difficult to refuse to participate
        in useless consumption despite realising its harm, we must question its
        appeal to liberty.{" "}
        <p
          className="markedFor"
          style={{ textAlign: "justify", fontSize: "1.7rem" }}
        >
          <strong>Consumption is intentional, just not by the consumer.</strong>{" "}
          If humanity is meant to be free in a free-market society, how have we
          become so passive?
        </p>
      </p>
    </div>
  );
};
