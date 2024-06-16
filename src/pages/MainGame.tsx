import SectionTemplate from "../templates/SectionTemplate";
import {
  CubeEnum,
  CubeInt,
  GameInfoInt,
  ModalKeys,
  Section,
  SoundIds,
} from "../types";
import { MouseEventHandler, useEffect, useRef, useState } from "react";
import { useCubeDispatch, useCubeSelector } from "../app/store";
import { useCubeContext } from "../contexts/cubeContext";
import { FaRegSave, FaSpinner } from "react-icons/fa";
import Lazyload from "../components/Lazyload";
import { IoPauseOutline } from "react-icons/io5";
import { formatDuration, genRandomNum } from "../helpers";
import ShortUniqueId from "short-unique-id";
import { serverTimestamp } from "firebase/firestore";
import { cubeSlice } from "../app/features/cubeSlice";
import {
  createGame,
  getGameInfo,
  getPlayer,
  updateGame,
} from "../app/features/cubeAsyncThunk";
import { useLocation } from "react-router-dom";
import Controls from "../components/Controls";
import { useRecon } from "../hooks/useRecon";
import { acceptSfx, clickSfx } from "../data";
import useSfx from "../hooks/useSfx";

// todo setup isChrome functionality for firstEntry
// *For testing purposes, we will show position

// *Finally implemented fetchings for reloads
// todo Reflect fetched gameInfo in the cubes

const MainGame = () => {
  const {
    playerInfo,
    saving,
    // savingFailed,
    // savingSuccess,
    error,
    fetchingGameFailed,
    fetchingGameSuccess,
    fetchingPlayerFailed,
    fetchingPlayerSuccess,
    gameInfo,
  } = useCubeSelector((state) => state.cube);
  const {
    musicRefs,
    isNew,
    isContinue,
    isFormEntry,
    setIsContinue,
    setIsFormEntry,
    setOpenModal,
    isPlay,
    setIsPlay,
    isReset,
    setIsReset,
  } = useCubeContext();
  const rightCubeRef = useRef<HTMLDivElement | null>(null);
  const leftCubeRef = useRef<HTMLDivElement | null>(null);
  const centerCubeRef = useRef<HTMLDivElement | null>(null);
  const topCubeRef = useRef<HTMLDivElement | null>(null);
  const midCubeRef = useRef<HTMLDivElement | null>(null);
  const bottomCubeRef = useRef<HTMLDivElement | null>(null);
  const rightBoxesRef = useRef<HTMLSpanElement[]>([]);
  const centerBoxesRef = useRef<HTMLSpanElement[]>([]);
  const leftBoxesRef = useRef<HTMLSpanElement[]>([]);
  const topBoxesRef = useRef<HTMLSpanElement[]>([]);
  const midBoxesRef = useRef<HTMLSpanElement[]>([]);
  const bottomBoxesRef = useRef<HTMLSpanElement[]>([]);
  const facesRef = useRef<HTMLDivElement[]>([]);
  const backsRef = useRef<HTMLDivElement[]>([]);
  const topsRef = useRef<HTMLDivElement[]>([]);
  const bottomsRef = useRef<HTMLDivElement[]>([]);
  const rightsRef = useRef<HTMLDivElement[]>([]);
  const leftsRef = useRef<HTMLDivElement[]>([]);
  const [isClrsSet, setIsClrsSet] = useState(false);
  const vertCubeRef = useRef<HTMLDivElement | null>(null);
  const horCubeRef = useRef<HTMLDivElement | null>(null);
  const rightCubeAngle = useRef(0);
  const leftCubeAngle = useRef(0);
  const topCubeAngle = useRef(0);
  const bottomCubeAngle = useRef(0);
  const durationRef = useRef(0);
  const dispatch = useCubeDispatch();
  const {
    // resetSavingFailed,
    // resetSavingSuccess,
    resetFetchingGameFailed,
    resetFetchingGameSuccess,
    resetFetchingPlayerFailed,
    resetFetchingPlayerSuccess,
    resetInitializedFailed,
    resetInitializedSuccess,
  } = cubeSlice.actions;
  const { pathname } = useLocation();
  const [gameLoading, setGameLoading] = useState(true);
  const [isLoadingFailed, setIsLoadingFailed] = useState(false);
  const [isReload, setIsReload] = useState(false);
  const [modDuration, setModDuration] = useState("");
  const { reconciler, reconcileColors } = useRecon({
    bottomBoxesRef,
    centerBoxesRef,
    leftBoxesRef,
    midBoxesRef,
    rightBoxesRef,
    topBoxesRef,
  });
  const [isChanges, setIsChanges] = useState(false);
  const [moves, setMoves] = useState(0);
  const { playSfx } = useSfx();

  const handleSave: MouseEventHandler = () => {
    saveGameInfo();
  };
  0;

  const colorSetter = (
    els: HTMLElement[],
    clr: "white" | "blue" | "red" | "orange" | "yellow" | "green"
  ): Promise<void> => {
    return new Promise((resolve: () => void) => {
      els.forEach((el) => {
        el.style.setProperty("--box_clr", clr);
      });
      resolve();
    });
  };

  const playRand = (musicArr: HTMLAudioElement[]) => {
    const randInd = genRandomNum(musicArr.length);
    musicArr[randInd].play();
    musicArr[randInd].onended = () => {
      musicArr[randInd].onended = null;
      playRand(musicArr);
    };
  };

  const randomizer = (
    cube: CubeEnum,
    horCubeEl: HTMLDivElement,
    vertCubeEl: HTMLDivElement,
    isClock: boolean
  ): Promise<void> => {
    return new Promise(async (resolve) => {
      if (cube === CubeEnum.r || cube === CubeEnum.l) {
        horCubeEl.classList.remove("active");
        vertCubeEl.classList.add("active");
        rotateCube(cube, isClock);
      } else {
        vertCubeEl.classList.remove("active");
        horCubeEl.classList.add("active");
        rotateCube(cube, isClock);
      }

      // await reconciler(cube, isClock);

      const timer = setTimeout(() => {
        clearTimeout(timer);
        resolve();
      }, 100);
    });
  };

  const getColor = (cubeEls: HTMLElement[], position: string): string => {
    const el = cubeEls.find((el) => el.dataset.position === position);

    if (el) {
      const color = getComputedStyle(el).getPropertyValue("--box_clr");
      return color;
    } else
      throw new Error(`No el found for the position ${position} : ${cubeEls}`);
  };

  const prepCubes = (cube: CubeEnum): CubeInt[] => {
    const leftCubeEls = leftBoxesRef.current;
    const centerCubeEls = centerBoxesRef.current;
    const rightCubeEls = rightBoxesRef.current;

    if (cube === CubeEnum.l)
      return [
        { position: "lf1", color: getColor(leftCubeEls, "lf1") },
        { position: "lf2", color: getColor(leftCubeEls, "lf2") },
        { position: "lf3", color: getColor(leftCubeEls, "lf3") },
        { position: "ld3", color: getColor(leftCubeEls, "ld3") },
        { position: "ld2", color: getColor(leftCubeEls, "ld2") },
        { position: "ld1", color: getColor(leftCubeEls, "ld1") },
        { position: "lb3", color: getColor(leftCubeEls, "lb3") },
        { position: "lb2", color: getColor(leftCubeEls, "lb2") },
        { position: "lb1", color: getColor(leftCubeEls, "lb1") },
        { position: "lu1", color: getColor(leftCubeEls, "lu1") },
        { position: "lu2", color: getColor(leftCubeEls, "lu2") },
        { position: "lu3", color: getColor(leftCubeEls, "lu3") },
        { position: "lsu3", color: getColor(leftCubeEls, "lsu3") },
        { position: "lsu2", color: getColor(leftCubeEls, "lsu2") },
        { position: "lsu1", color: getColor(leftCubeEls, "lsu1") },
        { position: "lsm3", color: getColor(leftCubeEls, "lsm3") },
        { position: "lsm2", color: getColor(leftCubeEls, "lsm2") },
        { position: "lsm1", color: getColor(leftCubeEls, "lsm1") },
        { position: "lsd3", color: getColor(leftCubeEls, "lsd3") },
        { position: "lsd2", color: getColor(leftCubeEls, "lsd2") },
        { position: "lsd1", color: getColor(leftCubeEls, "lsd1") },
      ];

    if (cube === CubeEnum.c)
      return [
        { position: "cf1", color: getColor(centerCubeEls, "cf1") },
        { position: "cf2", color: getColor(centerCubeEls, "cf2") },
        { position: "cf3", color: getColor(centerCubeEls, "cf3") },
        { position: "cd1", color: getColor(centerCubeEls, "cd1") },
        { position: "cd2", color: getColor(centerCubeEls, "cd2") },
        { position: "cd3", color: getColor(centerCubeEls, "cd3") },
        { position: "cb1", color: getColor(centerCubeEls, "cb1") },
        { position: "cb2", color: getColor(centerCubeEls, "cb2") },
        { position: "cb3", color: getColor(centerCubeEls, "cb3") },
        { position: "cu1", color: getColor(centerCubeEls, "cu1") },
        { position: "cu2", color: getColor(centerCubeEls, "cu2") },
        { position: "cu3", color: getColor(centerCubeEls, "cu3") },
      ];

    // *This default return is for CubeEnum.r

    return [
      { position: "rf1", color: getColor(rightCubeEls, "rf1") },
      { position: "rf2", color: getColor(rightCubeEls, "rf2") },
      { position: "rf3", color: getColor(rightCubeEls, "rf3") },
      { position: "rd3", color: getColor(rightCubeEls, "rd3") },
      { position: "rd2", color: getColor(rightCubeEls, "rd2") },
      { position: "rd1", color: getColor(rightCubeEls, "rd1") },
      { position: "rb3", color: getColor(rightCubeEls, "rb3") },
      { position: "rb2", color: getColor(rightCubeEls, "rb2") },
      { position: "rb1", color: getColor(rightCubeEls, "rb1") },
      { position: "ru1", color: getColor(rightCubeEls, "ru1") },
      { position: "ru2", color: getColor(rightCubeEls, "ru2") },
      { position: "ru3", color: getColor(rightCubeEls, "ru3") },
      { position: "rsu3", color: getColor(rightCubeEls, "rsu3") },
      { position: "rsu2", color: getColor(rightCubeEls, "rsu2") },
      { position: "rsu1", color: getColor(rightCubeEls, "rsu1") },
      { position: "rsm3", color: getColor(rightCubeEls, "rsm3") },
      { position: "rsm2", color: getColor(rightCubeEls, "rsm2") },
      { position: "rsm1", color: getColor(rightCubeEls, "rsm1") },
      { position: "rsd3", color: getColor(rightCubeEls, "rsd3") },
      { position: "rsd2", color: getColor(rightCubeEls, "rsd2") },
      { position: "rsd1", color: getColor(rightCubeEls, "rsd1") },
    ];
  };

  const saveGameInfo = async (isFirst: boolean = false) => {
    const uid = new ShortUniqueId({ length: 10 });

    if (playerInfo) {
      if (isFirst) {
        const id = gameInfo?.id || uid.randomUUID();
        const newGameInfo: GameInfoInt = {
          id,
          startedAt: serverTimestamp(),
          uid: playerInfo.uid,
          isDone: false,
          updatedAt: serverTimestamp(),
          duration: 0,
          moves: 0,
          cubes: {
            left: prepCubes(CubeEnum.l),
            right: prepCubes(CubeEnum.r),
            center: prepCubes(CubeEnum.c),
          },
        };

        dispatch(createGame(newGameInfo));
        setGameLoading(false);
        setIsPlay && setIsPlay(true);
        setIsChanges(false);
      } else {
        const updateInfo: Omit<GameInfoInt, "startedAt" | "isDone"> = {
          duration: durationRef.current,
          moves,
          updatedAt: serverTimestamp(),
          uid: playerInfo.uid,
          id: gameInfo?.id ?? "",
          cubes: {
            left: prepCubes(CubeEnum.l),
            right: prepCubes(CubeEnum.r),
            center: prepCubes(CubeEnum.c),
          },
        };

        dispatch(updateGame(updateInfo));
      }
      setIsChanges(false);
    }
  };

  // ? This is for reloads
  const setColor = (els: HTMLElement[], cube: CubeInt[]) => {
    cube.forEach((cb) => {
      const el = els.find((e) => e.dataset.position === cb.position);
      if (el) {
        el.style.setProperty("--box_clr", cb.color);
      } else {
        console.error(
          `This position ${cb.position} was not found in any element ${els} `
        );
      }
    });
  };

  const gameTimer = (start: boolean) => {
    const timer = setInterval(() => {
      if (!start) clearInterval(timer);
      durationRef.current = durationRef.current + 1;
      setModDuration(formatDuration(durationRef.current));

      durationRef.current &&
        !(durationRef.current % 20) &&
        isChanges &&
        saveGameInfo();
    }, 1000);

    return timer;
  };

  const resetRotate = (cubeEl: HTMLElement, rotDir: "x" | "y"): 0 => {
    cubeEl.ontransitionend = () => {
      // setIsDisableControls && setIsDisableControls(true);
      cubeEl.style.transition = "unset";
      cubeEl.style.transform =
        rotDir === "x" ? `rotateX(0deg)` : `rotateY(0deg)`;
      setTimeout(() => {
        cubeEl.style.transition = "all ease 0.5s";
        cubeEl.ontransitionend = null;
        // setIsDisableControls && setIsDisableControls(false);
      }, 600);
    };

    return 0;
  };

  const rotateCube = async (cube: CubeEnum, isClock: boolean) => {
    const rightCubeEl = rightCubeRef.current;
    const leftCubeEl = leftCubeRef.current;
    const topCubeEl = topCubeRef.current;
    const bottomCubeEl = bottomCubeRef.current;

    if (rightCubeEl && leftCubeEl && topCubeEl && bottomCubeEl) {
      switch (cube) {
        case CubeEnum.r:
          rightCubeAngle.current =
            rightCubeAngle.current + (isClock ? 90 : -90);

          rightCubeEl.style.transform = `rotateX(${rightCubeAngle.current}deg)`;

          if (rightCubeAngle.current >= 360) {
            rightCubeAngle.current = resetRotate(rightCubeEl, "x");
          }

          break;
        case CubeEnum.l:
          leftCubeAngle.current = leftCubeAngle.current + (isClock ? 90 : -90);

          leftCubeEl.style.transform = `rotateX(${leftCubeAngle.current}deg)`;

          if (leftCubeAngle.current >= 360) {
            leftCubeAngle.current = resetRotate(leftCubeEl, "x");
          }
          break;
        case CubeEnum.t:
          topCubeAngle.current = topCubeAngle.current + (isClock ? -90 : 90);

          topCubeEl.style.transform = `rotateY(${topCubeAngle.current}deg)`;

          if (topCubeAngle.current >= 360) {
            topCubeAngle.current = resetRotate(topCubeEl, "y");
          }
          break;
        case CubeEnum.b:
          bottomCubeAngle.current =
            bottomCubeAngle.current + (isClock ? -90 : 90);

          bottomCubeEl.style.transform = `rotateY(${bottomCubeAngle.current}deg)`;

          if (bottomCubeAngle.current >= 360) {
            bottomCubeAngle.current = resetRotate(bottomCubeEl, "y");
          }
          break;
        default:
          console.error("There is a bug here");
          return;
      }

      await reconciler(cube, isClock);
    }
  };

  useEffect(() => {
    if (!isContinue && pathname.includes("/nil"))
      setIsContinue && setIsContinue(true);
  }, [isContinue]);

  // ?Stop menu music
  useEffect(() => {
    const musicEls = musicRefs?.current;
    if (musicEls?.length) {
      const music1 = musicEls.find((el) => el.id === SoundIds.mus1)!;
      music1.pause();
      music1.currentTime = 0;
    }
  }, []);

  // ?Randomly select game music
  useEffect(() => {
    if (playerInfo) {
      const musicEls = musicRefs?.current;
      if (musicEls?.length) {
        playRand(musicEls);

        return () =>
          musicEls.forEach((el) => {
            el.pause();
            el.currentTime = 0;
          });
      }
    }
  }, [playerInfo]);

  // ?Set all colors to the corresponding side
  useEffect(() => {
    if (playerInfo && isFormEntry) {
      const faceEls = facesRef.current;
      const backEls = backsRef.current;
      const topEls = topsRef.current;
      const bottomEls = bottomsRef.current;
      const rightEls = rightsRef.current;
      const leftEls = leftsRef.current;

      if (
        faceEls.length &&
        backEls.length &&
        topEls.length &&
        bottomEls.length &&
        rightEls.length &&
        leftEls.length
      ) {
        (async () => {
          await Promise.all([
            colorSetter(faceEls, "white"),
            colorSetter(backEls, "yellow"),
            colorSetter(topEls, "red"),
            colorSetter(bottomEls, "orange"),
            colorSetter(rightEls, "green"),
            colorSetter(leftEls, "blue"),
          ]);

          setIsClrsSet(true);
        })();
      }

      setIsFormEntry && setIsFormEntry(false);
    }
  }, [playerInfo, isFormEntry, isNew, isContinue]);

  // ? Scramble cube
  useEffect(() => {
    const vertCubeEl = vertCubeRef.current;
    const horCubeEl = horCubeRef.current;

    if (isClrsSet && vertCubeEl && horCubeEl) {
      (async () => {
        const cubes: CubeEnum[] = [
          CubeEnum.r,
          CubeEnum.l,
          CubeEnum.t,
          CubeEnum.b,
        ];

        for (let i = 0; i < 20; i++) {
          const ind = genRandomNum(cubes.length);
          const cube = cubes[ind];
          const isClock = !!genRandomNum(2);

          await randomizer(cube, horCubeEl, vertCubeEl, isClock);
        }

        saveGameInfo(true);
      })();
    }
  }, [isClrsSet]);

  // ? Get Player info on reload
  useEffect(() => {
    if (!pathname.includes("/nil") && !isNew && !isContinue) {
      setIsReload(true);
      dispatch(getPlayer({ uid: pathname.split("/")[2] }));
    }
  }, [pathname]);

  // ? Get game info after getting player info
  useEffect(() => {
    if (fetchingPlayerSuccess && playerInfo) {
      dispatch(getGameInfo({ uid: playerInfo.uid }));
      dispatch(resetFetchingPlayerSuccess());
      dispatch(resetInitializedSuccess());
      setIsLoadingFailed(false);
    }
    if (fetchingPlayerFailed) {
      setGameLoading(false);
      setIsLoadingFailed(true);
      dispatch(resetFetchingPlayerFailed());
      dispatch(resetInitializedFailed());

      console.error(error);
    }
  }, [fetchingPlayerFailed, fetchingPlayerSuccess, playerInfo]);

  // ? Display game after all reload-fetches
  useEffect(() => {
    if (fetchingGameSuccess && gameInfo) {
      dispatch(resetFetchingGameSuccess());
    }
    if (fetchingGameFailed) {
      setGameLoading(false);
      setIsLoadingFailed(true);
      dispatch(resetFetchingGameFailed());
      console.error(error);
    }
  }, [gameInfo, fetchingGameFailed, fetchingGameSuccess]);

  useEffect(() => {
    if (isReload && gameInfo) {
      const leftBoxesEls = leftBoxesRef.current;
      const centerBoxesEls = centerBoxesRef.current;
      const rightBoxesEls = rightBoxesRef.current;
      const horiBoxesEls = [
        ...topBoxesRef.current,
        ...midBoxesRef.current,
        ...bottomBoxesRef.current,
      ];

      if (
        leftBoxesEls.length &&
        centerBoxesEls.length &&
        rightBoxesEls.length &&
        horiBoxesEls.length
      ) {
        const {
          cubes: { center, left, right },
        } = gameInfo;
        setColor(leftBoxesEls, left);
        setColor(centerBoxesEls, center);
        setColor(rightBoxesEls, right);

        reconcileColors(CubeEnum.l, leftBoxesEls, horiBoxesEls);
        reconcileColors(CubeEnum.c, centerBoxesEls, horiBoxesEls);
        reconcileColors(CubeEnum.r, rightBoxesEls, horiBoxesEls);

        durationRef.current = gameInfo.duration;
      }

      setIsReload(false);
      setGameLoading(false);
      setIsPlay && setIsPlay(true);
      setMoves(gameInfo.moves);
    }
  }, [gameInfo, isReload]);

  useEffect(() => {
    if (isPlay !== undefined) {
      const timer = gameTimer(isPlay);

      return () => clearInterval(timer);
    }
  }, [isPlay, isChanges, moves]);

  // ?Reset Game
  useEffect(() => {
    if (isReset) {
      setGameLoading(true);
      setIsPlay && setIsPlay(false);
      setMoves(0);
      durationRef.current = 0;
      setModDuration("");
    }
  }, [isReset]);

  useEffect(() => {
    const vertCubeEl = vertCubeRef.current;
    const horCubeEl = horCubeRef.current;
    if (isReset && gameLoading && horCubeEl && vertCubeEl) {
      const timer = setTimeout(() => {
        (async () => {
          const cubes: CubeEnum[] = [
            CubeEnum.r,
            CubeEnum.l,
            CubeEnum.t,
            CubeEnum.b,
          ];

          for (let i = 0; i < 20; i++) {
            const ind = genRandomNum(cubes.length);
            const cube = cubes[ind];
            const isClock = !!genRandomNum(2);

            await randomizer(cube, horCubeEl, vertCubeEl, isClock);
          }

          saveGameInfo(true);
          setIsReset && setIsReset(false);
        })();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [gameLoading, isReset]);

  return (
    <SectionTemplate id={Section.main}>
      <div className="main_wrapper">
        {!isNew && !isContinue ? (
          <>
            <div
              className={`loading_wrapper loading ${
                gameLoading ? "active" : ""
              }`}
            >
              Loading...
            </div>
            <div
              className={`loading_wrapper loading_failed ${
                isLoadingFailed ? "active" : ""
              }`}
            >
              Loading failed!
            </div>

            <nav className="navsect">
              <div className="right_side">
                <button
                  className="save_btn"
                  disabled={saving || !isChanges}
                  onClick={handleSave}
                  onPointerDown={(e) =>
                    e.currentTarget.disabled || playSfx(acceptSfx)
                  }
                >
                  <FaRegSave />
                </button>
                {/* 
                <button className="undo_btn">
                  <AiOutlineUndo />
                </button> */}

                <button
                  className="menu_btn"
                  onPointerDown={(e) =>
                    e.currentTarget.disabled || playSfx(clickSfx)
                  }
                  onClick={() =>
                    setOpenModal &&
                    setOpenModal({ key: ModalKeys.pause, state: true })
                  }
                >
                  <IoPauseOutline />
                </button>

                <div className="avi_wrapper">
                  {playerInfo && (
                    <Lazyload src={`/${playerInfo.avi}`} alt="avi" />
                  )}
                </div>
              </div>

              <div className="left_side">
                <p className="time">{modDuration}</p>
                <p className="moves">{moves}</p>
                <span className={`saving_icon ${saving ? "active" : ""}`}>
                  <FaSpinner />
                </span>
              </div>
            </nav>

            <main className={`${gameLoading || isLoadingFailed ? "hide" : ""}`}>
              <Controls
                rotateCube={rotateCube}
                setIsChanges={setIsChanges}
                setMoves={setMoves}
              />

              <div className="cube vert_cube active" ref={vertCubeRef}>
                <div className="sub_cube right_cube" ref={rightCubeRef}>
                  <div
                    className="face"
                    ref={(el) =>
                      el &&
                      !facesRef.current.some((rel) => rel === el) &&
                      facesRef.current.push(el)
                    }
                  >
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !rightBoxesRef.current.some((rel) => rel === el) &&
                        rightBoxesRef.current.push(el)
                      }
                      data-position="rf1"
                    >
                      rf1
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !rightBoxesRef.current.some((rel) => rel === el) &&
                        rightBoxesRef.current.push(el)
                      }
                      data-position="rf2"
                    >
                      rf2
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !rightBoxesRef.current.some((rel) => rel === el) &&
                        rightBoxesRef.current.push(el)
                      }
                      data-position="rf3"
                    >
                      rf3
                    </span>
                  </div>

                  <div
                    className="back"
                    ref={(el) =>
                      el &&
                      !backsRef.current.some((rel) => rel === el) &&
                      backsRef.current.push(el)
                    }
                  >
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !rightBoxesRef.current.some((rel) => rel === el) &&
                        rightBoxesRef.current.push(el)
                      }
                      data-position="rb1"
                    >
                      rb1
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !rightBoxesRef.current.some((rel) => rel === el) &&
                        rightBoxesRef.current.push(el)
                      }
                      data-position="rb2"
                    >
                      rb2
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !rightBoxesRef.current.some((rel) => rel === el) &&
                        rightBoxesRef.current.push(el)
                      }
                      data-position="rb3"
                    >
                      rb3
                    </span>
                  </div>

                  <div
                    className="top"
                    ref={(el) =>
                      el &&
                      !topsRef.current.some((rel) => rel === el) &&
                      topsRef.current.push(el)
                    }
                  >
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !rightBoxesRef.current.some((rel) => rel === el) &&
                        rightBoxesRef.current.push(el)
                      }
                      data-position="ru1"
                    >
                      ru1
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !rightBoxesRef.current.some((rel) => rel === el) &&
                        rightBoxesRef.current.push(el)
                      }
                      data-position="ru2"
                    >
                      ru2
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !rightBoxesRef.current.some((rel) => rel === el) &&
                        rightBoxesRef.current.push(el)
                      }
                      data-position="ru3"
                    >
                      ru3
                    </span>
                  </div>

                  <div
                    className="bottom"
                    ref={(el) =>
                      el &&
                      !bottomsRef.current.some((rel) => rel === el) &&
                      bottomsRef.current.push(el)
                    }
                  >
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !rightBoxesRef.current.some((rel) => rel === el) &&
                        rightBoxesRef.current.push(el)
                      }
                      data-position="rd1"
                    >
                      rd1
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !rightBoxesRef.current.some((rel) => rel === el) &&
                        rightBoxesRef.current.push(el)
                      }
                      data-position="rd2"
                    >
                      rd2
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !rightBoxesRef.current.some((rel) => rel === el) &&
                        rightBoxesRef.current.push(el)
                      }
                      data-position="rd3"
                    >
                      rd3
                    </span>
                  </div>

                  <div
                    className="right"
                    ref={(el) =>
                      el &&
                      !rightsRef.current.some((rel) => rel === el) &&
                      rightsRef.current.push(el)
                    }
                  >
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !rightBoxesRef.current.some((rel) => rel === el) &&
                        rightBoxesRef.current.push(el)
                      }
                      data-position="rsu1"
                    >
                      rsu1
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !rightBoxesRef.current.some((rel) => rel === el) &&
                        rightBoxesRef.current.push(el)
                      }
                      data-position="rsu2"
                    >
                      rsu2
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !rightBoxesRef.current.some((rel) => rel === el) &&
                        rightBoxesRef.current.push(el)
                      }
                      data-position="rsu3"
                    >
                      rsu3
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !rightBoxesRef.current.some((rel) => rel === el) &&
                        rightBoxesRef.current.push(el)
                      }
                      data-position="rsm1"
                    >
                      rsm1
                    </span>
                    <span
                      className="box center"
                      ref={(el) =>
                        el &&
                        !rightBoxesRef.current.some((rel) => rel === el) &&
                        rightBoxesRef.current.push(el)
                      }
                      data-position="rsm2"
                    >
                      rsm2
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !rightBoxesRef.current.some((rel) => rel === el) &&
                        rightBoxesRef.current.push(el)
                      }
                      data-position="rsm3"
                    >
                      rsm3
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !rightBoxesRef.current.some((rel) => rel === el) &&
                        rightBoxesRef.current.push(el)
                      }
                      data-position="rsd1"
                    >
                      rsd1
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !rightBoxesRef.current.some((rel) => rel === el) &&
                        rightBoxesRef.current.push(el)
                      }
                      data-position="rsd2"
                    >
                      rsd2
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !rightBoxesRef.current.some((rel) => rel === el) &&
                        rightBoxesRef.current.push(el)
                      }
                      data-position="rsd3"
                    >
                      rsd3
                    </span>
                  </div>
                </div>

                <div className="sub_cube center_cube" ref={centerCubeRef}>
                  <div
                    className="face"
                    ref={(el) =>
                      el &&
                      !facesRef.current.some((rel) => rel === el) &&
                      facesRef.current.push(el)
                    }
                  >
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !centerBoxesRef.current.some((rel) => rel === el) &&
                        centerBoxesRef.current.push(el)
                      }
                      data-position="cf1"
                    >
                      cf1
                    </span>
                    <span
                      className="box center"
                      ref={(el) =>
                        el &&
                        !centerBoxesRef.current.some((rel) => rel === el) &&
                        centerBoxesRef.current.push(el)
                      }
                      data-position="cf2"
                    >
                      cf2
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !centerBoxesRef.current.some((rel) => rel === el) &&
                        centerBoxesRef.current.push(el)
                      }
                      data-position="cf3"
                    >
                      cf3
                    </span>
                  </div>

                  <div
                    className="back"
                    ref={(el) =>
                      el &&
                      !backsRef.current.some((rel) => rel === el) &&
                      backsRef.current.push(el)
                    }
                  >
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !centerBoxesRef.current.some((rel) => rel === el) &&
                        centerBoxesRef.current.push(el)
                      }
                      data-position="cb1"
                    >
                      cb1
                    </span>
                    <span
                      className="box center"
                      ref={(el) =>
                        el &&
                        !centerBoxesRef.current.some((rel) => rel === el) &&
                        centerBoxesRef.current.push(el)
                      }
                      data-position="cb2"
                    >
                      cb2
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !centerBoxesRef.current.some((rel) => rel === el) &&
                        centerBoxesRef.current.push(el)
                      }
                      data-position="cb3"
                    >
                      cb3
                    </span>
                  </div>

                  <div
                    className="top"
                    ref={(el) =>
                      el &&
                      !topsRef.current.some((rel) => rel === el) &&
                      topsRef.current.push(el)
                    }
                  >
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !centerBoxesRef.current.some((rel) => rel === el) &&
                        centerBoxesRef.current.push(el)
                      }
                      data-position="cu1"
                    >
                      cu1
                    </span>
                    <span
                      className="box center"
                      ref={(el) =>
                        el &&
                        !centerBoxesRef.current.some((rel) => rel === el) &&
                        centerBoxesRef.current.push(el)
                      }
                      data-position="cu2"
                    >
                      cu2
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !centerBoxesRef.current.some((rel) => rel === el) &&
                        centerBoxesRef.current.push(el)
                      }
                      data-position="cu3"
                    >
                      cu3
                    </span>
                  </div>

                  <div
                    className="bottom"
                    ref={(el) =>
                      el &&
                      !bottomsRef.current.some((rel) => rel === el) &&
                      bottomsRef.current.push(el)
                    }
                  >
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !centerBoxesRef.current.some((rel) => rel === el) &&
                        centerBoxesRef.current.push(el)
                      }
                      data-position="cd1"
                    >
                      cd1
                    </span>
                    <span
                      className="box center"
                      ref={(el) =>
                        el &&
                        !centerBoxesRef.current.some((rel) => rel === el) &&
                        centerBoxesRef.current.push(el)
                      }
                      data-position="cd2"
                    >
                      cd2
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !centerBoxesRef.current.some((rel) => rel === el) &&
                        centerBoxesRef.current.push(el)
                      }
                      data-position="cd3"
                    >
                      cd3
                    </span>
                  </div>
                </div>

                <div className="sub_cube left_cube" ref={leftCubeRef}>
                  <div
                    className="face"
                    ref={(el) =>
                      el &&
                      !facesRef.current.some((rel) => rel === el) &&
                      facesRef.current.push(el)
                    }
                  >
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !leftBoxesRef.current.some((rel) => rel === el) &&
                        leftBoxesRef.current.push(el)
                      }
                      data-position="lf1"
                    >
                      lf1
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !leftBoxesRef.current.some((rel) => rel === el) &&
                        leftBoxesRef.current.push(el)
                      }
                      data-position="lf2"
                    >
                      lf2
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !leftBoxesRef.current.some((rel) => rel === el) &&
                        leftBoxesRef.current.push(el)
                      }
                      data-position="lf3"
                    >
                      lf3
                    </span>
                  </div>

                  <div
                    className="back"
                    ref={(el) =>
                      el &&
                      !backsRef.current.some((rel) => rel === el) &&
                      backsRef.current.push(el)
                    }
                  >
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !leftBoxesRef.current.some((rel) => rel === el) &&
                        leftBoxesRef.current.push(el)
                      }
                      data-position="lb1"
                    >
                      lb1
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !leftBoxesRef.current.some((rel) => rel === el) &&
                        leftBoxesRef.current.push(el)
                      }
                      data-position="lb2"
                    >
                      lb2
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !leftBoxesRef.current.some((rel) => rel === el) &&
                        leftBoxesRef.current.push(el)
                      }
                      data-position="lb3"
                    >
                      lb3
                    </span>
                  </div>

                  <div
                    className="top"
                    ref={(el) =>
                      el &&
                      !topsRef.current.some((rel) => rel === el) &&
                      topsRef.current.push(el)
                    }
                  >
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !leftBoxesRef.current.some((rel) => rel === el) &&
                        leftBoxesRef.current.push(el)
                      }
                      data-position="lu1"
                    >
                      lu1
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !leftBoxesRef.current.some((rel) => rel === el) &&
                        leftBoxesRef.current.push(el)
                      }
                      data-position="lu2"
                    >
                      lu2
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !leftBoxesRef.current.some((rel) => rel === el) &&
                        leftBoxesRef.current.push(el)
                      }
                      data-position="lu3"
                    >
                      lu3
                    </span>
                  </div>

                  <div
                    className="bottom"
                    ref={(el) =>
                      el &&
                      !bottomsRef.current.some((rel) => rel === el) &&
                      bottomsRef.current.push(el)
                    }
                  >
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !leftBoxesRef.current.some((rel) => rel === el) &&
                        leftBoxesRef.current.push(el)
                      }
                      data-position="ld1"
                    >
                      ld1
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !leftBoxesRef.current.some((rel) => rel === el) &&
                        leftBoxesRef.current.push(el)
                      }
                      data-position="ld2"
                    >
                      ld2
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !leftBoxesRef.current.some((rel) => rel === el) &&
                        leftBoxesRef.current.push(el)
                      }
                      data-position="ld3"
                    >
                      ld3
                    </span>
                  </div>

                  <div
                    className="left"
                    ref={(el) =>
                      el &&
                      !leftsRef.current.some((rel) => rel === el) &&
                      leftsRef.current.push(el)
                    }
                  >
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !leftBoxesRef.current.some((rel) => rel === el) &&
                        leftBoxesRef.current.push(el)
                      }
                      data-position="lsu1"
                    >
                      lsu1
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !leftBoxesRef.current.some((rel) => rel === el) &&
                        leftBoxesRef.current.push(el)
                      }
                      data-position="lsu2"
                    >
                      lsu2
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !leftBoxesRef.current.some((rel) => rel === el) &&
                        leftBoxesRef.current.push(el)
                      }
                      data-position="lsu3"
                    >
                      lsu3
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !leftBoxesRef.current.some((rel) => rel === el) &&
                        leftBoxesRef.current.push(el)
                      }
                      data-position="lsm1"
                    >
                      lsm1
                    </span>
                    <span
                      className="box center"
                      ref={(el) =>
                        el &&
                        !leftBoxesRef.current.some((rel) => rel === el) &&
                        leftBoxesRef.current.push(el)
                      }
                      data-position="lsm2"
                    >
                      lsm2
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !leftBoxesRef.current.some((rel) => rel === el) &&
                        leftBoxesRef.current.push(el)
                      }
                      data-position="lsm3"
                    >
                      lsm3
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !leftBoxesRef.current.some((rel) => rel === el) &&
                        leftBoxesRef.current.push(el)
                      }
                      data-position="lsd1"
                    >
                      lsd1
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !leftBoxesRef.current.some((rel) => rel === el) &&
                        leftBoxesRef.current.push(el)
                      }
                      data-position="lsd2"
                    >
                      lsd2
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !leftBoxesRef.current.some((rel) => rel === el) &&
                        leftBoxesRef.current.push(el)
                      }
                      data-position="lsd3"
                    >
                      lsd3
                    </span>
                  </div>
                </div>
              </div>

              <div className="cube hor_cube " ref={horCubeRef}>
                <div className="sub_cube top_cube" ref={topCubeRef}>
                  <div
                    className="top"
                    ref={(el) =>
                      el &&
                      !topsRef.current.some((rel) => rel === el) &&
                      topsRef.current.push(el)
                    }
                  >
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !topBoxesRef.current.some((rel) => rel === el) &&
                        topBoxesRef.current.push(el)
                      }
                      data-position="utl1"
                    >
                      utl1
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !topBoxesRef.current.some((rel) => rel === el) &&
                        topBoxesRef.current.push(el)
                      }
                      data-position="utc1"
                    >
                      utc1
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !topBoxesRef.current.some((rel) => rel === el) &&
                        topBoxesRef.current.push(el)
                      }
                      data-position="utr1"
                    >
                      utr1
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !topBoxesRef.current.some((rel) => rel === el) &&
                        topBoxesRef.current.push(el)
                      }
                      data-position="utl2"
                    >
                      utl2
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !topBoxesRef.current.some((rel) => rel === el) &&
                        topBoxesRef.current.push(el)
                      }
                      data-position="utc2"
                    >
                      utc2
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !topBoxesRef.current.some((rel) => rel === el) &&
                        topBoxesRef.current.push(el)
                      }
                      data-position="utr2"
                    >
                      utr2
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !topBoxesRef.current.some((rel) => rel === el) &&
                        topBoxesRef.current.push(el)
                      }
                      data-position="utl3"
                    >
                      utl3
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !topBoxesRef.current.some((rel) => rel === el) &&
                        topBoxesRef.current.push(el)
                      }
                      data-position="utc3"
                    >
                      utc3
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !topBoxesRef.current.some((rel) => rel === el) &&
                        topBoxesRef.current.push(el)
                      }
                      data-position="utr3"
                    >
                      utr3
                    </span>
                  </div>

                  <div
                    className="face"
                    ref={(el) =>
                      el &&
                      !facesRef.current.some((rel) => rel === el) &&
                      facesRef.current.push(el)
                    }
                  >
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !topBoxesRef.current.some((rel) => rel === el) &&
                        topBoxesRef.current.push(el)
                      }
                      data-position="uf1"
                    >
                      uf1
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !topBoxesRef.current.some((rel) => rel === el) &&
                        topBoxesRef.current.push(el)
                      }
                      data-position="uf2"
                    >
                      uf2
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !topBoxesRef.current.some((rel) => rel === el) &&
                        topBoxesRef.current.push(el)
                      }
                      data-position="uf3"
                    >
                      uf3
                    </span>
                  </div>

                  <div
                    className="back"
                    ref={(el) =>
                      el &&
                      !backsRef.current.some((rel) => rel === el) &&
                      backsRef.current.push(el)
                    }
                  >
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !topBoxesRef.current.some((rel) => rel === el) &&
                        topBoxesRef.current.push(el)
                      }
                      data-position="ub1"
                    >
                      ub1
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !topBoxesRef.current.some((rel) => rel === el) &&
                        topBoxesRef.current.push(el)
                      }
                      data-position="ub2"
                    >
                      ub2
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !topBoxesRef.current.some((rel) => rel === el) &&
                        topBoxesRef.current.push(el)
                      }
                      data-position="ub3"
                    >
                      ub3
                    </span>
                  </div>

                  <div
                    className="right"
                    ref={(el) =>
                      el &&
                      !rightsRef.current.some((rel) => rel === el) &&
                      rightsRef.current.push(el)
                    }
                  >
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !topBoxesRef.current.some((rel) => rel === el) &&
                        topBoxesRef.current.push(el)
                      }
                      data-position="ur1"
                    >
                      ur1
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !topBoxesRef.current.some((rel) => rel === el) &&
                        topBoxesRef.current.push(el)
                      }
                      data-position="ur2"
                    >
                      ur2
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !topBoxesRef.current.some((rel) => rel === el) &&
                        topBoxesRef.current.push(el)
                      }
                      data-position="ur3"
                    >
                      ur3
                    </span>
                  </div>

                  <div
                    className="left"
                    ref={(el) =>
                      el &&
                      !leftsRef.current.some((rel) => rel === el) &&
                      leftsRef.current.push(el)
                    }
                  >
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !topBoxesRef.current.some((rel) => rel === el) &&
                        topBoxesRef.current.push(el)
                      }
                      data-position="ul1"
                    >
                      ul1
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !topBoxesRef.current.some((rel) => rel === el) &&
                        topBoxesRef.current.push(el)
                      }
                      data-position="ul2"
                    >
                      ul2
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !topBoxesRef.current.some((rel) => rel === el) &&
                        topBoxesRef.current.push(el)
                      }
                      data-position="ul3"
                    >
                      ul3
                    </span>
                  </div>
                </div>

                <div className="sub_cube mid_cube" ref={midCubeRef}>
                  <div
                    className="face"
                    ref={(el) =>
                      el &&
                      !facesRef.current.some((rel) => rel === el) &&
                      facesRef.current.push(el)
                    }
                  >
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !midBoxesRef.current.some((rel) => rel === el) &&
                        midBoxesRef.current.push(el)
                      }
                      data-position="mf1"
                    >
                      mf1
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !midBoxesRef.current.some((rel) => rel === el) &&
                        midBoxesRef.current.push(el)
                      }
                      data-position="mf2"
                    >
                      mf2
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !midBoxesRef.current.some((rel) => rel === el) &&
                        midBoxesRef.current.push(el)
                      }
                      data-position="mf3"
                    >
                      mf3
                    </span>
                  </div>

                  <div
                    className="back"
                    ref={(el) =>
                      el &&
                      !backsRef.current.some((rel) => rel === el) &&
                      backsRef.current.push(el)
                    }
                  >
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !midBoxesRef.current.some((rel) => rel === el) &&
                        midBoxesRef.current.push(el)
                      }
                      data-position="mb1"
                    >
                      mb1
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !midBoxesRef.current.some((rel) => rel === el) &&
                        midBoxesRef.current.push(el)
                      }
                      data-position="mb2"
                    >
                      mb2
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !midBoxesRef.current.some((rel) => rel === el) &&
                        midBoxesRef.current.push(el)
                      }
                      data-position="mb3"
                    >
                      mb3
                    </span>
                  </div>

                  <div
                    className="right"
                    ref={(el) =>
                      el &&
                      !rightsRef.current.some((rel) => rel === el) &&
                      rightsRef.current.push(el)
                    }
                  >
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !midBoxesRef.current.some((rel) => rel === el) &&
                        midBoxesRef.current.push(el)
                      }
                      data-position="mr1"
                    >
                      mr1
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !midBoxesRef.current.some((rel) => rel === el) &&
                        midBoxesRef.current.push(el)
                      }
                      data-position="mr2"
                    >
                      mr2
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !midBoxesRef.current.some((rel) => rel === el) &&
                        midBoxesRef.current.push(el)
                      }
                      data-position="mr3"
                    >
                      mr3
                    </span>
                  </div>

                  <div
                    className="left"
                    ref={(el) =>
                      el &&
                      !leftsRef.current.some((rel) => rel === el) &&
                      leftsRef.current.push(el)
                    }
                  >
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !midBoxesRef.current.some((rel) => rel === el) &&
                        midBoxesRef.current.push(el)
                      }
                      data-position="ml1"
                    >
                      ml1
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !midBoxesRef.current.some((rel) => rel === el) &&
                        midBoxesRef.current.push(el)
                      }
                      data-position="ml2"
                    >
                      ml2
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !midBoxesRef.current.some((rel) => rel === el) &&
                        midBoxesRef.current.push(el)
                      }
                      data-position="ml3"
                    >
                      ml3
                    </span>
                  </div>
                </div>

                <div className="sub_cube bottom_cube" ref={bottomCubeRef}>
                  <div
                    className="bottom"
                    ref={(el) =>
                      el &&
                      !bottomsRef.current.some((rel) => rel === el) &&
                      bottomsRef.current.push(el)
                    }
                  >
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !bottomBoxesRef.current.some((rel) => rel === el) &&
                        bottomBoxesRef.current.push(el)
                      }
                      data-position="dbl1"
                    >
                      dbl1
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !bottomBoxesRef.current.some((rel) => rel === el) &&
                        bottomBoxesRef.current.push(el)
                      }
                      data-position="dbc1"
                    >
                      dbc1
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !bottomBoxesRef.current.some((rel) => rel === el) &&
                        bottomBoxesRef.current.push(el)
                      }
                      data-position="dbr1"
                    >
                      dbr1
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !bottomBoxesRef.current.some((rel) => rel === el) &&
                        bottomBoxesRef.current.push(el)
                      }
                      data-position="dbl2"
                    >
                      dbl2
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !bottomBoxesRef.current.some((rel) => rel === el) &&
                        bottomBoxesRef.current.push(el)
                      }
                      data-position="dbc2"
                    >
                      dbc2
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !bottomBoxesRef.current.some((rel) => rel === el) &&
                        bottomBoxesRef.current.push(el)
                      }
                      data-position="dbr2"
                    >
                      dbr2
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !bottomBoxesRef.current.some((rel) => rel === el) &&
                        bottomBoxesRef.current.push(el)
                      }
                      data-position="dbl3"
                    >
                      dbl3
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !bottomBoxesRef.current.some((rel) => rel === el) &&
                        bottomBoxesRef.current.push(el)
                      }
                      data-position="dbc3"
                    >
                      dbc3
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !bottomBoxesRef.current.some((rel) => rel === el) &&
                        bottomBoxesRef.current.push(el)
                      }
                      data-position="dbr3"
                    >
                      dbr3
                    </span>
                  </div>

                  <div
                    className="face"
                    ref={(el) =>
                      el &&
                      !facesRef.current.some((rel) => rel === el) &&
                      facesRef.current.push(el)
                    }
                  >
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !bottomBoxesRef.current.some((rel) => rel === el) &&
                        bottomBoxesRef.current.push(el)
                      }
                      data-position="df1"
                    >
                      df1
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !bottomBoxesRef.current.some((rel) => rel === el) &&
                        bottomBoxesRef.current.push(el)
                      }
                      data-position="df2"
                    >
                      df2
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !bottomBoxesRef.current.some((rel) => rel === el) &&
                        bottomBoxesRef.current.push(el)
                      }
                      data-position="df3"
                    >
                      df3
                    </span>
                  </div>

                  <div
                    className="back"
                    ref={(el) =>
                      el &&
                      !backsRef.current.some((rel) => rel === el) &&
                      backsRef.current.push(el)
                    }
                  >
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !bottomBoxesRef.current.some((rel) => rel === el) &&
                        bottomBoxesRef.current.push(el)
                      }
                      data-position="db1"
                    >
                      db1
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !bottomBoxesRef.current.some((rel) => rel === el) &&
                        bottomBoxesRef.current.push(el)
                      }
                      data-position="db2"
                    >
                      db2
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !bottomBoxesRef.current.some((rel) => rel === el) &&
                        bottomBoxesRef.current.push(el)
                      }
                      data-position="db3"
                    >
                      db3
                    </span>
                  </div>

                  <div
                    className="right"
                    ref={(el) =>
                      el &&
                      !rightsRef.current.some((rel) => rel === el) &&
                      rightsRef.current.push(el)
                    }
                  >
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !bottomBoxesRef.current.some((rel) => rel === el) &&
                        bottomBoxesRef.current.push(el)
                      }
                      data-position="dr1"
                    >
                      dr1
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !bottomBoxesRef.current.some((rel) => rel === el) &&
                        bottomBoxesRef.current.push(el)
                      }
                      data-position="dr2"
                    >
                      dr2
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !bottomBoxesRef.current.some((rel) => rel === el) &&
                        bottomBoxesRef.current.push(el)
                      }
                      data-position="dr3"
                    >
                      dr3
                    </span>
                  </div>

                  <div
                    className="left"
                    ref={(el) =>
                      el &&
                      !leftsRef.current.some((rel) => rel === el) &&
                      leftsRef.current.push(el)
                    }
                  >
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !bottomBoxesRef.current.some((rel) => rel === el) &&
                        bottomBoxesRef.current.push(el)
                      }
                      data-position="dl1"
                    >
                      dl1
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !bottomBoxesRef.current.some((rel) => rel === el) &&
                        bottomBoxesRef.current.push(el)
                      }
                      data-position="dl2"
                    >
                      dl2
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !bottomBoxesRef.current.some((rel) => rel === el) &&
                        bottomBoxesRef.current.push(el)
                      }
                      data-position="dl3"
                    >
                      dl3
                    </span>
                  </div>
                </div>
              </div>
            </main>
          </>
        ) : (
          <GameForm />
        )}
      </div>
    </SectionTemplate>
  );
};

const GameForm = () => {
  const { setOpenModal, isNew, isContinue } = useCubeContext();
  // const { pathname } = useLocation();

  useEffect(() => {
    if (isNew || isContinue) {
      setOpenModal && setOpenModal({ state: true, key: ModalKeys.start });
    }
  }, [isNew, isContinue]);
  return <></>;
};

export default MainGame;
