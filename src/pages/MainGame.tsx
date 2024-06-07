import SectionTemplate from "../templates/SectionTemplate";
import { ModalKeys, Section, SoundIds } from "../types";
import { useEffect, useRef, useState } from "react";
import { useCubeSelector } from "../app/store";
import { useCubeContext } from "../contexts/cubeContext";
import { AiOutlineUndo } from "react-icons/ai";
import { FaRegSave } from "react-icons/fa";
import Lazyload from "../components/Lazyload";
import { IoPauseOutline } from "react-icons/io5";
import { genRandomNum } from "../helpers";

enum CubeEnum {
  r = "right",
  l = "left",
  t = "top",
  b = "bottom",
}

const MainGame = () => {
  const { playerInfo } = useCubeSelector((state) => state.cube);
  const { musicRefs, isChrome } = useCubeContext();
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
    return new Promise((resolve) => {
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
            topCubeAngle.current = topCubeAngle.current + (isClock ? 90 : -90);
            topCubeAngle.current =
              Math.abs(topCubeAngle.current) >= 360 ? 0 : topCubeAngle.current;
            console.log("t: ", topCubeAngle.current);

            topCubeEl.style.transform = `rotateY(${topCubeAngle.current}deg)`;
            break;
          case CubeEnum.b:
            bottomCubeAngle.current =
              bottomCubeAngle.current + (isClock ? 90 : -90);
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
      const timer = setTimeout(() => {
        clearTimeout(timer);
        resolve();
      }, 800);
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
    let ind: number = 0;
    const el = els.find((el, i) => {
      if (el.dataset.position === pos) ind = i;
      return el.dataset.position === pos;
    });

    // ? After geting the needed el, it should be removed for the total array, so as to reduce iteration when next the function is called

    if (el) {
      const color = getComputedStyle(el, "before").backgroundColor;
      els.splice(ind, 1);
      updateEl.style.setProperty("--box_clr", color);
    } else console.error("There is no element with the position: ", pos);
  };

  // *I am stopping here for today what is left to be done
  // todo Work on reconciling colors for all rotatinons

  const reconcileColors = (
    cube: CubeEnum,
    templateCubeEls: HTMLElement[],
    modCubeEls: HTMLElement[]
  ) => {
    switch (cube) {
      case CubeEnum.l:
        modCubeEls.forEach((el) => {
          const position = el.dataset.position;

          switch (position) {
            case "utl1":
              updateColor(templateCubeEls, el, "lu1");
              break;
            default:
              console.error("There is a bug here");
              return;
          }
        });

        break;
      case CubeEnum.r:
        break;
      case CubeEnum.t:
        break;
      case CubeEnum.b:
        break;
      default:
        console.error("There is a bug here");
        return;
    }
  };

  // *Reconciles all rotations
  const reconciler = (cube: CubeEnum, isClock: boolean) => {
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
      // const isVert = cube === CubeEnum.l || cube === CubeEnum.r;
      // * Change Positions
      switch (cube) {
        case CubeEnum.l:
          leftBoxesEls.forEach((el) => {
            const position = el.dataset.position;

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
                console.error("There is a bug here");
                return;
            }
          });
          break;
        case CubeEnum.r:
          rightBoxesEls.forEach((el) => {
            const position = el.dataset.position;

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
                console.error("There is a bug here");
                return;
            }
          });
          break;
        case CubeEnum.t:
          topBoxesEls.forEach((el) => {
            const position = el.dataset.position;
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
                console.error("There is a bug here");
                return;
            }
          });
          break;
        default:
          console.error("There is a bug here");
          return;
      }

      // * Reconcile colors between vert and hori cubes
      const horiBoxesEls = [...topBoxesEls, ...midBoxesEls, ...bottomBoxesEls];
      const vertBoxesEls = [
        ...rightBoxesEls,
        ...centerBoxesEls,
        ...leftBoxesEls,
      ];
      switch (cube) {
        case CubeEnum.l:
          const tempLeftBoxesEls = [...leftBoxesEls];

          break;
        case CubeEnum.r:
          break;
        case CubeEnum.t:
          break;
        case CubeEnum.b:
          break;
        default:
          console.error("There is a bug here");
          return;
      }
    }
  };

  // todo setup isChrome functionality for firstEntry
  // *For testing purposes, we will show position

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
    if (playerInfo) {
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
    }
  }, [playerInfo]);

  // ?Scramble cube
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

        for (let i = 0; i < 5; i++) {
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
      })();
    }
  }, [isClrsSet]);

  // ?This line is for switching between cubes. This can be made active if the animations in the styles are also active, but should not be used for the main game
  // useEffect(() => {
  //   if (rightCubeRef.current && topCubeRef.current) {
  //     const vertEl = rightCubeRef.current.parentElement;
  //     const horEl = topCubeRef.current.parentElement;

  //     const timer = setInterval(() => {
  //       vertEl?.classList.toggle("active");
  //       horEl?.classList.toggle("active");
  //     }, 5000);

  //     return () => clearInterval(timer);
  //   }
  // }, []);

  return (
    <SectionTemplate id={Section.main}>
      <div className="main_wrapper">
        {playerInfo ? (
          <>
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
                  <Lazyload src={`/${playerInfo.avi}`} alt="avi" />
                </div>
              </div>

              <div className="left_side">
                <p className="time">00:00:00</p>
              </div>
            </nav>

            <main>
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
                      data-position="mr1"
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
                        !topBoxesRef.current.some((rel) => rel === el) &&
                        topBoxesRef.current.push(el)
                      }
                      data-position="ml1"
                    >
                      ml1
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !topBoxesRef.current.some((rel) => rel === el) &&
                        topBoxesRef.current.push(el)
                      }
                      data-position="ml2"
                    >
                      ml2
                    </span>
                    <span
                      className="box"
                      ref={(el) =>
                        el &&
                        !topBoxesRef.current.some((rel) => rel === el) &&
                        topBoxesRef.current.push(el)
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
  const { setOpenModal } = useCubeContext();

  useEffect(() => {
    setOpenModal && setOpenModal({ state: true, key: ModalKeys.start });
  }, []);
  return <></>;
};

export default MainGame;
