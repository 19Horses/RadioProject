import React, { useEffect, useRef, useState } from "react";
import "./Radiogram8.css";

export const Radiogram8 = () => {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activeRef, setActiveRef] = useState(null);

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

  useEffect(() => {
    const scrollContainer = document.querySelector(".article-scroll-container");
    const clear = () => setActiveRef(null);
    if (scrollContainer) {
      scrollContainer.addEventListener("wheel", clear);
    } else {
      window.addEventListener("touchstart", clear);
    }
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("wheel", clear);
      } else {
        window.removeEventListener("touchstart", clear);
      }
    };
  }, []);

  const handleCitationClick = (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    e.preventDefault();
    const target = document.getElementById(anchor.getAttribute("href").slice(1));
    if (!target) return;
    setActiveRef(anchor.getAttribute("href").slice(1));
    const scrollContainer = document.querySelector(".article-scroll-container");
    if (!scrollContainer) {
      target.scrollIntoView({ behavior: "smooth" });
      return;
    }
    const containerRect = scrollContainer.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const scrollTop = scrollContainer.scrollTop + targetRect.top - containerRect.top - 80;
    scrollContainer.dispatchEvent(new CustomEvent("smoothScrollTo", { detail: { scrollTop } }));
  };

  return (
    <div className="radiogram-8" ref={containerRef} onClick={handleCitationClick}>
      <p style={{ width: isMobile ? "80%" : undefined }}>
        Culture is never neutral. What we laugh at, cry over and talk about
        reflects the economic and sociopolitical conditions we live within;
        popularity itself is not random or organic, but rooted in the structures
        of power and inequality that shape everyday life. Cultural critique is
        therefore not just a matter of taste or interpretation but a practice
        aimed at revealing how power operates through everyday cultural forms.
        Globalisation has led to a rapid change in how pop culture exists. With
        74% of the global population online{" "}
        <a href="#ref-1" className="cite-highlight">
          (Itu.int, 2025)<sup>1</sup>
        </a>{" "}
        we are seeing technological advancements impact societal function at a
        rate we have never experienced before.{" "}
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        In the era of digital platforms where the foundation of the media
        landscape is based on algorithms, the task of analysing pop culture
        becomes increasingly necessary. Using the case of the internet
        personality IShowSpeed, this essay argues that linking critique to
        social change means moving beyond individual moral judgement and towards
        structural analysis of how participation itself is organised by platform
        power. Drawing on John Fiske’s theory of popular culture, José van
        Dijck’s concept of ‘platformisation’, and Frantz Fanon’s account of
        racialised visibility, IShowSpeed demonstrates how contemporary culture
        is shaped at the intersection of audience agency, infrastructure and
        race, and why critical theory still matters for engaging culture today.
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        Writing in the late 1980s, John Fiske defined popular culture as “not
        consumption” but “the active process of generating and circulating
        meanings and pleasures within a social system”{" "}
        <a href="#ref-2" className="cite-highlight">
          (Fiske, 2010)<sup>2</sup>
        </a>
        . In his view, cultural commodities become resources for people to make
        their own meanings, rather than finished products that audiences simply
        absorb. There is little “authentic” vernacular culture created within
        late stage capitalism; instead, everyday life is lived through selective
        uses of what the system provides. Popular culture is thus a site of
        struggle the marginalised can appropriate, rework and resignify dominant
        ‘texts’. Fiske spoke about a cultural economy, an alternative
        non-monetary system where audiences, namely fans, are active producers
        of meaning, pleasure, and social identity, rather than passive
        consumers. Within the context of iShowSpeed this framework looks
        slightly different. The media he produces do not remain confined to
        their original context; viewers clip moments, re-edit them and circulate
        them across platforms, using them to express humour, frustration, irony
        or shared in-jokes far removed from the initial stream. As Fiske would
        argue: Speed generates a dense flow of “texts” that audiences actively
        rework into a cultural economy of references, reaction images and jokes.
        His popularity is therefore not only the result of his performance but
        of collective meaning-making: audience participation is central to his
        status as a cultural figure.
      </p>
      <br />

      <p style={{ width: isMobile ? "80%" : undefined }}>
        However, we do not live in Fiske’s media world anymore. The pace and
        dynamics of the cultural economy has changed significantly. The process
        of audiences making discriminating, creative use of the resources mass
        culture provides is routed through platforms whose infrastructures
        actively structure what appears, circulates and gains legitimacy. To
        keep critique politically sharp, we need to update Fiske with an account
        of how that agency is now channelled and monetised.
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        José van Dijck’s concept of ‘platformisation’ names this transformation.
        Djick describes ‘platformisation’ as the infiltration of digital
        platforms such as Tiktok or Twitch into the organisation of social and
        cultural practices, and the reorganisation of said practices around
        platform logics of datafication, monetisation and connectivity. These
        platforms do not simply host content anymore. Algorithms and business
        models shape what forms of participation are visible, online virality is
        actively shaped by data metrics. Platforms convert user activity into
        economic value. Clicks, comments, shares and watch times lay the
        foundation of how the market is organised. The celebrated
        “participation” of social media thus operates within what she calls the
        “logic of connectivity,” where technological, economically driven
        infrastructure determines what appears as spontaneous expression or
        grassroots virality{" "}
        <a href="#ref-3" className="cite-highlight">
          (Van Dijck, 2013)<sup>3</sup>
        </a>
        .
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        iShowSpeed’s rise from teenage gamer to global celebrity shows how
        certain personalities align with digital infrastructural demands. His
        comedic persona and high-energy livestreams produce a steady stream of
        potential viral fragments; algorithms that prioritise watch time, shares
        and rapid engagement make such content more likely to surface and
        resurface in recommendation loops, helping him build an audience.
        Participation via chat reactions, duets, and comments feed back into
        these systems as valuable data, increasing Speed’s visibility while
        generating revenue for the platforms themselves.
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        The concept of ‘Platformisation’ also explains why legacy cultural
        institutions such as the Disney or Warner have lost a lot of their
        former power to define what counts as culturally important, the cultural
        economy is now faster, and more fragmented. Younger viewers would rather
        find entertainment through their own online algorithmically sorted
        interests than engage with media provided by institutions. In 2024, a
        study conducted by Ofcom found that less than half of young people
        (16-24) watched live broadcast TV in a typical week, a sharp decline
        from around 81% in 2018{" "}
        <a href="#ref-4" className="cite-highlight">
          (Ofcom, 2024)<sup>4</sup>
        </a>
        , showcasing the influence platforms are having on the realities of
        younger people. Migration away from legacy media intensifies the power
        of platforms as primary arbiters of visibility, here we can see why
        linking critique to social change is crucial. The world is changing
        significantly in the space of a few years, if cultural studies lags
        behind infrastructure, the hierarchies that structure inequality will
        reproduce themselves. Contemporary critique that wants to matter
        politically must therefore interrogate platform accountability.
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        It is impossible for me to know exactly what iShowSpeed purposely
        encodes his content with, but Speed has stated in interviews: whilst he
        is a naturally outgoing person, he exaggerates his chaotic, comedic
        elements to keep audiences engaged. Some viewers would decode this
        purely as entertainment; others may see it as deliberate courting of
        controversy. To understand why many critique him, we can turn to Frantz
        Fanon’s account of racialised subjectivity. Fanon describes how the
        Black subject is “overdetermined from without,” fixed by racialising
        narratives that precede any individual performance. The Black body is by
        definition rendered hyper-visible and read through historical scripts of
        criminality, hypersexuality and excess{" "}
        <a href="#ref-5" className="cite-highlight">
          (Fanon, 2021)<sup>5</sup>
        </a>
        . Within media culture, Black men are often positioned as spectacular
        figures: Either falling into the “cool black guy” stereotype, in which
        narratives of charisma, edginess, stoicism, and being physically adept
        are placed onto - often through reading their bodies within colonial
        frameworks. A visibility predicated on assumptions about street
        credibility, or hypermasculinity. Or, evoke the minstrel-like archetype,
        where humor is derived from perceived lack of self-awareness, inviting
        audiences to laugh at them rather than with them. Speed’s content often
        falls into both, his natural charisma and athleticism has gained him
        traction, people tune in to see him do epic stunts such as backflipping
        and jumping over cars. Yet his online engagement often veers into
        ridicule.
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        His earlier videos show him playing up to this: one notoriously being
        during an Adin Ross Twitch stream. When told by instagram model Ash Kash
        she would not want to procreate with him if they were the last two
        people on earth, he responded:
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        "Who's going to stop me? Who's going to stop me?! If we are the last two
        people on Earth, who's going to stop me?!”
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        Leading to him being permanently banned from the platform. A gross
        example of Speed playing into the hypersexual stereotype.
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        At the same time, IShowSpeed is part of the first generation of digital
        natives - a term first written by American Educator Marc Prensky.
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        Gen-Z are the first generations to spend their developmental years using
        the technology we have today. Many have spent their entire lives
        surrounded by, and using computers, videogames, digital music players,
        video cams, cell phones, and all the other tools of the digital age{" "}
        <a href="#ref-6" className="cite-highlight">
          (Prensky, 2001)<sup>6</sup>
        </a>
        . These are the first generations whose adolescence and experimentation
        has been archived online. Missteps and phases that occur often during
        teenage years are archived online as content in a way no previous
        generation has faced.
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        Many young black boys have gone through similar phases - the struggle of
        trying to understand their identity through racialisation whilst their
        brains are still developing. Speed experienced this whilst having an
        audience of millions of people. Strong structural critique here should
        refuse to simplify these dynamics either to Speed’s personal intentions,
        or audience bad faith.
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        Through analysing the evidence presented, it can be concluded that
        critique of iShowSpeed, and digital minstrelsy in general is a nuanced
        debate. It is likely Speed was aware of racial stereotypes, and played
        up to them for views. But I think it is unfair to reduce his agency
        simply to that. He also just happens to be a charismatic, physically
        capable black man who got into streaming culture at the advent of
        ‘platformisation’. Instead, we should ask how platform algorithms might
        preferentially boost certain forms of Black masculinity while more
        mundane or reflective Black content circulates less easily. Speed’s
        career is both an instance of youth agency and creativity, and as an
        example of how racialised ways of seeing are woven into the logics of
        platform capitalism.
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        Taken together, Fiske, van Dijck and Fanon allow us to see iShowSpeed as
        a crystallization of broader transformations in culture and power.
        Contemporary popular culture is neither purely imposed from above nor
        simply democratic from below. Audience participation remains central,
        but it unfolds within the same infrastructures of inequality that
        continue to shape social life. Engagement with content is often filtered
        through historical stereotypes, which influence how audiences interpret
        both media and the world around them. This, in turn, generates a
        feedback loop where audience reactions drive algorithmic promotion,
        incentivizing producers to emphasize the very traits and performances
        that reinforce these stereotypes, in turn perpetuating their
        circulation.
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        If critique restricts itself to asking whether Speed as an individual is
        good, bad, authentic, or problematic, it risks inadvertently leaving the
        systems that profit from his labour untouched. Linking critique with
        social change means redirecting our analytical attention toward platform
        accountability and the racialised politics of representation.
        Recognising that participation can amplify existing hierarchies as
        easily as they appear to disrupt them. Critical theory is still
        important because it equips us to see culture as a living site of power
        struggle.
      </p>
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>
        IShowSpeed’s fame sits at the cross section of audience agency,
        algorithmic governance and long running debates about racialisation. To
        link critique with social change is to insist that any serious
        engagement with contemporary culture must also be an engagement with the
        systems that produce it. And to demand that those systems become sites
        of political contestation rather than invisible backdrops to our
        entertainment.
      </p>

      <div className="references-section">
        <ol>
          <li id="ref-1" className={activeRef === "ref-1" ? "active-ref" : ""}><a href="https://www.itu.int/itu-d/reports/statistics/facts-figures-2025/" target="_blank" rel="noopener noreferrer">Itu.int. (2025). Statistics. [online]</a></li>
          <li id="ref-2" className={activeRef === "ref-2" ? "active-ref" : ""}>
            <a href="https://www.routledge.com/Understanding-Popular-Culture/Fiske/p/book/9780415596534" target="_blank" rel="noopener noreferrer">Fiske, J. (2010). <em>Understanding Popular Culture</em>. 2nd ed. London: Routledge.</a>
          </li>
          <li id="ref-3" className={activeRef === "ref-3" ? "active-ref" : ""}>
            <a href="https://academic.oup.com/book/9914" target="_blank" rel="noopener noreferrer">Van Dijck, J. (2013). <em>The culture of connectivity: a critical history of social media</em>. Oxford University Press.</a>
          </li>
          <li id="ref-4" className={activeRef === "ref-4" ? "active-ref" : ""}>
            <a href="https://www.ofcom.org.uk/media-use-and-attitudes/media-habits-adults/gen-z-swerves-traditional-broadcast-tv-as-less-than-half-tune-in-weekly" target="_blank" rel="noopener noreferrer">Ofcom (2024). Gen Z Swerves Traditional Broadcast TV as Less than Half Tune in Weekly. [online]</a>
          </li>
          <li id="ref-5" className={activeRef === "ref-5" ? "active-ref" : ""}>
            <a href="https://www.penguin.co.uk/books/313127/black-skin-white-masks-by-fanon-frantz/9780241396667" target="_blank" rel="noopener noreferrer">Fanon, F. (2021). <em>Black Skin, White Masks</em>. London: Penguin Books.</a>
          </li>
          <li id="ref-6" className={activeRef === "ref-6" ? "active-ref" : ""}>
            <a href="https://doi.org/10.1108/10748120110424816" target="_blank" rel="noopener noreferrer">Prensky, M. (2001). Digital natives, Digital Immigrants. <em>On the Horizon</em>, 9(5).</a>
          </li>
        </ol>
      </div>
    </div>
  );
};
