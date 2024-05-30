import { useEffect } from "react";
import { useCubeContext } from "../contexts/cubeContext";
import SectionTemplate from "../templates/SectionTemplate";
import { Section, SoundIds } from "../types";

const homeOpt: string[] = [
  "continue",
  "new",
  "hall of fame",
  "scores",
  "settings",
  "about",
];

const Home = () => {
  const { musicRefs, isChrome } = useCubeContext();

  useEffect(() => {
    const musicEls = musicRefs?.current;

    if (!isChrome && musicEls?.length) {
      const music1 = musicEls.find((el) => el.id === SoundIds.mus1)!;
      music1.play();
      music1.loop = true;
    } else {
      // todo alert("If no audio, click anywhere on the window to activate it");

      const handleClick = () => {
        if (musicEls?.length) {
          const music1 = musicEls.find((el) => el.id === SoundIds.mus1)!;
          music1.play();
          music1.loop = true;

          removeEventListener("click", handleClick);
        }
      };

      addEventListener("click", handleClick);
    }
  }, []);

  return (
    <SectionTemplate id={Section.home}>
      <section id="home">
        <div className="wrapper">
          {homeOpt.map((opt) => (
            <button className="opt_btn" key={opt}>
              {opt}
            </button>
          ))}
        </div>
      </section>
    </SectionTemplate>
  );
};

export default Home;
