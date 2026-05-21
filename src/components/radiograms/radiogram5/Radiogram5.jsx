import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import "./Radiogram5.css";

const content = {
  en: [
    "Making the music video for <b>BUNNY LEAP</b>’s first single was a process of revisiting and re-encountering a familiar childhood landscape.",
    "As a self-claimed filmmaker who has been shooting projects over the past five years, this collaboration with BUNNY LEAP marked my first music video project. It started from a very random position in November 2024, during the time I was on holiday in Shanghai, away from my artist (semi-unemployed) life in London. One day, I was hanging out with my friend since high school, Oliver (the vocalist of <b>BUNNY LEAP</b>), and learned that they were producing their first single. ",
    "In an attempt to make myself feel less depressing and less life-wasting as a person, I offered to shoot a music video for them. At that point, there was only a demo. But the simplicity and sense of alienation in the music struck me immediately—it aligned closely with my own artistic practice. I became committed to visualising it and saw this as an opportunity to record once-familiar surroundings.",
    "In this pop-rock song, <i>No Exit (没有人从这里离开)</i>, I sense a deeply personal touch beneath modernisation, both in the lyrics and the compositions. I see the perspective of a person wandering in the city without aim, crossing people, and the ever-changing scenario and, more importantly, the object remains. ",
    "I hoped we could film in places that hold both the past and the present. When visualising it, I take the process as a personal memory collection and discovery, making it very intimate, in an almost home-video style.",
    "As someone born and raised in Yangpu District, a district that shifted away from labour-intensive industry in the early 2000s in Shanghai, I used to live in a very small old apartment with my entire family. My family had to cooperate to share the very limited space, and I tended not to view the surroundings in a sentimental way. Physical forms could hardly be personal. I had my own “private” in my imagination, when I was under my duvet. This still leaves its trace on me — I have been living in my room of a houseshare in Brixton for three years. I keep it minimalist, zero decoration, a large baggage case as a coat “hanger.”",
    "On the contrary, Oliver always puts so much effort into his living spaces, and that really amazed me. That’s why I became so obsessed with filming the cute little objects in his small backyard—one of the main locations for the video: Pokémon figurines staring at each other, and the Haier Brothers logo on an outdoor air-conditioning unit.",
    "As the song suggests, we walked a lot during the making of the video. Oliver took me on a walking tour as a scouting day; we wandered around his familiar neighbourhood in Yangpu. It became a process of revisiting and rediscovering a landscape that felt both familiar and distant in memory. I was camcording all the way along with my vintage camcorder — roadside mopeds, tree hollows with small birds, plastic water bottles hanging from windows.",
    "Eventually, we reached a wasteland, which used to be the neighbourhood Oliver lived in when he was a school kid, now fully demolished. He mentioned how interesting it felt: the same place that once seemed so large when he walked through the alleys after school now appeared incredibly small after the buildings had disappeared. This emotional sense of loss and displacement resonates with the lyrics in a light-hearted yet poignant way: <i>“Am I still running faster; running faster now and then” (“我是不是还在 走得更快 走得更快”)</i>.",
    "We knew immediately that we had to shoot there. Even the mannequin limbs arranged along the wall felt perfectly placed, carrying an unexpected sense of utopia.",
    "Although we share similar backgrounds in a metropolitan environment, <b>BUNNY LEAP</b> arrives at a more positive response to urban life than my own often passive or reluctant attitude toward humanity. Even if we are all somehow trapped within norms, we still choose to walk past people on the street.",
    "“I am glad just to be in the world as an observer—not to make a change, but simply to have a look.”",
    "They question whether the “I” is the same as everybody else: should I keep the same pace walking down the street, or walk faster? Would it make any difference? Their answer lies in rejection—so long as we keep walking, it doesn’t matter where to go. Even if this rejection is subjective, its subjectivity is precisely what we value.",
    "Regarding the creation of the single, Rice (the guitarist and composer) shared that she was initially inspired by the Japanese band <i>Pasteboard</i> while working on early demos in 2021. It was not until early 2024 that she brought these demos to Oliver and Shiwan (the lyricist) to develop the themes and lyrics together. Looking back, this journey began during the pandemic, when she started reflecting more deeply on how our minds process all information—how our perspectives are formed by memories, which are somehow preserved through subjectivity. The resulting focus and neglect have constructed the world’s sense of unreality.",
    "For those living in cities, we adhere to norms and conventions of urbanised behaviour. In order for tens of millions of people to coexist in shared spaces, true freedom through social identity becomes impossible. While constrained by urbanisation, we also benefit from it. Thus we realise that <i>there&#39;s No Exit to this place</i>.",
    "This song can be our answer.",
    "We hope it carries a sense of hope.",
  ],
  zh: [
    "拍摄崖跳兔（<b>Bunny Leap</b>）乐队首支单曲的 MV，对我来说，是一段关于童年景象的追忆与奇遇。",
    "自居一名影像创作者，在过去五年里我参与了不少拍摄，而与崖跳兔的合作是我的第一个 MV 项目。它始于偶然——2024 年 11 月，当时我正在上海休假，短暂远离在伦敦的艺术家（半失业）生活。某天，我与高中好友 Oliver（崖跳兔主唱）一起闲逛，恰巧得知他们正在制作乐队的第一支单曲。",
    "为了让自己不那么消沉且感到浪费人生，我便主动提出为他们拍摄单曲的 MV。那时音乐还只是一个 demo，但我即刻就被其吸引——它所蕴含着的某种纯粹与疏离，巧妙地与我自身艺术语言相契合。我很快就做下决定，准备将其视觉化，也将这次合作视作一次记录重访曾经熟悉街区的契机。",
    "在这首流行摇滚作品《没有人从这里离开》中，我在歌词与编曲里感受到一种隐藏在现代化表象之下的触感。我看到的是一个在城市中漫无目的行走的人，穿过人群，穿过不断变化的场景——以及，那些遗留下的事物。",
    "我希望拍摄的地点能同时承载此刻与过去。在构思影像时，我将整个过程视为一次个人记忆的收集与重遇，因此影像的最终呈现带着家庭录影带的亲密质感。",
    "我出生并成长于上海杨浦区。这里在 2000 年代初逐渐由劳动密集型工业区开始转型。小时候，我曾和全家人一起住在一个很小的老公房里，我们必须规划共享非常有限的空间。而我也很少以感性的方式去看待周围的环境，因为物理空间很难真正属于个人。我的“私人空间”存在于想象世界中——藏在被子底下。这段经历至今仍在我身上留下痕迹：我已经在Brixton的一间合租房里生活了三年，房间仍旧保持极简，没有任何装饰，我的大行李箱靠墙摆放，成为了我的“衣架”。",
    "与我相反，Oliver 总是非常用心地布置他的生活空间，这一点一直让我感到惊喜。也正因如此，我沉迷于拍摄他家后院里那些可爱的小物件：尴尬对视的宝可梦手办，室外空调机上印着的“海尔兄弟”标志——随后那里成为了 MV 的主要拍摄地点之一。",
    "正如歌中所唱的那样，我们在拍摄过程中走了很多路。Oliver 带我进行了一次“步行观光式勘景”，我们在他熟悉的杨浦街区游走。这逐渐变成一次重访与发现的旅程：路边的电动车、树洞和小鸟、窗外悬挂的塑料水瓶——一路上，我用我的老式摄像机记录拍摄，这一段段在记忆中既熟悉又陌生的风景。",
    "最终，我们来到了一片建筑荒地——那曾是 Oliver 小学时居住的社区，如今已被完全拆除。他提到这是一种奇妙的感受：当年每天放学后穿行其中的小巷，在记忆里显得无比宽敞的路，而在建筑消失之后，却变得异常渺小。这种关于失落与错位的情绪，以一种轻松却隐忍的方式呼应着歌词：“我是不是还在 / 走得更快 / 走得更快”。",
    "我们即刻决定，我们必须要在这里拍点什么。就连沿墙巧妙摆放的模特假肢，都显得恰到好处，带着一丝乌托邦式的趣味。",
    "尽管我们都成长于都市背景下，相较于我一如既往的消极态度，崖跳兔似乎对城市化中的困境有着更为积极的回应。即使在某种程度上我们都被困于规则之中，我们仍然选择，超越路上的行人，继续前行。",
    "“我很高兴只是作为一个观察者来到这个世界上——不为去改变什么，只是来看一看。”",
    "他们质疑“我”是否“他人”一样：在街道上行走时，我该保持同样的速度，还是走得更快？这又真有所不同吗？他们以拒绝作为答案——只要继续走下去，去哪里并不重要。即使这种拒绝是主观的，我们珍视这种主观本身。",
    "在谈及这首单曲的创作时，大米（崖跳兔吉他手兼作曲）分享道：她在 2021 年制作早期 demo 时，最初风格受到日本乐队 Pasteboard 的启发。直到 2024 年初，她才将这些 demo 带给 Oliver 与作词人十万，一同发展主题与歌词。回顾这段创作旅程，她意识到是在疫情期间，她开始更深入地思考我们的大脑如何处理所有信息——我们的意识如何由记忆形成，而记忆又以某种方式通过主观性被保存。由此产生的关注和忽视，共同构成了我们所感知的世界的“不真实感”。",
    "对于城市中的人而言，我们遵循着都市化的行为规范与秩序。为了让数以千万计的人得以共处于共享空间之中，通过社会身份实现的“真正自由”几乎是不可能的。我们一方面被城市化所限制，另一方面也从中受益。于是我们逐渐意识到：没有人能从这里离开。",
    "这首歌，或许可以作为我们的回答。<br/>我们希望，它带着希望。",
  ],
};

const t = (m, s) => m * 60 + s;

const LYRICS = [
  { start: t(0, 9), end: t(0, 15), text: "bunny Leap" },
  { start: t(0, 18), end: t(0, 26), text: "no Exit" },
  { start: t(0, 35), end: t(0, 41), text: "the skyline cuts my view in half" },
  { start: t(0, 43), end: t(0, 50), text: "as I lean into the noise" },
  { start: t(0, 53), end: t(1, 0), text: "autumn lights on busy streets" },
  {
    start: t(1, 1),
    end: t(1, 8),
    text: "don't know where this night will land",
  },
  { start: t(1, 28), end: t(1, 32), text: "shoulders passing, out of time" },
  {
    start: t(1, 33),
    end: t(1, 38),
    text: "speed it up, slow it down, how far I try",
  },
  { start: t(1, 39), end: t(1, 41), text: "keep away from wondering eyes" },
  {
    start: t(1, 42),
    end: t(1, 47),
    text: "in my steps, by roadside, hold tight to glow",
  },
  { start: t(1, 48), end: t(1, 52), text: "will you ever come my way" },
  { start: t(1, 52), end: t(1, 56), text: "come my way again" },
  { start: t(1, 57), end: t(2, 0), text: "we're afraid of missing the beat" },
  { start: t(2, 1), end: t(2, 5), text: "we miss it all the time" },
  { start: t(2, 6), end: t(2, 10), text: "am I still running faster" },
  { start: t(2, 11), end: t(2, 14), text: "running faster now and then" },
  { start: t(2, 15), end: t(2, 18), text: "when no one ever leaves" },
  { start: t(2, 19), end: t(2, 26), text: "no exit" },
  { start: t(2, 41), end: t(2, 47), text: "dawn breaks across the ground" },
  {
    start: t(2, 49),
    end: t(2, 56),
    text: "light is falling through the cracks",
  },
  { start: t(2, 59), end: t(3, 5), text: "i pull myself back into shape" },
  { start: t(3, 6), end: t(3, 14), text: "looking for a place to stop" },
  { start: t(3, 17), end: t(3, 20), text: "sunglasses on, reading signs" },
  { start: t(3, 21), end: t(3, 25), text: "run a little wild tonight" },
  { start: t(3, 26), end: t(3, 29), text: "every warning in my head" },
  {
    start: t(3, 30),
    end: t(3, 35),
    text: "says slow it down, slow it down, I'm losing ground",
  },
  { start: t(3, 36), end: t(3, 40), text: "will you ever come my way" },
  { start: t(3, 40), end: t(3, 44), text: "come my way again" },
  { start: t(3, 45), end: t(3, 49), text: "we're afraid of missing the beat" },
  { start: t(3, 49), end: t(3, 53), text: "we miss it every time" },
  { start: t(3, 54), end: t(3, 58), text: "am I still running faster" },
  { start: t(3, 58), end: t(4, 2), text: "running faster now" },
  { start: t(4, 3), end: t(4, 7), text: "when no one ever leaves" },
  { start: t(4, 7), end: t(4, 11), text: "no exit" },
  { start: t(4, 12), end: t(4, 16), text: "a crowded room, a rising sound" },
  { start: t(4, 16), end: t(4, 20), text: "i'm spinning just to stay around" },
  { start: t(4, 21), end: t(4, 25), text: "wide awake inside the pull" },
  {
    start: t(4, 25),
    end: t(4, 32),
    text: "right at the center, going nowhere",
  },
  {
    start: t(5, 5),
    end: t(5, 12),
    text: "there'll always be, roads that never end.",
  },
  { start: t(5, 13), end: t(5, 19), text: "keep walking" },
  { start: t(5, 20), end: t(5, 25), text: "as they fade" },
];

export const Radiogram5 = ({ isPlaying }) => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [language, setLanguage] = useState("en");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [videoPaused, setVideoPaused] = useState(false);
  const [videoMuted, setVideoMuted] = useState(true);
  const [videoTime, setVideoTime] = useState(0);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          requestAnimationFrame(() => {
            entry.target.classList.add("visible");
            setTimeout(() => {
              entry.target.style.willChange = "auto";
            }, 2000);
          });
        }
      });
    }, observerOptions);

    const paragraphs = containerRef.current?.querySelectorAll("p");

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
  }, [language]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTimeUpdate = () => setVideoTime(v.currentTime);
    v.addEventListener("timeupdate", onTimeUpdate);
    return () => v.removeEventListener("timeupdate", onTimeUpdate);
  }, []);

  const activeLyric = LYRICS.find(
    (l) => videoTime >= l.start && videoTime < l.end,
  );

  const toggleLanguage = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setLanguage((prev) => (prev === "en" ? "zh" : "en"));
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 400);
  };

  const texts = content[language];

  return (
    <div className="radiogram-4" ref={containerRef}>
      <button className="language-toggle" onClick={toggleLanguage}>
        {language === "en" ? "→ 翻译成中文" : "→ Translate to English"}
      </button>

      <div
        className={`article-content ${isTransitioning ? "fade-out" : "fade-in"}`}
        style={{
          paddingBottom: "150px",
        }}
      >
        {texts.map((text, index) => (
          <p
            key={`${language}-${index}`}
            style={{
              width: isMobile ? "80%" : undefined,
            }}
            dangerouslySetInnerHTML={{ __html: text }}
          />
        ))}
      </div>

      {ReactDOM.createPortal(
        <>
          <div className="video-underlay" />
          <div
            className={`video-embed${isPlaying != null ? " video-embed--mix-playing" : ""}`}
          >
            <video
              ref={videoRef}
              src="https://radiogram-6-bucket.s3.eu-west-2.amazonaws.com/No+Exit+MV.m4v"
              autoPlay
              loop
              muted
              playsInline
            />
            <div
              className={`video-lyrics${activeLyric ? " video-lyrics--visible" : ""}`}
            >
              {activeLyric?.text}
            </div>
            <div className="video-controls">
              <button
                className="video-btn"
                onClick={() => {
                  const v = videoRef.current;
                  if (!v) return;
                  if (v.paused) {
                    v.play();
                    setVideoPaused(false);
                  } else {
                    v.pause();
                    setVideoPaused(true);
                  }
                }}
              >
                {videoPaused ? "play" : "pause"}
              </button>
              <button
                className="video-btn"
                onClick={() => {
                  const v = videoRef.current;
                  if (!v) return;
                  v.muted = !v.muted;
                  setVideoMuted(v.muted);
                }}
              >
                {videoMuted ? "unmute" : "mute"}
              </button>
            </div>
          </div>
        </>,
        document.body,
      )}
    </div>
  );
};
