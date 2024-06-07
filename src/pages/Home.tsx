import { useEffect } from "react";
import { useCubeContext } from "../contexts/cubeContext";
import SectionTemplate from "../templates/SectionTemplate";
import { Section, SoundIds } from "../types";
import useSfx from "../hooks/useSfx";
import { clickSfx } from "../data";
import { Link } from "react-router-dom";
import ShortUniqueId from "short-unique-id";

const uid = new ShortUniqueId({ length: 6 });

const homeOpt: { title: string; path: string }[] = [
  { title: "new", path: `/g/${uid.randomUUID()}` },
  { title: "continue", path: "/g/123asd" },
  { title: "hall of fame", path: "/halloffame" },
  { title: "scores", path: "/scores" },
  { title: "settings", path: "/settings" },
  { title: "about", path: "/about" },
];

const Home = () => {
  const { musicRefs, isChrome, setIsContinue, setIsNew } = useCubeContext();
  const { playSfx } = useSfx();

  // !UNCOMMENT THIS OUT WHEN DONE

  useEffect(() => {
    const musicEls = musicRefs?.current;

    if (!isChrome && musicEls?.length) {
      const music1 = musicEls.find((el) => el.id === SoundIds.mus1)!;
      music1.play();
      music1.loop = true;
    } else {
      // todo alert("If no audio, click anywhere on the window to activate it");

      const handleClick = (e: MouseEvent) => {
        const check =
          (e.target as HTMLElement).textContent === "new" ||
          (e.target as HTMLElement).textContent === "continue";

        if (!check && musicEls?.length) {
          const music1 = musicEls.find((el) => el.id === SoundIds.mus1)!;
          music1.play();
          music1.loop = true;
        }
        removeEventListener("click", handleClick);
      };

      addEventListener("click", handleClick);
    }
  }, []);

  return (
    <SectionTemplate id={Section.home}>
      <div className="wrapper">
        {homeOpt.map((opt) => (
          <Link
            className="opt_btn"
            key={opt.title}
            onPointerDown={() => playSfx(clickSfx)}
            to={opt.path}
            onClick={() => {
              opt.title === "new" && setIsNew && setIsNew(true);
              opt.title === "continue" && setIsContinue && setIsContinue(true);
            }}
          >
            {opt.title}
          </Link>
        ))}
      </div>
    </SectionTemplate>
  );
};

export default Home;
