import {
  Dispatch,
  FC,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
} from "react";
import { useCubeContext } from "../contexts/cubeContext";
import { ControlType, CubeEnum } from "../types";
import useHooks from "../hooks/useHooks";
import useSfx from "../hooks/useSfx";
import { clickSfx } from "../data";
import { LuMoveHorizontal, LuMoveVertical } from "react-icons/lu";

interface SwipeControlsInt {
  elRef: MutableRefObject<HTMLDivElement | null>;
  rightCubeRef: MutableRefObject<HTMLDivElement | null>;
  leftCubeRef: MutableRefObject<HTMLDivElement | null>;
  topCubeRef: MutableRefObject<HTMLDivElement | null>;
  bottomCubeRef: MutableRefObject<HTMLDivElement | null>;
  rightCubeAngle: MutableRefObject<number>;
  leftCubeAngle: MutableRefObject<number>;
  topCubeAngle: MutableRefObject<number>;
  bottomCubeAngle: MutableRefObject<number>;
  rotateCube: (
    cube: CubeEnum,
    isClock: boolean,
    isPlayerInteract: boolean
  ) => void;
  setIsChanges: Dispatch<SetStateAction<boolean>>;
  setMoves: Dispatch<SetStateAction<number>>;
}

const SwipeControls: FC<SwipeControlsInt> = ({
  elRef,
  rightCubeRef,
  leftCubeRef,
  topCubeRef,
  bottomCubeRef,
  bottomCubeAngle,
  leftCubeAngle,
  rightCubeAngle,
  topCubeAngle,
  rotateCube,
  setIsChanges,
  setMoves,
}) => {
  const { controlType } = useCubeContext();
  const btnsRef = useRef<HTMLButtonElement[]>([]);
  const isDown = useRef(0);
  const cube = useRef<CubeEnum | null>(null);
  const iniX = useRef(0);
  const iniY = useRef(0);
  const angle = useRef(0);
  const { showCube } = useHooks();
  const vertDir = useRef(true);
  const horDir = useRef(true);
  const { playSfx } = useSfx();

  const setTransform = (el: HTMLElement, angle: number, dir: "X" | "Y") => {
    el.style.transform = `rotate${dir}(${angle}deg)`;
  };

  const remAngle = (dAngle: number) => Math.abs(angle.current - dAngle);

  const handlePointerDown = (e: PointerEvent) => {
    const target = e.target as HTMLElement;

    if (target.classList.contains("rot_point")) {
      const position = target.dataset.side;

      if (position === "top") {
        showCube("h");
        cube.current = CubeEnum.t;
      } else if (position === "left") {
        showCube("v");
        cube.current = CubeEnum.l;
      } else if (position === "right") {
        showCube("v");
        cube.current = CubeEnum.r;
      } else if (position === "bottom") {
        showCube("h");
        cube.current = CubeEnum.b;
      } else console.error("Bug here!");

      isDown.current = 1;
      iniX.current = e.clientX;
      iniY.current = e.clientY;
    }
  };

  const handlePointerMove = (e: PointerEvent) => {
    const cub = cube.current;
    const rightCubeEl = rightCubeRef.current;
    const leftCubeEl = leftCubeRef.current;
    const topCubeEl = topCubeRef.current;
    const bottomCubeEl = bottomCubeRef.current;

    if (
      isDown.current === 1 &&
      cub &&
      rightCubeEl &&
      leftCubeEl &&
      topCubeEl &&
      bottomCubeEl
    ) {
      const dx = (e.clientX - iniX.current) / 4;
      const dy = (iniY.current - e.clientY) / 4;

      switch (cub) {
        case CubeEnum.r:
          angle.current = rightCubeAngle.current + dy;
          setTransform(rightCubeEl, angle.current, "X");
          vertDir.current = dy > 0;

          if (remAngle(rightCubeAngle.current) >= 90) isDown.current = 2;
          break;
        case CubeEnum.l:
          angle.current = leftCubeAngle.current + dy;
          setTransform(leftCubeEl, angle.current, "X");
          vertDir.current = dy > 0;

          if (remAngle(leftCubeAngle.current) >= 90) isDown.current = 2;
          break;
        case CubeEnum.t:
          angle.current = topCubeAngle.current + dx;
          setTransform(topCubeEl, angle.current, "Y");
          horDir.current = dx < 0;

          if (remAngle(topCubeAngle.current) >= 90) isDown.current = 2;
          break;
        case CubeEnum.b:
          angle.current = bottomCubeAngle.current + dx;
          setTransform(bottomCubeEl, angle.current, "Y");
          horDir.current = dx < 0;

          if (remAngle(bottomCubeAngle.current) >= 90) isDown.current = 2;
          break;
        default:
          console.error(`${cub} not found!`);
      }
    }
  };

  const handlePointerUp = () => {
    const rightCubeEl = rightCubeRef.current;
    const leftCubeEl = leftCubeRef.current;
    const topCubeEl = topCubeRef.current;
    const bottomCubeEl = bottomCubeRef.current;

    if (
      isDown.current &&
      rightCubeEl &&
      leftCubeEl &&
      topCubeEl &&
      bottomCubeEl
    ) {
      isDown.current = 0;

      switch (cube.current) {
        case CubeEnum.r:
          if (remAngle(rightCubeAngle.current) > 30 && cube.current) {
            playSfx(clickSfx);
            setIsChanges(true);
            setMoves((prev) => prev + 1);

            rotateCube(cube.current, vertDir.current, true);
          } else {
            setTransform(rightCubeEl, rightCubeAngle.current, "X");
          }
          break;
        case CubeEnum.l:
          if (remAngle(leftCubeAngle.current) > 30 && cube.current) {
            playSfx(clickSfx);
            setIsChanges(true);
            setMoves((prev) => prev + 1);

            rotateCube(cube.current, vertDir.current, true);
          } else {
            setTransform(leftCubeEl, leftCubeAngle.current, "X");
          }
          break;
        case CubeEnum.t:
          if (remAngle(topCubeAngle.current) > 30 && cube.current) {
            playSfx(clickSfx);
            setIsChanges(true);
            setMoves((prev) => prev + 1);

            rotateCube(cube.current, horDir.current, true);
          } else {
            setTransform(topCubeEl, topCubeAngle.current, "Y");
          }
          break;
        case CubeEnum.b:
          if (remAngle(bottomCubeAngle.current) > 30 && cube.current) {
            playSfx(clickSfx);
            setIsChanges(true);
            setMoves((prev) => prev + 1);

            rotateCube(cube.current, horDir.current, true);
          } else {
            setTransform(bottomCubeEl, bottomCubeAngle.current, "Y");
          }
          break;
        default:
          console.error(`${cube.current} not found!`);
      }
    }
  };

  useEffect(() => {
    const btnsEls = btnsRef.current;
    const rightCubeEl = rightCubeRef.current;
    const leftCubeEl = leftCubeRef.current;
    const topCubeEl = topCubeRef.current;
    const bottomCubeEl = bottomCubeRef.current;

    if (
      btnsEls.length &&
      rightCubeEl &&
      leftCubeEl &&
      topCubeEl &&
      bottomCubeEl
    ) {
      addEventListener("pointerdown", handlePointerDown);
      addEventListener("pointermove", handlePointerMove);
      addEventListener("pointerup", handlePointerUp);
    }

    return () => {
      removeEventListener("pointerdown", handlePointerDown);
      removeEventListener("pointermove", handlePointerMove);
      removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  return (
    <div
      className={`swipe_cube ${controlType === ControlType.bt ? "hide" : ""}`}
      ref={elRef}
    >
      <div className="face">
        <div className="row">
          <button
            className="rot_point"
            data-side="top"
            ref={(el) => {
              el &&
                !btnsRef.current.some((rel) => rel === el) &&
                btnsRef.current.push(el);
            }}
          >
            <LuMoveHorizontal />
          </button>
        </div>

        <div className="row double">
          <button
            className="rot_point"
            data-side="left"
            ref={(el) => {
              el &&
                !btnsRef.current.some((rel) => rel === el) &&
                btnsRef.current.push(el);
            }}
          >
            <LuMoveVertical />
          </button>
          <button
            className="rot_point"
            data-side="right"
            ref={(el) => {
              el &&
                !btnsRef.current.some((rel) => rel === el) &&
                btnsRef.current.push(el);
            }}
          >
            <LuMoveVertical />
          </button>
        </div>

        <div className="row">
          <button
            className="rot_point"
            data-side="bottom"
            ref={(el) => {
              el &&
                !btnsRef.current.some((rel) => rel === el) &&
                btnsRef.current.push(el);
            }}
          >
            <LuMoveHorizontal />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwipeControls;
