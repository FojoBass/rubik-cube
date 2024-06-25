import { useEffect } from "react";
import { useCubeContext } from "../contexts/cubeContext";
import SectionTemplate from "../templates/SectionTemplate";
import { ModalKeys, Section, SoundIds } from "../types";
import useSfx from "../hooks/useSfx";
import { clickSfx } from "../data";
import { Link } from "react-router-dom";
import ShortUniqueId from "short-unique-id";
import { useCubeDispatch, useCubeSelector } from "../app/store";
import { cubeSlice } from "../app/features/cubeSlice";

const uid = new ShortUniqueId({ length: 6 });

const Home = () => {
  const homeOpt: { title: string; path: string }[] = [
    { title: "new", path: `/g/${uid.randomUUID()}` },
    { title: "continue", path: "/g/nil" },
    // { title: "hall of fame", path: "/halloffame" },
    // { title: "scores", path: "/scores" },
    { title: "settings", path: "" },
    { title: "about", path: "/about" },
  ];

  const {
    musicRefs,
    isChrome,
    setIsContinue,
    setIsNew,
    setOpenModal,
    isMusic,
    setIsMusic,
    firstEntry,
  } = useCubeContext();
  const { playSfx } = useSfx();
  const { isComplete, playerInfo, gameInfo } = useCubeSelector(
    (state) => state.cube
  );
  const { setIsComplete, resetInfos } = cubeSlice.actions;
  const dispatch = useCubeDispatch();

  // !UNCOMMENT THIS OUT WHEN DONE

  useEffect(() => {
    const musicEls = musicRefs?.current;

    setOpenModal && setOpenModal({ key: "", state: false });

    isComplete && dispatch(setIsComplete(false));
    (playerInfo || gameInfo) && dispatch(resetInfos());

    if ((!isChrome || isMusic) && musicEls?.length) {
      const music1 = musicEls.find((el) => el.id === SoundIds.mus1)!;
      music1.play();
      music1.loop = true;
    } else if (!isMusic && !firstEntry) {
      alert("If no audio, click anywhere on the window to activate it");

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
        setIsMusic && setIsMusic(true);
      };

      addEventListener("click", handleClick);
    }

    console.log("firstEntry: ", firstEntry);
  }, [firstEntry]);

  return (
    <SectionTemplate id={Section.home}>
      <div className="wrapper">
        {homeOpt.map((opt) =>
          opt.path ? (
            <Link
              className="opt_btn"
              key={opt.title}
              onPointerDown={() => playSfx(clickSfx)}
              to={opt.path}
              onClick={() => {
                opt.title === "new" && setIsNew && setIsNew(true);
                opt.title === "continue" &&
                  setIsContinue &&
                  setIsContinue(true);
              }}
            >
              {opt.title}
            </Link>
          ) : (
            <button
              className="opt_btn"
              key={opt.title}
              onPointerDown={() => playSfx(clickSfx)}
              onClick={() =>
                setOpenModal &&
                setOpenModal({ key: ModalKeys.set, state: true })
              }
            >
              {opt.title}
            </button>
          )
        )}
      </div>
    </SectionTemplate>
  );
};

export default Home;
