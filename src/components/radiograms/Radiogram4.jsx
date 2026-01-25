import React, { useEffect, useRef, useState } from "react";
import "./Radiogram4.css";

export const Radiogram4 = () => {
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
      <p style={{ width: isMobile ? "80%" : undefined }}>(I)</p>
      <p
        style={{
          textAlign: isMobile ? "left" : "justify",
        }}
      >
        We waited on a cursus barrow when the queue had melded into a mass. It
        would ease up and we’d be closer to the sunset here. It was marked by
        high drumsong collapsing into human shouts. There are few sheep on the
        fields beneath, babies and mothers, clips on their ears. I take pictures
        of Gabby and Luke in the pink dusk turning lilac and indigo.{" "}
      </p>
      <p style={{ width: isMobile ? "80%" : undefined }}>
        Dianne and George in heavy gear parked their e-bikes at the barrow’s
        base. They wore sporty sunglasses and did their best to tolerate us, the
        newly high and just out of London. They have been to every such landmark
        in England, pulling up a youtube video, introducing a nearby valley of
        prehistoric stones, ‘worth a visit’. I asked if they were
        archaeologists, ‘Just old’ Diane offers ‘and nothing better to do than
        look at stones’. They are spending the night on the barrow, watching the
        summer solstice from outside Stonehenge, ‘not until we get our stones
        back’. In 1977, Stonehenge was roped off, and formally fenced in 1978,
        with visitors only allowed to walk up to them at pre-arranged dates and
        times. One used to be able to drive right up to the stones, touch them,
        carve pictures in their moss. The sun setting and rising, is that the
        passing of time? The importance of appointments, the moments held and
        missed, the difference being the sun, in relation to us, the movement of
        the earth and what it means to age. Luke asks about the meaning, ‘That’s
        the point, no one knows, it’s all conjecture at this point’ George
        speaks from behind tinted lenses. Dianne laughs when I tell her this is
        all I’ve worn.
      </p>
      <br />

      <p style={{ width: isMobile ? "80%" : undefined }}>
        It feels like any other festival, a tent selling t-shirts and tote bags,
        trucks with crepes and duck fat fries. There is no Momo truck yet, maybe
        next year. Mapping where the nearest dark kitchen could be. The
        improperness of this opening scene strikes something hollow in me so I
        say ‘funny’. I will say this aloud and to myself a lot tonight, tiring
        myself out.
      </p>

      <p style={{ width: isMobile ? "80%" : undefined }}>
        A lone trumpet plays a standard, and a couple with elven ears press
        their heads each others against one of the stones in silence. The stones
        are hold heat from the day’s sun. Twin women with big white curls and
        neon glasses have claimed a smaller rock. Like mermaids with feathers in
        their hair, a leopard print picnic mat, the crystal sea. The stones are
        cast in a deep blue, like a UV. Drumming at the the inner circle,
        teenagers flirting on altar stones, a young man in a stylish suit
        laughing 7tft above the ground. The drumming quickens, the crowd hums a
        spontaneous baseline. Large rocks around us, something fallen, something
        of a reminder. We are dancing on the dead. We are playing drums on the
        dead.{" "}
      </p>
      <br />
      <br />
      <p style={{ width: isMobile ? "80%" : undefined }}>(II)</p>
      <p style={{ width: isMobile ? "80%" : undefined }}>
        From Cat and Mutton bridge I see the fireworks from Victoria Park. It
        was bonfire night this past Wednesday. Throughout the week before and
        now the days after, I’d glimpse firework shows between buildings, in the
        distance over treetops, pyrochemical smell in the air.
      </p>
      <p style={{ width: isMobile ? "80%" : undefined }}>
        On bonfire night, I met a black cat who was frightened. Her back arched
        into a c-shape, she kept grazing past me, back and forth, she couldn't
        sit still. I think she only came to me because I was dressed all in
        black, apparently black cats do that. I read somewhere that all cats
        think we're big cats who serve them. They think we must be stupid to
        share our food. I live with a cat now and bless her, she's 13 years old,
        and she never learned to retract her claws. So even when she's happy,
        even when she's resting, her claws are out. She is laying on me as I
        write some of these sentences, her head and tailed curled into her paws.
        There re three Buddhas in the backyard and sometimes she sits there for
        hours, bowing with her eyes shut next From Cat and Mutton bridge I see
        the fireworks from Victoria Park. It was bonfire night this past
        Wednesday. Throughout the week before and now the days after, I’d
        glimpse firework shows between buildings, in the distance over treetops,
        pyrochemical smell in the air.
      </p>
      <br />

      <p style={{ width: isMobile ? "80%" : undefined }}>
        When I was six years old, my cat was dying and she stopped eating
        because all her teeth had come out. Her claws too, were weak and some of
        them had ripped out from her paws, leaving red gapes. On the last day of
        her life, I was having fried fish for breakfast. Periodically, I’d go
        looking for her, squidging up some fish meat, thinking she might like to
        suck on it. The third time I went to find her, she was on our sheep skin
        rug and she was dead and stretched out frozen, the fish meat from my
        last visit splayed out on the terrazzo flooring. I'd never seen her
        stretched out like that. Her legs. and hands, and all four legs were
        straight stiff and her eyes frozen open. Though it was still morning, my
        father came home from work, she stayed just as stiff when he lifted her
        and put her in the ground.
      </p>
      <p style={{ width: isMobile ? "80%" : undefined }}>
        She had a chunk of white marble as a tombstone. I dug up some yellow
        wild flowers to plant at her grave. Today I learn they are called
        Singapore Daisies. We said prayers for her, me in pyjamas, my father,
        the sleeves of his white button down rolled up till his elbows, the noon
        sun blaring. A year later, it rained throughout the day and I saw a
        stalk shoot up an inch then tremor. I wondered if she could feel the
        rain through the earth. Two years later, we relevelled that part of the
        garden, work boots crushing the flowers. I told my mother they were
        stepping on her grave.
      </p>
    </div>
  );
};
