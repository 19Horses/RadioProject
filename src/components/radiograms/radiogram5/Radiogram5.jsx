import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import "./Radiogram5.css";
import { useAudio } from "../../../AudioContext";

const content = {
  en: [
    "Making the music video for Bunny Leap's first single was a process of revisiting and re-encountering a familiar childhood landscape.",
    "As a self-claimed filmmaker who has been shooting projects over the past five years, this collaboration with BUNNY LEAP marked my first music video project. It started from a very random position in November 2024, during the time I was on holiday in Shanghai, away from my artist (semi-unemployed) life in London. One day, I was hanging out with my friend since high school, Oliver (the vocalist of Bunny Leap), and learned that they were producing their first single.",
    "In an attempt to make myself feel less depressing and less life-wasting as a person, I offered to shoot a music video for them. At that point, there was only a demo. But the simplicity and sense of alienation in the music struck me immediately—it aligned closely with my own artistic practice. I became committed to visualising it and saw this as an opportunity to record once-familiar surroundings.",
    "In this pop-rock song, No One Can Leave This Place (没有人从这里离开), I sense a deeply personal touch beneath modernisation, both in the lyrics and the compositions. I see the perspective of a person wandering in the city without aim, crossing people, and the ever-changing scenario and, more importantly, the object remains. I hoped we could film in places that hold both the past and the present. When visualising it, I take the process as a personal memory collection and discovery, making it very intimate, in an almost home-video style.",
    'As someone born and raised in Yangpu District, a district that shifted away from labour-intensive industry in the early 2000s in Shanghai, I used to live in a very small old apartment with my entire family. My family had to cooperate to share the very limited space, and I tended not to view the surroundings in a sentimental way. Physical forms could hardly be personal. I had my own "private" in my imagination, when I was under my duvet. This still leaves its trace on me — I have been living in my room of a houseshare in Brixton for three years. I keep it minimalist, zero decoration, a large baggage case as a coat "hanger."',
    "On the contrary, Oliver always puts so much effort into his living spaces, and that really amazed me. That's why I became so obsessed with filming the cute little objects in his small backyard—one of the main locations for the video: Pokémon figurines staring at each other, and the Haier Brothers logo on an outdoor air-conditioning unit.",
    "As the song suggests, we walked a lot during the making of the video. Oliver took me on a walking tour as a scouting day; we wandered around his familiar neighbourhood in Yangpu. It became a process of revisiting and rediscovering a landscape that felt both familiar and distant in memory. I was camcording all the way along with my vintage camcorder — roadside mopeds, tree hollows with small birds, plastic water bottles hanging from windows.",
    'Eventually, we reached a wasteland, which used to be the neighbourhood Oliver lived in when he was a school kid, now fully demolished. He mentioned how interesting it felt: the same place that once seemed so large when he walked through the alleys after school now appeared incredibly small after the buildings had disappeared. This emotional sense of loss and displacement resonates with the lyrics in a light-hearted yet poignant way: "Am I still walking, faster?" ("我是不是还在走得更快走得更快").',
    "We knew immediately that we had to shoot there. Even the mannequin limbs arranged along the wall felt perfectly placed, carrying an unexpected sense of utopia.",
    "Although we share similar backgrounds in a metropolitan environment, Bunny Leap arrives at a more positive response to urban life than my own often passive or reluctant attitude toward humanity. Even if we are all somehow trapped within norms, we still choose to walk past people on the street.",
    '"I am glad just to be in the world as an observer—not to make a change, but simply to have a look."',
    'They question whether the "I" is the same as everybody else: should I keep the same pace walking down the street, or walk faster? Would it make any difference? Their answer lies in rejection—so long as we keep walking, it doesn\'t matter where to go.. Even if this rejection is subjective, its subjectivity is precisely what we value.',
    "Regarding the creation of the single, DaMi (the guitarist and composer) shared that she was initially inspired by the Japanese band Pasteboard while working on early demos in 2021. It was not until early 2024 that she brought these demos to Oliver and Shiwan (the lyricist) to develop the themes and lyrics together. Looking back, this journey began during the pandemic, when she started reflecting more deeply on how our minds process all information—how our perspectives are formed by memories, which are somehow preserved through subjectivity. The resulting focus and neglect have constructed the world's sense of unreality.",
    "For those living in cities, we adhere to norms and conventions of urbanised behaviour. In order for tens of millions of people to coexist in shared spaces, true freedom through social identity becomes impossible. While constrained by urbanisation, we also benefit from it. Thus we realise that no one can leave this place.",
    "This song can be our answer.",
    "We hope it carries a sense of hope.",
  ],
  zh: [
    "为Bunny Leap的首支单曲制作MV，是一个重访和重新邂逅熟悉童年风景的过程。",
    "作为一个自称在过去五年里一直在拍摄项目的电影人，与BUNNY LEAP的这次合作是我的第一个MV项目。它始于2024年11月一个非常偶然的时刻，当时我正在上海度假，远离我在伦敦的艺术家（半失业）生活。有一天，我和高中以来的朋友Oliver（Bunny Leap的主唱）出去玩，得知他们正在制作他们的第一支单曲。",
    "为了让自己感觉不那么沮丧、不那么浪费生命，我主动提出为他们拍摄MV。那时只有一个小样。但音乐中的简洁和疏离感立刻打动了我——这与我自己的艺术实践非常契合。我开始致力于将其可视化，并将此视为记录曾经熟悉的环境的机会。",
    "在这首流行摇滚歌曲《没有人从这里离开》中，我在歌词和编曲的现代化表象下感受到了一种深刻的个人触感。我看到一个人漫无目的地在城市中游荡的视角，与人擦肩而过，场景不断变化，而更重要的是，物体依然存在。我希望我们能在承载过去和现在的地方拍摄。在可视化的过程中，我把它当作一种个人记忆的收集和发现，使其非常私密，几乎像家庭录像的风格。",
    "作为一个在上海杨浦区出生和长大的人——这个区在2000年代初期从劳动密集型产业转型——我曾经和全家人住在一个非常小的老公寓里。我的家人必须合作分享非常有限的空间，我倾向于不以感伤的方式看待周围的环境。物理形式很难成为个人的。我在被窝里时，有我自己的想象中的'私人'空间。这仍然在我身上留下了痕迹——我在布里克斯顿合租屋的房间里住了三年。我保持极简主义，零装饰，一个大行李箱当作衣架。",
    "相反，Oliver总是在他的生活空间上投入很多心思，这真的让我惊叹。这就是为什么我如此着迷于拍摄他小后院里那些可爱的小物件——这是视频的主要拍摄地点之一：互相对视的宝可梦手办，以及室外空调机组上的海尔兄弟标志。",
    "正如歌曲所暗示的，我们在制作视频期间走了很多路。Oliver带我进行了一次步行勘景；我们在杨浦他熟悉的街区闲逛。这成为了一个重访和重新发现的过程，一个在记忆中既熟悉又遥远的风景。我一路上用我的复古摄像机拍摄——路边的电动车、有小鸟的树洞、挂在窗户上的塑料水瓶。",
    "最终，我们到达了一片荒地，那里曾是Oliver小时候住的街区，现在已经完全拆除了。他提到这种感觉有多有趣：当他放学后穿过小巷时，同一个地方曾经显得那么大，而在建筑物消失后却显得如此小。这种失落和错位的情感以一种轻松却又尖锐的方式与歌词产生共鸣：'我是不是还在走得更快走得更快'。",
    "我们立刻知道我们必须在那里拍摄。甚至沿墙排列的人体模型肢体也感觉恰到好处，带着一种意想不到的乌托邦感。",
    "虽然我们在大都市环境中有着相似的背景，但Bunny Leap对城市生活的回应比我自己对人类常常被动或不情愿的态度更为积极。即使我们都在某种程度上被困在规范之中，我们仍然选择在街上与人擦肩而过。",
    "我'很高兴只是作为一个观察者存在于这个世界上——不是为了做出改变，而只是为了看看。'",
    "他们质疑'我'是否和其他人一样：我应该在街上保持同样的步伐，还是走得更快？这会有什么不同吗？他们的答案在于拒绝——只要我们继续走，去哪里并不重要。即使这种拒绝是主观的，它的主观性正是我们所珍视的。",
    "关于单曲的创作，DaMi（吉他手和作曲人）分享说，她最初是在2021年制作早期小样时受到日本乐队Pasteboard的启发。直到2024年初，她才把这些小样带给Oliver和Shiwan（作词人），一起发展主题和歌词。回顾起来，这段旅程始于疫情期间，当时她开始更深入地思考我们的大脑如何处理所有信息——我们的观点如何由记忆形成，而记忆又以某种方式通过主观性被保存。由此产生的关注和忽视构建了世界的不真实感。",
    "对于生活在城市中的人来说，我们遵守城市化行为的规范和惯例。为了让数以千万计的人在共享空间中共存，通过社会身份获得真正的自由变得不可能。在受到城市化约束的同时，我们也从中受益。因此我们意识到，没有人能离开这个地方。",
    "这首歌可以是我们的答案。",
    "我们希望它承载着希望。",
  ],
};

export const Radiogram5 = () => {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [language, setLanguage] = useState("en");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { isPlaying: isMixPlaying } = useAudio();

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
      >
        {texts.map((text, index) => (
          <p
            key={`${language}-${index}`}
            style={{
              width: isMobile ? "80%" : undefined,
            }}
          >
            {text}
          </p>
        ))}
      </div>

      {ReactDOM.createPortal(
        <>
          <div className="video-underlay" />
          <div className="video-embed">
            <iframe
              src={`https://player.vimeo.com/video/1117416036?h=b495e488c4&title=0&byline=0&portrait=0&sidedock=0&pip=0&dnt=1&autoplay=1${isMixPlaying ? "&muted=1" : ""}`}
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="Bunny Leap Music Video"
            />
          </div>
        </>,
        document.body,
      )}
    </div>
  );
};
