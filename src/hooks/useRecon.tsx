import { MutableRefObject } from "react";
import { CubeEnum } from "../types";
import useHooks from "./useHooks";

interface ReconInt {
  rightBoxesRef: MutableRefObject<HTMLSpanElement[]>;
  centerBoxesRef: MutableRefObject<HTMLSpanElement[]>;
  leftBoxesRef: MutableRefObject<HTMLSpanElement[]>;
  topBoxesRef: MutableRefObject<HTMLSpanElement[]>;
  midBoxesRef: MutableRefObject<HTMLSpanElement[]>;
  bottomBoxesRef: MutableRefObject<HTMLSpanElement[]>;
}

export const useRecon = ({
  rightBoxesRef,
  centerBoxesRef,
  leftBoxesRef,
  topBoxesRef,
  midBoxesRef,
  bottomBoxesRef,
}: ReconInt) => {
  const { checkCube } = useHooks();

  const updateColor = (
    els: HTMLElement[],
    updateEl: HTMLElement,
    pos: string
  ) => {
    const el = els.find((el) => el.dataset.position === pos);

    if (el) {
      const color = getComputedStyle(el).getPropertyValue("--box_clr");
      updateEl.style.setProperty("--box_clr", color);
    } else {
      console.error("There is no element with the position: ", pos);
      console.log("Elements for the above error ", els);
    }
  };

  const updatePosition = (el: HTMLElement, newPos: string) => {
    // ? I inclulde textcontent to make debuggin easy. May remove when done
    el.dataset.position = newPos;
    el.textContent = newPos;
  };

  // ? This is for vertcube
  const updateSides = (el: HTMLElement, side: string) => {
    el.dataset.side = side;
  };

  const reconcileColors = (
    cube: CubeEnum,
    templateCubeEls: HTMLElement[],
    modCubeEls: HTMLElement[]
  ) => {
    // ? cube => The cube that is the model (the rotated cube)
    // ? templateCubeEls => The elements in the model cube
    // ? modCubeEls => The cubeEls to be modified or reconciled to the model
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
              updateColor(templateCubeEls, el, "lsm2");
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
              updateColor(templateCubeEls, el, "rsm2");
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
            case "dr3":
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
              updateColor(templateCubeEls, el, "utc2");
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
              updateColor(templateCubeEls, el, "dbc2");
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
  const reconciler = (
    cube: CubeEnum,
    isClock: boolean,
    isPlayerInteract: boolean
  ): Promise<void> => {
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
              // console.log({ position, el, cube });

              switch (position) {
                case "lf1":
                  updatePosition(el, isClock ? "lu1" : "ld3");
                  updateSides(el, isClock ? "top" : "bottom");
                  break;
                case "lf2":
                  updatePosition(el, isClock ? "lu2" : "ld2");
                  updateSides(el, isClock ? "top" : "bottom");
                  break;
                case "lf3":
                  updatePosition(el, isClock ? "lu3" : "ld1");
                  updateSides(el, isClock ? "top" : "bottom");
                  break;
                case "ld3":
                  updatePosition(el, isClock ? "lf1" : "lb3");
                  updateSides(el, isClock ? "face" : "back");
                  break;
                case "ld2":
                  updatePosition(el, isClock ? "lf2" : "lb2");
                  updateSides(el, isClock ? "face" : "back");
                  break;
                case "ld1":
                  updatePosition(el, isClock ? "lf3" : "lb1");
                  updateSides(el, isClock ? "face" : "back");
                  break;
                case "lb3":
                  updatePosition(el, isClock ? "ld3" : "lu1");
                  updateSides(el, isClock ? "bottom" : "top");
                  break;
                case "lb2":
                  updatePosition(el, isClock ? "ld2" : "lu2");
                  updateSides(el, isClock ? "bottom" : "top");
                  break;
                case "lb1":
                  updatePosition(el, isClock ? "ld1" : "lu3");
                  updateSides(el, isClock ? "bottom" : "top");
                  break;
                case "lu1":
                  updatePosition(el, isClock ? "lb3" : "lf1");
                  updateSides(el, isClock ? "back" : "face");
                  break;
                case "lu2":
                  updatePosition(el, isClock ? "lb2" : "lf2");
                  updateSides(el, isClock ? "back" : "face");
                  break;
                case "lu3":
                  updatePosition(el, isClock ? "lb1" : "lf3");
                  updateSides(el, isClock ? "back" : "face");
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
                  // console.log("lsm2 is fixed");
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
              // console.log({ position, el, cube });

              switch (position) {
                case "rf1":
                  updatePosition(el, isClock ? "ru1" : "rd3");
                  updateSides(el, isClock ? "top" : "bottom");
                  break;
                case "rf2":
                  updatePosition(el, isClock ? "ru2" : "rd2");
                  updateSides(el, isClock ? "top" : "bottom");
                  break;
                case "rf3":
                  updatePosition(el, isClock ? "ru3" : "rd1");
                  updateSides(el, isClock ? "top" : "bottom");
                  break;
                case "rd3":
                  updatePosition(el, isClock ? "rf1" : "rb3");
                  updateSides(el, isClock ? "face" : "back");
                  break;
                case "rd2":
                  updatePosition(el, isClock ? "rf2" : "rb2");
                  updateSides(el, isClock ? "face" : "back");
                  break;
                case "rd1":
                  updatePosition(el, isClock ? "rf3" : "rb1");
                  updateSides(el, isClock ? "face" : "back");
                  break;
                case "rb3":
                  updatePosition(el, isClock ? "rd3" : "ru1");
                  updateSides(el, isClock ? "bottom" : "top");
                  break;
                case "rb2":
                  updatePosition(el, isClock ? "rd2" : "ru2");
                  updateSides(el, isClock ? "bottom" : "top");
                  break;
                case "rb1":
                  updatePosition(el, isClock ? "rd1" : "ru3");
                  updateSides(el, isClock ? "bottom" : "top");
                  break;
                case "ru1":
                  updatePosition(el, isClock ? "rb3" : "rf1");
                  updateSides(el, isClock ? "back" : "face");
                  break;
                case "ru2":
                  updatePosition(el, isClock ? "rb2" : "rf2");
                  updateSides(el, isClock ? "back" : "face");
                  break;
                case "ru3":
                  updatePosition(el, isClock ? "rb1" : "rf3");
                  updateSides(el, isClock ? "back" : "face");
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
                  // console.log(position, " = rsm2 is fixed");
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
              // console.log({ position, el, cube });

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
                  // console.log(position, " = utc2 is fixed");
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
              // console.log({ position, el, cube });

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
                  // console.log("dbc2 is fixed");
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

        isPlayerInteract && checkCube(vertBoxesEls);
      }

      resolve();
    });
  };
  return { reconciler, reconcileColors };
};
