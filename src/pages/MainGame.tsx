import SectionTemplate from "../templates/SectionTemplate";
import { CubeInt, GameInfoInt, ModalKeys, Section, SoundIds } from "../types";
import { useEffect, useRef, useState } from "react";
import { useCubeDispatch, useCubeSelector } from "../app/store";
import { useCubeContext } from "../contexts/cubeContext";
import { AiOutlineUndo } from "react-icons/ai";
import { FaRegSave } from "react-icons/fa";
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

// todo setup isChrome functionality for firstEntry
// *For testing purposes, we will show position

enum CubeEnum {
  r = "right",
  l = "left",
  c = "center",
  t = "top",
  b = "bottom",
}

// *Finally implemented fetchings for reloads
// todo Reflect fetched gameInfo in the cubes

const MainGame = () => {
  const {
    playerInfo,
    saving,
    savingFailed,
    savingSuccess,
    error,
    fetchingGameFailed,
    fetchingGameSuccess,
    fetchingPlayerFailed,
    fetchingPlayerSuccess,
    gameInfo,
  } = useCubeSelector((state) => state.cube);
  const {
    musicRefs,
    isChrome,
    isNew,
    isContinue,
    isFormEntry,
    setIsContinue,
    setIsFormEntry,
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
  const [gameId, setGameId] = useState("");
  const durationRef = useRef(0);
  const movesRef = useRef(0);
  const dispatch = useCubeDispatch();
  const {
    resetSavingFailed,
    resetSavingSuccess,
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
  const [isPlay, setIsPlay] = useState(false);
  const [modDuration, setModDuration] = useState("");

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
    isClock: boolean,
    rightCubeEl: HTMLDivElement,
    leftCubeEl: HTMLDivElement,
    topCubeEl: HTMLDivElement,
    bottomCubeEl: HTMLDivElement
  ): Promise<void> => {
    return new Promise(async (resolve) => {
      if (cube === CubeEnum.r || cube === CubeEnum.l) {
        horCubeEl.classList.remove("active");
        vertCubeEl.classList.add("active");

        switch (cube) {
          case CubeEnum.r:
            rightCubeAngle.current =
              rightCubeAngle.current + (isClock ? 90 : -90);
            rightCubeAngle.current =
              Math.abs(rightCubeAngle.current) >= 360
                ? 0
                : rightCubeAngle.current;
            console.log("r: ", rightCubeAngle.current);

            rightCubeEl.style.transform = `rotateX(${rightCubeAngle.current}deg)`;
            break;
          case CubeEnum.l:
            leftCubeAngle.current =
              leftCubeAngle.current + (isClock ? 90 : -90);
            leftCubeAngle.current =
              Math.abs(leftCubeAngle.current) >= 360
                ? 0
                : leftCubeAngle.current;
            console.log("l: ", leftCubeAngle.current);

            leftCubeEl.style.transform = `rotateX(${leftCubeAngle.current}deg)`;
            break;
          default:
            console.error("There is a bug here");
            return;
        }
      } else {
        vertCubeEl.classList.remove("active");
        horCubeEl.classList.add("active");

        switch (cube) {
          case CubeEnum.t:
            topCubeAngle.current = topCubeAngle.current + (isClock ? -90 : 90);
            topCubeAngle.current =
              Math.abs(topCubeAngle.current) >= 360 ? 0 : topCubeAngle.current;
            console.log("t: ", topCubeAngle.current);

            topCubeEl.style.transform = `rotateY(${topCubeAngle.current}deg)`;
            break;
          case CubeEnum.b:
            bottomCubeAngle.current =
              bottomCubeAngle.current + (isClock ? -90 : 90);
            bottomCubeAngle.current =
              Math.abs(bottomCubeAngle.current) >= 360
                ? 0
                : bottomCubeAngle.current;
            console.log("b: ", bottomCubeAngle.current);

            bottomCubeEl.style.transform = `rotateY(${bottomCubeAngle.current}deg)`;
            break;
          default:
            console.error("There is a bug here");
            return;
        }
      }

      await reconciler(cube, isClock);

      const timer = setTimeout(() => {
        clearTimeout(timer);
        resolve();
      }, 100);
    });
  };

  const updatePosition = (el: HTMLElement, newPos: string) => {
    // ? I inclulde textcontent to make debuggin easy. May remove when done
    el.dataset.position = newPos;
    el.textContent = newPos;
  };

  const updateColor = (
    els: HTMLElement[],
    updateEl: HTMLElement,
    pos: string
  ) => {
    const el = els.find((el) => el.dataset.position === pos);

    if (el) {
      const color = getComputedStyle(el, "before").backgroundColor;
      updateEl.style.setProperty("--box_clr", color);
    } else {
      console.error("There is no element with the position: ", pos);

      console.log("Elements for the above error ", els);
    }
  };

  const getColor = (cubeEls: HTMLElement[], position: string): string => {
    const el = cubeEls.find((el) => el.dataset.position === position);

    if (el) {
      const color = getComputedStyle(el, "before").backgroundColor;
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

  const saveGameInfo = async (isFirst: boolean) => {
    const uid = new ShortUniqueId({ length: 10 });

    if (playerInfo) {
      if (isFirst) {
        const id = uid.randomUUID();
        setGameId(id);
        const gameInfo: GameInfoInt = {
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

        dispatch(createGame(gameInfo));
        setGameLoading(false);
        setIsPlay(true);
      } else {
        const updateInfo: Omit<GameInfoInt, "startedAt" | "isDone"> = {
          duration: durationRef.current,
          moves: movesRef.current,
          updatedAt: serverTimestamp(),
          uid: playerInfo.uid,
          id: gameId,
          cubes: {
            left: prepCubes(CubeEnum.l),
            right: prepCubes(CubeEnum.r),
            center: prepCubes(CubeEnum.c),
          },
        };

        dispatch(updateGame(updateInfo));
      }
    }
  };

  const reconcileColors = (
    cube: CubeEnum,
    templateCubeEls: HTMLElement[],
    modCubeEls: HTMLElement[]
  ) => {
    // ? cube=> The cube that is the model
    // ? templateCubeEls the elements in the model cube
    // ? modCubeEls The cubeEls to be modified or reconciled to the model
    switch (cube) {
      case CubeEnum.l:
        modCubeEls.forEach((el) => {
          const position = el.dataset.position;

          switch (position) {
            case "utl1":
              updateColor(templateCubeEls, el, "lu1");
              break;
            case "utl2":
              updateColor(templateCubeEls, el, "lu2");
              break;
            case "utl3":
              updateColor(templateCubeEls, el, "lu3");
              break;
            case "uf1":
              updateColor(templateCubeEls, el, "lf1");
              break;
            case "mf1":
              updateColor(templateCubeEls, el, "lf2");
              break;
            case "df1":
              updateColor(templateCubeEls, el, "lf3");
              break;
            case "ul3":
              updateColor(templateCubeEls, el, "lsu3");
              break;
            case "ul2":
              updateColor(templateCubeEls, el, "lsu2");
              break;
            case "ul1":
              updateColor(templateCubeEls, el, "lsu1");
              break;
            case "ml3":
              updateColor(templateCubeEls, el, "lsm3");
              break;
            case "ml2":
              console.log(position, " = ml2 is fixed");
              break;
            case "ml1":
              updateColor(templateCubeEls, el, "lsm1");
              break;
            case "dl3":
              updateColor(templateCubeEls, el, "lsd3");
              break;
            case "dl2":
              updateColor(templateCubeEls, el, "lsd2");
              break;
            case "dl1":
              updateColor(templateCubeEls, el, "lsd1");
              break;
            case "dbl3":
              updateColor(templateCubeEls, el, "ld3");
              break;
            case "dbl2":
              updateColor(templateCubeEls, el, "ld2");
              break;
            case "dbl1":
              updateColor(templateCubeEls, el, "ld1");
              break;
            case "ub1":
              updateColor(templateCubeEls, el, "lb1");
              break;
            case "mb1":
              updateColor(templateCubeEls, el, "lb2");
              break;
            case "db1":
              updateColor(templateCubeEls, el, "lb3");
              break;
            default:
              return;
          }
        });

        break;
      case CubeEnum.r:
        modCubeEls.forEach((el) => {
          const position = el.dataset.position;

          switch (position) {
            case "utr1":
              updateColor(templateCubeEls, el, "ru1");
              break;
            case "utr2":
              updateColor(templateCubeEls, el, "ru2");
              break;
            case "utr3":
              updateColor(templateCubeEls, el, "ru3");
              break;
            case "uf3":
              updateColor(templateCubeEls, el, "rf1");
              break;
            case "mf3":
              updateColor(templateCubeEls, el, "rf2");
              break;
            case "df3":
              updateColor(templateCubeEls, el, "rf3");
              break;
            case "dbr3":
              updateColor(templateCubeEls, el, "rd3");
              break;
            case "dbr2":
              updateColor(templateCubeEls, el, "rd2");
              break;
            case "dbr1":
              updateColor(templateCubeEls, el, "rd1");
              break;
            case "ub3":
              updateColor(templateCubeEls, el, "rb1");
              break;
            case "mb3":
              updateColor(templateCubeEls, el, "rb2");
              break;
            case "db3":
              updateColor(templateCubeEls, el, "rb3");
              break;
            case "ur1":
              updateColor(templateCubeEls, el, "rsu1");
              break;
            case "ur2":
              updateColor(templateCubeEls, el, "rsu2");
              break;
            case "ur3":
              updateColor(templateCubeEls, el, "rsu3");
              break;
            case "mr1":
              updateColor(templateCubeEls, el, "rsm1");
              break;
            case "mr2":
              console.log(position, " = mr2 is fixed");
              break;
            case "mr3":
              updateColor(templateCubeEls, el, "rsm3");
              break;
            case "dr1":
              updateColor(templateCubeEls, el, "rsd1");
              break;
            case "dr2":
              updateColor(templateCubeEls, el, "rsd2");
              break;
            case "rd3":
              updateColor(templateCubeEls, el, "rsd3");
              break;
            default:
              return;
          }
        });
        break;
      case CubeEnum.c:
        modCubeEls.forEach((el) => {
          const position = el.dataset.position;

          switch (position) {
            case "utc1":
              updateColor(templateCubeEls, el, "cu1");
              break;
            case "utc2":
              updateColor(templateCubeEls, el, "cu2");
              break;
            case "utc3":
              updateColor(templateCubeEls, el, "cu3");
              break;
            case "uf2":
              updateColor(templateCubeEls, el, "cf1");
              break;
            case "mf2":
              updateColor(templateCubeEls, el, "cf2");
              break;
            case "df2":
              updateColor(templateCubeEls, el, "cf3");
              break;
            case "dbc3":
              updateColor(templateCubeEls, el, "cd3");
              break;
            case "dbc2":
              updateColor(templateCubeEls, el, "cd2");
              break;
            case "dbc1":
              updateColor(templateCubeEls, el, "cd1");
              break;
            case "ub2":
              updateColor(templateCubeEls, el, "cb1");
              break;
            case "mb2":
              updateColor(templateCubeEls, el, "cb2");
              break;
            case "db2":
              updateColor(templateCubeEls, el, "cd3");
              break;
            default:
              return;
          }
        });
        break;
      case CubeEnum.t:
        modCubeEls.forEach((el) => {
          const position = el.dataset.position;

          switch (position) {
            case "lu1":
              updateColor(templateCubeEls, el, "utl1");
              break;
            case "lu2":
              updateColor(templateCubeEls, el, "utl2");
              break;
            case "lu3":
              updateColor(templateCubeEls, el, "utl3");
              break;
            case "cu1":
              updateColor(templateCubeEls, el, "utc1");
              break;
            case "cu2":
              console.log(position, " = cu2 is fixed");
              break;
            case "cu3":
              updateColor(templateCubeEls, el, "utc3");
              break;
            case "ru1":
              updateColor(templateCubeEls, el, "utr1");
              break;
            case "ru2":
              updateColor(templateCubeEls, el, "utr2");
              break;
            case "ru3":
              updateColor(templateCubeEls, el, "utr3");
              break;
            case "lf1":
              updateColor(templateCubeEls, el, "uf1");
              break;
            case "cf1":
              updateColor(templateCubeEls, el, "uf2");
              break;
            case "rf1":
              updateColor(templateCubeEls, el, "uf3");
              break;
            case "rsu1":
              updateColor(templateCubeEls, el, "ur1");
              break;
            case "rsu2":
              updateColor(templateCubeEls, el, "ur2");
              break;
            case "rsu3":
              updateColor(templateCubeEls, el, "ur3");
              break;
            case "rb1":
              updateColor(templateCubeEls, el, "ub3");
              break;
            case "cb1":
              updateColor(templateCubeEls, el, "ub2");
              break;
            case "lb1":
              updateColor(templateCubeEls, el, "ub1");
              break;
            case "lsu3":
              updateColor(templateCubeEls, el, "ul3");
              break;
            case "lsu2":
              updateColor(templateCubeEls, el, "ul2");
              break;
            case "lsu1":
              updateColor(templateCubeEls, el, "ul1");
              break;
            default:
              return;
          }
        });
        break;
      case CubeEnum.b:
        modCubeEls.forEach((el) => {
          const position = el.dataset.position;

          switch (position) {
            case "ld1":
              updateColor(templateCubeEls, el, "dbl1");
              break;
            case "ld2":
              updateColor(templateCubeEls, el, "dbl2");
              break;
            case "ld3":
              updateColor(templateCubeEls, el, "dbl3");
              break;
            case "cd1":
              updateColor(templateCubeEls, el, "dbc1");
              break;
            case "cd2":
              console.log("cd2 is fixed");
              break;
            case "cd3":
              updateColor(templateCubeEls, el, "dbc3");
              break;
            case "rd1":
              updateColor(templateCubeEls, el, "dbr1");
              break;
            case "rd2":
              updateColor(templateCubeEls, el, "dbr2");
              break;
            case "rd3":
              updateColor(templateCubeEls, el, "dbr3");
              break;
            case "lf3":
              updateColor(templateCubeEls, el, "df1");
              break;
            case "cf3":
              updateColor(templateCubeEls, el, "df2");
              break;
            case "rf3":
              updateColor(templateCubeEls, el, "df3");
              break;
            case "rsd1":
              updateColor(templateCubeEls, el, "dr1");
              break;
            case "rsd2":
              updateColor(templateCubeEls, el, "dr2");
              break;
            case "rsd3":
              updateColor(templateCubeEls, el, "dr3");
              break;
            case "rb3":
              updateColor(templateCubeEls, el, "db3");
              break;
            case "cb3":
              updateColor(templateCubeEls, el, "db2");
              break;
            case "lb3":
              updateColor(templateCubeEls, el, "db1");
              break;
            case "lsd3":
              updateColor(templateCubeEls, el, "dl3");
              break;
            case "lsd2":
              updateColor(templateCubeEls, el, "dl2");
              break;
            case "lsd1":
              updateColor(templateCubeEls, el, "dl1");
              break;
            default:
              return;
          }
        });
        break;
      default:
        console.error("There is a bug here");
        return;
    }
  };

  // *Reconciles all rotations
  const reconciler = (cube: CubeEnum, isClock: boolean): Promise<void> => {
    return new Promise((resolve) => {
      const rightBoxesEls = rightBoxesRef.current;
      const leftBoxesEls = leftBoxesRef.current;
      const centerBoxesEls = centerBoxesRef.current;
      const topBoxesEls = topBoxesRef.current;
      const midBoxesEls = midBoxesRef.current;
      const bottomBoxesEls = bottomBoxesRef.current;

      if (
        rightBoxesEls &&
        leftBoxesEls &&
        centerBoxesEls &&
        topBoxesEls &&
        midBoxesEls &&
        bottomBoxesEls
      ) {
        // ? Change Positions
        switch (cube) {
          case CubeEnum.l:
            leftBoxesEls.forEach((el) => {
              const position = el.dataset.position;
              console.log({ position, el, cube });

              switch (position) {
                case "lf1":
                  updatePosition(el, isClock ? "lu1" : "ld3");
                  break;
                case "lf2":
                  updatePosition(el, isClock ? "lu2" : "ld2");
                  break;
                case "lf3":
                  updatePosition(el, isClock ? "lu3" : "ld1");
                  break;
                case "ld3":
                  updatePosition(el, isClock ? "lf1" : "lb3");
                  break;
                case "ld2":
                  updatePosition(el, isClock ? "lf2" : "lb2");
                  break;
                case "ld1":
                  updatePosition(el, isClock ? "lf3" : "lb1");
                  break;
                case "lb3":
                  updatePosition(el, isClock ? "ld3" : "lu1");
                  break;
                case "lb2":
                  updatePosition(el, isClock ? "ld2" : "lu2");
                  break;
                case "lb1":
                  updatePosition(el, isClock ? "ld1" : "lu3");
                  break;
                case "lu1":
                  updatePosition(el, isClock ? "lb3" : "lf1");
                  break;
                case "lu2":
                  updatePosition(el, isClock ? "lb2" : "lf2");
                  break;
                case "lu3":
                  updatePosition(el, isClock ? "lb1" : "lf3");
                  break;
                case "lsu1":
                  updatePosition(el, isClock ? "lsu3" : "lsd1");
                  break;
                case "lsu2":
                  updatePosition(el, isClock ? "lsm3" : "lsm1");
                  break;
                case "lsu3":
                  updatePosition(el, isClock ? "lsd3" : "lsu1");
                  break;
                case "lsm1":
                  updatePosition(el, isClock ? "lsu2" : "lsd2");
                  break;
                case "lsm2":
                  console.log("lsm2 is fixed");
                  break;
                case "lsm3":
                  updatePosition(el, isClock ? "lsd2" : "lsu2");
                  break;
                case "lsd1":
                  updatePosition(el, isClock ? "lsu1" : "lsd3");
                  break;
                case "lsd2":
                  updatePosition(el, isClock ? "lsm1" : "lsm3");
                  break;
                case "lsd3":
                  updatePosition(el, isClock ? "lsd1" : "lsu3");
                  break;
                default:
                  console.error("There is a bug here: ", position);
                  return;
              }
            });
            break;
          case CubeEnum.r:
            rightBoxesEls.forEach((el) => {
              const position = el.dataset.position;
              console.log({ position, el, cube });

              switch (position) {
                case "rf1":
                  updatePosition(el, isClock ? "ru1" : "rd3");
                  break;
                case "rf2":
                  updatePosition(el, isClock ? "ru2" : "rd2");
                  break;
                case "rf3":
                  updatePosition(el, isClock ? "ru3" : "rd1");
                  break;
                case "rd3":
                  updatePosition(el, isClock ? "rf1" : "rb3");
                  break;
                case "rd2":
                  updatePosition(el, isClock ? "rf2" : "rb2");
                  break;
                case "rd1":
                  updatePosition(el, isClock ? "rf3" : "rb1");
                  break;
                case "rb3":
                  updatePosition(el, isClock ? "rd3" : "ru1");
                  break;
                case "rb2":
                  updatePosition(el, isClock ? "rd2" : "ru2");
                  break;
                case "rb1":
                  updatePosition(el, isClock ? "rd1" : "ru3");
                  break;
                case "ru1":
                  updatePosition(el, isClock ? "rb3" : "rf1");
                  break;
                case "ru2":
                  updatePosition(el, isClock ? "rb2" : "rf2");
                  break;
                case "ru3":
                  updatePosition(el, isClock ? "rb1" : "rf3");
                  break;
                case "rsu1":
                  updatePosition(el, isClock ? "rsu3" : "rsd1");
                  break;
                case "rsu2":
                  updatePosition(el, isClock ? "rsm3" : "rsm1");
                  break;
                case "rsu3":
                  updatePosition(el, isClock ? "rsd3" : "rsu1");
                  break;
                case "rsm1":
                  updatePosition(el, isClock ? "rsu2" : "rsd2");
                  break;
                case "rsm2":
                  console.log(position, " = rsm2 is fixed");
                  break;
                case "rsm3":
                  updatePosition(el, isClock ? "rsd2" : "rsu2");
                  break;
                case "rsd1":
                  updatePosition(el, isClock ? "rsu1" : "rsd3");
                  break;
                case "rsd2":
                  updatePosition(el, isClock ? "rsm1" : "rsm3");
                  break;
                case "rsd3":
                  updatePosition(el, isClock ? "rsd1" : "rsu3");
                  break;
                default:
                  console.error("There is a bug here: ", position);
                  return;
              }
            });
            break;
          case CubeEnum.c:
            break;
          case CubeEnum.t:
            topBoxesEls.forEach((el) => {
              const position = el.dataset.position;
              console.log({ position, el, cube });

              switch (position) {
                case "utl1":
                  updatePosition(el, isClock ? "utr1" : "utl3");
                  break;
                case "utc1":
                  updatePosition(el, isClock ? "utr2" : "utl2");
                  break;
                case "utr1":
                  updatePosition(el, isClock ? "utr3" : "utl1");
                  break;
                case "utl2":
                  updatePosition(el, isClock ? "utc1" : "utc3");
                  break;
                case "utc2":
                  console.log(position, " = utc2 is fixed");
                  break;
                case "utr2":
                  updatePosition(el, isClock ? "utc3" : "utc1");
                  break;
                case "utl3":
                  updatePosition(el, isClock ? "utl1" : "utr3");
                  break;
                case "utc3":
                  updatePosition(el, isClock ? "utl2" : "utr2");
                  break;
                case "utr3":
                  updatePosition(el, isClock ? "utl3" : "utr1");
                  break;
                case "uf1":
                  updatePosition(el, isClock ? "ul3" : "ur1");
                  break;
                case "uf2":
                  updatePosition(el, isClock ? "ul2" : "ur2");
                  break;
                case "uf3":
                  updatePosition(el, isClock ? "ul1" : "ur3");
                  break;
                case "ur1":
                  updatePosition(el, isClock ? "uf1" : "ub3");
                  break;
                case "ur2":
                  updatePosition(el, isClock ? "uf2" : "ub2");
                  break;
                case "ur3":
                  updatePosition(el, isClock ? "uf3" : "ub1");
                  break;
                case "ub1":
                  updatePosition(el, isClock ? "ur3" : "ul1");
                  break;
                case "ub2":
                  updatePosition(el, isClock ? "ur2" : "ul2");
                  break;
                case "ub3":
                  updatePosition(el, isClock ? "ur1" : "ul3");
                  break;
                case "ul1":
                  updatePosition(el, isClock ? "ub1" : "uf3");
                  break;
                case "ul2":
                  updatePosition(el, isClock ? "ub2" : "uf2");
                  break;
                case "ul3":
                  updatePosition(el, isClock ? "ub3" : "uf1");
                  break;
                default:
                  console.error("There is a bug here");
                  return;
              }
            });
            break;
          case CubeEnum.b:
            bottomBoxesEls.forEach((el) => {
              const position = el.dataset.position;
              console.log({ position, el, cube });

              switch (position) {
                case "dbl1":
                  updatePosition(el, isClock ? "dbr1" : "dbl3");
                  break;
                case "dbc1":
                  updatePosition(el, isClock ? "dbr2" : "dbl2");
                  break;
                case "dbr1":
                  updatePosition(el, isClock ? "dbr3" : "dbl1");
                  break;
                case "dbl2":
                  updatePosition(el, isClock ? "dbc1" : "dbc3");
                  break;
                case "dbc2":
                  console.log("dbc2 is fixed");
                  break;
                case "dbr2":
                  updatePosition(el, isClock ? "dbc3" : "dbc1");
                  break;
                case "dbl3":
                  updatePosition(el, isClock ? "dbl1" : "dbr3");
                  break;
                case "dbc3":
                  updatePosition(el, isClock ? "dbl2" : "dbr2");
                  break;
                case "dbr3":
                  updatePosition(el, isClock ? "dbl3" : "dbr1");
                  break;
                case "df1":
                  updatePosition(el, isClock ? "dl3" : "dr1");
                  break;
                case "df2":
                  updatePosition(el, isClock ? "dl2" : "dr2");
                  break;
                case "df3":
                  updatePosition(el, isClock ? "dl1" : "dr3");
                  break;
                case "dr1":
                  updatePosition(el, isClock ? "df1" : "db3");
                  break;
                case "dr2":
                  updatePosition(el, isClock ? "df2" : "db2");
                  break;
                case "dr3":
                  updatePosition(el, isClock ? "df3" : "db1");
                  break;
                case "db1":
                  updatePosition(el, isClock ? "dr3" : "dl1");
                  break;
                case "db2":
                  updatePosition(el, isClock ? "dr2" : "dl2");
                  break;
                case "db3":
                  updatePosition(el, isClock ? "dr1" : "dl3");
                  break;
                case "dl1":
                  updatePosition(el, isClock ? "db1" : "df3");
                  break;
                case "dl2":
                  updatePosition(el, isClock ? "db2" : "df2");
                  break;
                case "dl3":
                  updatePosition(el, isClock ? "db3" : "df1");
                  break;
                default:
                  console.error("There is a bug here: ", position);
                  return;
              }
            });
            break;
          default:
            console.error("There is a bug here");
            return;
        }

        // ? Reconcile colors between vert and hori cubes
        const horiBoxesEls = [
          ...topBoxesEls,
          ...midBoxesEls,
          ...bottomBoxesEls,
        ];
        const vertBoxesEls = [
          ...rightBoxesEls,
          ...centerBoxesEls,
          ...leftBoxesEls,
        ];

        switch (cube) {
          case CubeEnum.l:
            // *Temp boxes is the els that are the model els
            const tempLeftBoxesEls = [...leftBoxesEls];
            reconcileColors(CubeEnum.l, tempLeftBoxesEls, horiBoxesEls);
            break;
          case CubeEnum.r:
            const tempRightBoxesEls = [...rightBoxesEls];
            reconcileColors(CubeEnum.r, tempRightBoxesEls, horiBoxesEls);
            break;
          case CubeEnum.c:
            const tempCenterBoxesEls = [...centerBoxesEls];
            reconcileColors(CubeEnum.c, tempCenterBoxesEls, horiBoxesEls);
            break;
          case CubeEnum.t:
            const tempTopBoxesEls = [...topBoxesEls];
            reconcileColors(CubeEnum.t, tempTopBoxesEls, vertBoxesEls);
            break;
          case CubeEnum.b:
            const tempBottomBoxesEls = [...bottomBoxesEls];
            reconcileColors(CubeEnum.b, tempBottomBoxesEls, vertBoxesEls);
            break;
          default:
            console.error("There is a bug here");
            return;
        }
      }

      resolve();
    });
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

  const gameTimer = (start: boolean = true) => {
    const timer = setInterval(() => {
      if (!start) clearInterval(timer);
      durationRef.current = durationRef.current + 1;
      setModDuration(formatDuration(durationRef.current));
    }, 1000);
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
    const rightCubeEl = rightCubeRef.current;
    const leftCubeEl = leftCubeRef.current;
    const centerCubeEl = centerCubeRef.current;
    const topCubeEl = topCubeRef.current;
    const midCubeEl = midCubeRef.current;
    const bottomCubeEl = bottomCubeRef.current;
    if (
      isClrsSet &&
      vertCubeEl &&
      horCubeEl &&
      rightCubeEl &&
      leftCubeEl &&
      centerCubeEl &&
      topCubeEl &&
      midCubeEl &&
      bottomCubeEl
    ) {
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

          await randomizer(
            cube,
            horCubeEl,
            vertCubeEl,
            isClock,
            rightCubeEl,
            leftCubeEl,
            topCubeEl,
            bottomCubeEl
          );
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
      setIsPlay(true);
    }
  }, [gameInfo, isReload]);

  useEffect(() => {
    if (isPlay) {
      gameTimer();
    }
  }, [isPlay]);

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
                <button className="save_btn">
                  <FaRegSave />
                </button>

                <button className="undo_btn">
                  <AiOutlineUndo />
                </button>

                <button className="menu_btn">
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
              </div>
            </nav>

            <main className={`${gameLoading || isLoadingFailed ? "hide" : ""}`}>
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
