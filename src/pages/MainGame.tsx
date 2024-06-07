import SectionTemplate from "../templates/SectionTemplate";
import { ModalKeys, Section, SoundIds } from "../types";
import { useEffect, useRef } from "react";
import { useCubeSelector } from "../app/store";
import { useCubeContext } from "../contexts/cubeContext";
import { AiOutlineUndo } from "react-icons/ai";
import { FaRegSave } from "react-icons/fa";
import Lazyload from "../components/Lazyload";
import { IoPauseOutline } from "react-icons/io5";
import { genRandomNum } from "../helpers";

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

  // todo setup isChrome functionality for firstEntry
  // *For testing purposes, we will show position

  useEffect(() => {
    const musicEls = musicRefs?.current;
    if (musicEls?.length) {
      const music1 = musicEls.find((el) => el.id === SoundIds.mus1)!;
      music1.pause();
      music1.currentTime = 0;
    }
  }, []);

  const playRand = (musicArr: HTMLAudioElement[]) => {
    const randInd = genRandomNum(musicArr.length);
    musicArr[randInd].play();
    musicArr[randInd].onended = () => {
      musicArr[randInd].onended = null;
      playRand(musicArr);
    };
  };

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
              <div className="cube vert_cube ">
                <div className="sub_cube right_cube" ref={rightCubeRef}>
                  <div className="face">
                    <span
                      className="box rf1"
                      ref={(el) =>
                        el &&
                        !rightBoxesRef.current.some((rel) => rel === el) &&
                        rightBoxesRef.current.push(el)
                      }
                    >
                      rf1
                    </span>
                    <span
                      className="box rf2"
                      ref={(el) =>
                        el &&
                        !rightBoxesRef.current.some((rel) => rel === el) &&
                        rightBoxesRef.current.push(el)
                      }
                    >
                      rf2
                    </span>
                    <span
                      className="box rf3"
                      ref={(el) =>
                        el &&
                        !rightBoxesRef.current.some((rel) => rel === el) &&
                        rightBoxesRef.current.push(el)
                      }
                    >
                      rf3
                    </span>
                  </div>

                  <div className="back">
                    <span
                      className="box rb1"
                      ref={(el) =>
                        el &&
                        !rightBoxesRef.current.some((rel) => rel === el) &&
                        rightBoxesRef.current.push(el)
                      }
                    >
                      rb1
                    </span>
                    <span
                      className="box rb2"
                      ref={(el) =>
                        el &&
                        !rightBoxesRef.current.some((rel) => rel === el) &&
                        rightBoxesRef.current.push(el)
                      }
                    >
                      rb2
                    </span>
                    <span
                      className="box rb3"
                      ref={(el) =>
                        el &&
                        !rightBoxesRef.current.some((rel) => rel === el) &&
                        rightBoxesRef.current.push(el)
                      }
                    >
                      rb3
                    </span>
                  </div>

                  <div className="top">
                    <span
                      className="box ru1"
                      ref={(el) =>
                        el &&
                        !rightBoxesRef.current.some((rel) => rel === el) &&
                        rightBoxesRef.current.push(el)
                      }
                    >
                      ru1
                    </span>
                    <span
                      className="box ru2"
                      ref={(el) =>
                        el &&
                        !rightBoxesRef.current.some((rel) => rel === el) &&
                        rightBoxesRef.current.push(el)
                      }
                    >
                      ru2
                    </span>
                    <span
                      className="box ru3"
                      ref={(el) =>
                        el &&
                        !rightBoxesRef.current.some((rel) => rel === el) &&
                        rightBoxesRef.current.push(el)
                      }
                    >
                      ru3
                    </span>
                  </div>

                  <div className="bottom">
                    <span
                      className="box rd1"
                      ref={(el) =>
                        el &&
                        !rightBoxesRef.current.some((rel) => rel === el) &&
                        rightBoxesRef.current.push(el)
                      }
                    >
                      rd1
                    </span>
                    <span
                      className="box rd2"
                      ref={(el) =>
                        el &&
                        !rightBoxesRef.current.some((rel) => rel === el) &&
                        rightBoxesRef.current.push(el)
                      }
                    >
                      rd2
                    </span>
                    <span
                      className="box rd3"
                      ref={(el) =>
                        el &&
                        !rightBoxesRef.current.some((rel) => rel === el) &&
                        rightBoxesRef.current.push(el)
                      }
                    >
                      rd3
                    </span>
                  </div>

                  <div className="right">
                    <span
                      className="box rsu1"
                      ref={(el) =>
                        el &&
                        !rightBoxesRef.current.some((rel) => rel === el) &&
                        rightBoxesRef.current.push(el)
                      }
                    >
                      rsu1
                    </span>
                    <span
                      className="box rsu2"
                      ref={(el) =>
                        el &&
                        !rightBoxesRef.current.some((rel) => rel === el) &&
                        rightBoxesRef.current.push(el)
                      }
                    >
                      rsu2
                    </span>
                    <span
                      className="box rsu3"
                      ref={(el) =>
                        el &&
                        !rightBoxesRef.current.some((rel) => rel === el) &&
                        rightBoxesRef.current.push(el)
                      }
                    >
                      rsu3
                    </span>
                    <span
                      className="box rsm1"
                      ref={(el) =>
                        el &&
                        !rightBoxesRef.current.some((rel) => rel === el) &&
                        rightBoxesRef.current.push(el)
                      }
                    >
                      rsm1
                    </span>
                    <span
                      className="box rsm2"
                      ref={(el) =>
                        el &&
                        !rightBoxesRef.current.some((rel) => rel === el) &&
                        rightBoxesRef.current.push(el)
                      }
                    >
                      rsm2
                    </span>
                    <span
                      className="box rsm3"
                      ref={(el) =>
                        el &&
                        !rightBoxesRef.current.some((rel) => rel === el) &&
                        rightBoxesRef.current.push(el)
                      }
                    >
                      rsm3
                    </span>
                    <span
                      className="box rsd1"
                      ref={(el) =>
                        el &&
                        !rightBoxesRef.current.some((rel) => rel === el) &&
                        rightBoxesRef.current.push(el)
                      }
                    >
                      rsd1
                    </span>
                    <span
                      className="box rsd2"
                      ref={(el) =>
                        el &&
                        !rightBoxesRef.current.some((rel) => rel === el) &&
                        rightBoxesRef.current.push(el)
                      }
                    >
                      rsd2
                    </span>
                    <span
                      className="box rsd3"
                      ref={(el) =>
                        el &&
                        !rightBoxesRef.current.some((rel) => rel === el) &&
                        rightBoxesRef.current.push(el)
                      }
                    >
                      rsd3
                    </span>
                  </div>
                </div>

                <div className="sub_cube center_cube" ref={centerCubeRef}>
                  <div className="face">
                    <span
                      className="box cf1"
                      ref={(el) =>
                        el &&
                        !centerBoxesRef.current.some((rel) => rel === el) &&
                        centerBoxesRef.current.push(el)
                      }
                    >
                      cf1
                    </span>
                    <span
                      className="box cf2"
                      ref={(el) =>
                        el &&
                        !centerBoxesRef.current.some((rel) => rel === el) &&
                        centerBoxesRef.current.push(el)
                      }
                    >
                      cf2
                    </span>
                    <span
                      className="box cf3"
                      ref={(el) =>
                        el &&
                        !centerBoxesRef.current.some((rel) => rel === el) &&
                        centerBoxesRef.current.push(el)
                      }
                    >
                      cf3
                    </span>
                  </div>

                  <div className="back">
                    <span
                      className="box cb1"
                      ref={(el) =>
                        el &&
                        !centerBoxesRef.current.some((rel) => rel === el) &&
                        centerBoxesRef.current.push(el)
                      }
                    >
                      cb1
                    </span>
                    <span
                      className="box cb2"
                      ref={(el) =>
                        el &&
                        !centerBoxesRef.current.some((rel) => rel === el) &&
                        centerBoxesRef.current.push(el)
                      }
                    >
                      cb2
                    </span>
                    <span
                      className="box cb3"
                      ref={(el) =>
                        el &&
                        !centerBoxesRef.current.some((rel) => rel === el) &&
                        centerBoxesRef.current.push(el)
                      }
                    >
                      cb3
                    </span>
                  </div>

                  <div className="top">
                    <span
                      className="box cu1"
                      ref={(el) =>
                        el &&
                        !centerBoxesRef.current.some((rel) => rel === el) &&
                        centerBoxesRef.current.push(el)
                      }
                    >
                      cu1
                    </span>
                    <span
                      className="box cu2"
                      ref={(el) =>
                        el &&
                        !centerBoxesRef.current.some((rel) => rel === el) &&
                        centerBoxesRef.current.push(el)
                      }
                    >
                      cu2
                    </span>
                    <span
                      className="box cu3"
                      ref={(el) =>
                        el &&
                        !centerBoxesRef.current.some((rel) => rel === el) &&
                        centerBoxesRef.current.push(el)
                      }
                    >
                      cu3
                    </span>
                  </div>

                  <div className="bottom">
                    <span
                      className="box cd1"
                      ref={(el) =>
                        el &&
                        !centerBoxesRef.current.some((rel) => rel === el) &&
                        centerBoxesRef.current.push(el)
                      }
                    >
                      cd1
                    </span>
                    <span
                      className="box cd2"
                      ref={(el) =>
                        el &&
                        !centerBoxesRef.current.some((rel) => rel === el) &&
                        centerBoxesRef.current.push(el)
                      }
                    >
                      cd2
                    </span>
                    <span
                      className="box cd3"
                      ref={(el) =>
                        el &&
                        !centerBoxesRef.current.some((rel) => rel === el) &&
                        centerBoxesRef.current.push(el)
                      }
                    >
                      cd3
                    </span>
                  </div>
                </div>

                <div className="sub_cube left_cube" ref={leftCubeRef}>
                  <div className="face">
                    <span
                      className="box lf1"
                      ref={(el) =>
                        el &&
                        !leftBoxesRef.current.some((rel) => rel === el) &&
                        leftBoxesRef.current.push(el)
                      }
                    >
                      lf1
                    </span>
                    <span
                      className="box lf2"
                      ref={(el) =>
                        el &&
                        !leftBoxesRef.current.some((rel) => rel === el) &&
                        leftBoxesRef.current.push(el)
                      }
                    >
                      lf2
                    </span>
                    <span
                      className="box lf3"
                      ref={(el) =>
                        el &&
                        !leftBoxesRef.current.some((rel) => rel === el) &&
                        leftBoxesRef.current.push(el)
                      }
                    >
                      lf3
                    </span>
                  </div>

                  <div className="back">
                    <span
                      className="box lb1"
                      ref={(el) =>
                        el &&
                        !leftBoxesRef.current.some((rel) => rel === el) &&
                        leftBoxesRef.current.push(el)
                      }
                    >
                      lb1
                    </span>
                    <span
                      className="box lb2"
                      ref={(el) =>
                        el &&
                        !leftBoxesRef.current.some((rel) => rel === el) &&
                        leftBoxesRef.current.push(el)
                      }
                    >
                      lb2
                    </span>
                    <span
                      className="box lb3"
                      ref={(el) =>
                        el &&
                        !leftBoxesRef.current.some((rel) => rel === el) &&
                        leftBoxesRef.current.push(el)
                      }
                    >
                      lb3
                    </span>
                  </div>

                  <div className="top">
                    <span
                      className="box lu1"
                      ref={(el) =>
                        el &&
                        !leftBoxesRef.current.some((rel) => rel === el) &&
                        leftBoxesRef.current.push(el)
                      }
                    >
                      lu1
                    </span>
                    <span
                      className="box lu2"
                      ref={(el) =>
                        el &&
                        !leftBoxesRef.current.some((rel) => rel === el) &&
                        leftBoxesRef.current.push(el)
                      }
                    >
                      lu2
                    </span>
                    <span
                      className="box lu3"
                      ref={(el) =>
                        el &&
                        !leftBoxesRef.current.some((rel) => rel === el) &&
                        leftBoxesRef.current.push(el)
                      }
                    >
                      lu3
                    </span>
                  </div>

                  <div className="bottom">
                    <span
                      className="box ld1"
                      ref={(el) =>
                        el &&
                        !leftBoxesRef.current.some((rel) => rel === el) &&
                        leftBoxesRef.current.push(el)
                      }
                    >
                      ld1
                    </span>
                    <span
                      className="box ld2"
                      ref={(el) =>
                        el &&
                        !leftBoxesRef.current.some((rel) => rel === el) &&
                        leftBoxesRef.current.push(el)
                      }
                    >
                      ld2
                    </span>
                    <span
                      className="box ld3"
                      ref={(el) =>
                        el &&
                        !leftBoxesRef.current.some((rel) => rel === el) &&
                        leftBoxesRef.current.push(el)
                      }
                    >
                      ld3
                    </span>
                  </div>

                  <div className="left">
                    <span
                      className="box lsu1"
                      ref={(el) =>
                        el &&
                        !leftBoxesRef.current.some((rel) => rel === el) &&
                        leftBoxesRef.current.push(el)
                      }
                    >
                      lsu1
                    </span>
                    <span
                      className="box lsu2"
                      ref={(el) =>
                        el &&
                        !leftBoxesRef.current.some((rel) => rel === el) &&
                        leftBoxesRef.current.push(el)
                      }
                    >
                      lsu2
                    </span>
                    <span
                      className="box lsu3"
                      ref={(el) =>
                        el &&
                        !leftBoxesRef.current.some((rel) => rel === el) &&
                        leftBoxesRef.current.push(el)
                      }
                    >
                      lsu3
                    </span>
                    <span
                      className="box lsm1"
                      ref={(el) =>
                        el &&
                        !leftBoxesRef.current.some((rel) => rel === el) &&
                        leftBoxesRef.current.push(el)
                      }
                    >
                      lsm1
                    </span>
                    <span
                      className="box lsm2"
                      ref={(el) =>
                        el &&
                        !leftBoxesRef.current.some((rel) => rel === el) &&
                        leftBoxesRef.current.push(el)
                      }
                    >
                      lsm2
                    </span>
                    <span
                      className="box lsm3"
                      ref={(el) =>
                        el &&
                        !leftBoxesRef.current.some((rel) => rel === el) &&
                        leftBoxesRef.current.push(el)
                      }
                    >
                      lsm3
                    </span>
                    <span
                      className="box lsd1"
                      ref={(el) =>
                        el &&
                        !leftBoxesRef.current.some((rel) => rel === el) &&
                        leftBoxesRef.current.push(el)
                      }
                    >
                      lsd1
                    </span>
                    <span
                      className="box lsd2"
                      ref={(el) =>
                        el &&
                        !leftBoxesRef.current.some((rel) => rel === el) &&
                        leftBoxesRef.current.push(el)
                      }
                    >
                      lsd2
                    </span>
                    <span
                      className="box lsd3"
                      ref={(el) =>
                        el &&
                        !leftBoxesRef.current.some((rel) => rel === el) &&
                        leftBoxesRef.current.push(el)
                      }
                    >
                      lsd3
                    </span>
                  </div>
                </div>
              </div>

              <div className="cube hor_cube active">
                <div className="sub_cube top_cube" ref={topCubeRef}>
                  <div className="top">
                    <span
                      className="box utl1"
                      ref={(el) =>
                        el &&
                        !topBoxesRef.current.some((rel) => rel === el) &&
                        topBoxesRef.current.push(el)
                      }
                    >
                      utl1
                    </span>
                    <span
                      className="box utc1"
                      ref={(el) =>
                        el &&
                        !topBoxesRef.current.some((rel) => rel === el) &&
                        topBoxesRef.current.push(el)
                      }
                    >
                      utc1
                    </span>
                    <span
                      className="box utr1"
                      ref={(el) =>
                        el &&
                        !topBoxesRef.current.some((rel) => rel === el) &&
                        topBoxesRef.current.push(el)
                      }
                    >
                      utr1
                    </span>
                    <span
                      className="box utl2"
                      ref={(el) =>
                        el &&
                        !topBoxesRef.current.some((rel) => rel === el) &&
                        topBoxesRef.current.push(el)
                      }
                    >
                      utl2
                    </span>
                    <span
                      className="box utc2"
                      ref={(el) =>
                        el &&
                        !topBoxesRef.current.some((rel) => rel === el) &&
                        topBoxesRef.current.push(el)
                      }
                    >
                      utc2
                    </span>
                    <span
                      className="box utr2"
                      ref={(el) =>
                        el &&
                        !topBoxesRef.current.some((rel) => rel === el) &&
                        topBoxesRef.current.push(el)
                      }
                    >
                      utr2
                    </span>
                    <span
                      className="box utl3"
                      ref={(el) =>
                        el &&
                        !topBoxesRef.current.some((rel) => rel === el) &&
                        topBoxesRef.current.push(el)
                      }
                    >
                      utl3
                    </span>
                    <span
                      className="box utc3"
                      ref={(el) =>
                        el &&
                        !topBoxesRef.current.some((rel) => rel === el) &&
                        topBoxesRef.current.push(el)
                      }
                    >
                      utc3
                    </span>
                    <span
                      className="box utr3"
                      ref={(el) =>
                        el &&
                        !topBoxesRef.current.some((rel) => rel === el) &&
                        topBoxesRef.current.push(el)
                      }
                    >
                      utr3
                    </span>
                  </div>

                  <div className="face">
                    <span
                      className="box uf1"
                      ref={(el) =>
                        el &&
                        !topBoxesRef.current.some((rel) => rel === el) &&
                        topBoxesRef.current.push(el)
                      }
                    >
                      uf1
                    </span>
                    <span
                      className="box uf2"
                      ref={(el) =>
                        el &&
                        !topBoxesRef.current.some((rel) => rel === el) &&
                        topBoxesRef.current.push(el)
                      }
                    >
                      uf2
                    </span>
                    <span
                      className="box uf3"
                      ref={(el) =>
                        el &&
                        !topBoxesRef.current.some((rel) => rel === el) &&
                        topBoxesRef.current.push(el)
                      }
                    >
                      uf3
                    </span>
                  </div>

                  <div className="back">
                    <span
                      className="box ub1"
                      ref={(el) =>
                        el &&
                        !topBoxesRef.current.some((rel) => rel === el) &&
                        topBoxesRef.current.push(el)
                      }
                    >
                      ub1
                    </span>
                    <span
                      className="box ub2"
                      ref={(el) =>
                        el &&
                        !topBoxesRef.current.some((rel) => rel === el) &&
                        topBoxesRef.current.push(el)
                      }
                    >
                      ub2
                    </span>
                    <span
                      className="box ub3"
                      ref={(el) =>
                        el &&
                        !topBoxesRef.current.some((rel) => rel === el) &&
                        topBoxesRef.current.push(el)
                      }
                    >
                      ub3
                    </span>
                  </div>

                  <div className="right">
                    <span
                      className="box ur1"
                      ref={(el) =>
                        el &&
                        !topBoxesRef.current.some((rel) => rel === el) &&
                        topBoxesRef.current.push(el)
                      }
                    >
                      ur1
                    </span>
                    <span
                      className="box ur2"
                      ref={(el) =>
                        el &&
                        !topBoxesRef.current.some((rel) => rel === el) &&
                        topBoxesRef.current.push(el)
                      }
                    >
                      ur2
                    </span>
                    <span
                      className="box ur3"
                      ref={(el) =>
                        el &&
                        !topBoxesRef.current.some((rel) => rel === el) &&
                        topBoxesRef.current.push(el)
                      }
                    >
                      ur3
                    </span>
                  </div>

                  <div className="left">
                    <span
                      className="box ul1"
                      ref={(el) =>
                        el &&
                        !topBoxesRef.current.some((rel) => rel === el) &&
                        topBoxesRef.current.push(el)
                      }
                    >
                      ul1
                    </span>
                    <span
                      className="box ul2"
                      ref={(el) =>
                        el &&
                        !topBoxesRef.current.some((rel) => rel === el) &&
                        topBoxesRef.current.push(el)
                      }
                    >
                      ul2
                    </span>
                    <span
                      className="box ul3"
                      ref={(el) =>
                        el &&
                        !topBoxesRef.current.some((rel) => rel === el) &&
                        topBoxesRef.current.push(el)
                      }
                    >
                      ul3
                    </span>
                  </div>
                </div>

                <div className="sub_cube mid_cube" ref={midCubeRef}>
                  <div className="face">
                    <span
                      className="box mf1"
                      ref={(el) =>
                        el &&
                        !midBoxesRef.current.some((rel) => rel === el) &&
                        midBoxesRef.current.push(el)
                      }
                    >
                      mf1
                    </span>
                    <span
                      className="box mf2"
                      ref={(el) =>
                        el &&
                        !midBoxesRef.current.some((rel) => rel === el) &&
                        midBoxesRef.current.push(el)
                      }
                    >
                      mf2
                    </span>
                    <span
                      className="box mf3"
                      ref={(el) =>
                        el &&
                        !midBoxesRef.current.some((rel) => rel === el) &&
                        midBoxesRef.current.push(el)
                      }
                    >
                      mf3
                    </span>
                  </div>

                  <div className="back">
                    <span
                      className="box mb1"
                      ref={(el) =>
                        el &&
                        !midBoxesRef.current.some((rel) => rel === el) &&
                        midBoxesRef.current.push(el)
                      }
                    >
                      mb1
                    </span>
                    <span
                      className="box mb2"
                      ref={(el) =>
                        el &&
                        !midBoxesRef.current.some((rel) => rel === el) &&
                        midBoxesRef.current.push(el)
                      }
                    >
                      mb2
                    </span>
                    <span
                      className="box mb3"
                      ref={(el) =>
                        el &&
                        !midBoxesRef.current.some((rel) => rel === el) &&
                        midBoxesRef.current.push(el)
                      }
                    >
                      mb3
                    </span>
                  </div>

                  <div className="right">
                    <span
                      className="box mr1"
                      ref={(el) =>
                        el &&
                        !midBoxesRef.current.some((rel) => rel === el) &&
                        midBoxesRef.current.push(el)
                      }
                    >
                      mr1
                    </span>
                    <span
                      className="box mr2"
                      ref={(el) =>
                        el &&
                        !midBoxesRef.current.some((rel) => rel === el) &&
                        midBoxesRef.current.push(el)
                      }
                    >
                      mr2
                    </span>
                    <span
                      className="box mr3"
                      ref={(el) =>
                        el &&
                        !midBoxesRef.current.some((rel) => rel === el) &&
                        midBoxesRef.current.push(el)
                      }
                    >
                      mr3
                    </span>
                  </div>

                  <div className="left">
                    <span
                      className="box ml1"
                      ref={(el) =>
                        el &&
                        !topBoxesRef.current.some((rel) => rel === el) &&
                        topBoxesRef.current.push(el)
                      }
                    >
                      ml1
                    </span>
                    <span
                      className="box ml2"
                      ref={(el) =>
                        el &&
                        !topBoxesRef.current.some((rel) => rel === el) &&
                        topBoxesRef.current.push(el)
                      }
                    >
                      ml2
                    </span>
                    <span
                      className="box ml3"
                      ref={(el) =>
                        el &&
                        !topBoxesRef.current.some((rel) => rel === el) &&
                        topBoxesRef.current.push(el)
                      }
                    >
                      ml3
                    </span>
                  </div>
                </div>

                <div className="sub_cube bottom_cube" ref={bottomCubeRef}>
                  <div className="bottom">
                    <span
                      className="box dbl1"
                      ref={(el) =>
                        el &&
                        !bottomBoxesRef.current.some((rel) => rel === el) &&
                        bottomBoxesRef.current.push(el)
                      }
                    >
                      dbl1
                    </span>
                    <span
                      className="box dbc1"
                      ref={(el) =>
                        el &&
                        !bottomBoxesRef.current.some((rel) => rel === el) &&
                        bottomBoxesRef.current.push(el)
                      }
                    >
                      dbc1
                    </span>
                    <span
                      className="box dbr1"
                      ref={(el) =>
                        el &&
                        !bottomBoxesRef.current.some((rel) => rel === el) &&
                        bottomBoxesRef.current.push(el)
                      }
                    >
                      dbr1
                    </span>
                    <span
                      className="box dbl2"
                      ref={(el) =>
                        el &&
                        !bottomBoxesRef.current.some((rel) => rel === el) &&
                        bottomBoxesRef.current.push(el)
                      }
                    >
                      dbl2
                    </span>
                    <span
                      className="box dbc2"
                      ref={(el) =>
                        el &&
                        !bottomBoxesRef.current.some((rel) => rel === el) &&
                        bottomBoxesRef.current.push(el)
                      }
                    >
                      dbc2
                    </span>
                    <span
                      className="box dbr2"
                      ref={(el) =>
                        el &&
                        !bottomBoxesRef.current.some((rel) => rel === el) &&
                        bottomBoxesRef.current.push(el)
                      }
                    >
                      dbr2
                    </span>
                    <span
                      className="box dbl3"
                      ref={(el) =>
                        el &&
                        !bottomBoxesRef.current.some((rel) => rel === el) &&
                        bottomBoxesRef.current.push(el)
                      }
                    >
                      dbl3
                    </span>
                    <span
                      className="box dbc3"
                      ref={(el) =>
                        el &&
                        !bottomBoxesRef.current.some((rel) => rel === el) &&
                        bottomBoxesRef.current.push(el)
                      }
                    >
                      dbc3
                    </span>
                    <span
                      className="box dbr3"
                      ref={(el) =>
                        el &&
                        !bottomBoxesRef.current.some((rel) => rel === el) &&
                        bottomBoxesRef.current.push(el)
                      }
                    >
                      dbr3
                    </span>
                  </div>

                  <div className="face">
                    <span
                      className="box df1"
                      ref={(el) =>
                        el &&
                        !bottomBoxesRef.current.some((rel) => rel === el) &&
                        bottomBoxesRef.current.push(el)
                      }
                    >
                      df1
                    </span>
                    <span
                      className="box df2"
                      ref={(el) =>
                        el &&
                        !bottomBoxesRef.current.some((rel) => rel === el) &&
                        bottomBoxesRef.current.push(el)
                      }
                    >
                      df2
                    </span>
                    <span
                      className="box df3"
                      ref={(el) =>
                        el &&
                        !bottomBoxesRef.current.some((rel) => rel === el) &&
                        bottomBoxesRef.current.push(el)
                      }
                    >
                      df3
                    </span>
                  </div>

                  <div className="back">
                    <span
                      className="box db1"
                      ref={(el) =>
                        el &&
                        !bottomBoxesRef.current.some((rel) => rel === el) &&
                        bottomBoxesRef.current.push(el)
                      }
                    >
                      db1
                    </span>
                    <span
                      className="box db2"
                      ref={(el) =>
                        el &&
                        !bottomBoxesRef.current.some((rel) => rel === el) &&
                        bottomBoxesRef.current.push(el)
                      }
                    >
                      db2
                    </span>
                    <span
                      className="box db3"
                      ref={(el) =>
                        el &&
                        !bottomBoxesRef.current.some((rel) => rel === el) &&
                        bottomBoxesRef.current.push(el)
                      }
                    >
                      db3
                    </span>
                  </div>

                  <div className="right">
                    <span
                      className="box dr1"
                      ref={(el) =>
                        el &&
                        !bottomBoxesRef.current.some((rel) => rel === el) &&
                        bottomBoxesRef.current.push(el)
                      }
                    >
                      dr1
                    </span>
                    <span
                      className="box dr2"
                      ref={(el) =>
                        el &&
                        !bottomBoxesRef.current.some((rel) => rel === el) &&
                        bottomBoxesRef.current.push(el)
                      }
                    >
                      dr2
                    </span>
                    <span
                      className="box dr3"
                      ref={(el) =>
                        el &&
                        !bottomBoxesRef.current.some((rel) => rel === el) &&
                        bottomBoxesRef.current.push(el)
                      }
                    >
                      dr3
                    </span>
                  </div>

                  <div className="left">
                    <span
                      className="box dl1"
                      ref={(el) =>
                        el &&
                        !bottomBoxesRef.current.some((rel) => rel === el) &&
                        bottomBoxesRef.current.push(el)
                      }
                    >
                      dl1
                    </span>
                    <span
                      className="box dl2"
                      ref={(el) =>
                        el &&
                        !bottomBoxesRef.current.some((rel) => rel === el) &&
                        bottomBoxesRef.current.push(el)
                      }
                    >
                      dl2
                    </span>
                    <span
                      className="box dl3"
                      ref={(el) =>
                        el &&
                        !bottomBoxesRef.current.some((rel) => rel === el) &&
                        bottomBoxesRef.current.push(el)
                      }
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
