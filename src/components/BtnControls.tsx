import { Dispatch, FC, SetStateAction, useEffect, useRef } from "react";
import useSfx from "../hooks/useSfx";
import { clickSfx } from "../data";
import { CubeEnum } from "../types";
import { useCubeContext } from "../contexts/cubeContext";
import {
  MdOutlineArrowForward,
  MdArrowUpward,
  MdOutlineArrowDownward,
  MdOutlineArrowBack,
} from "react-icons/md";
import useHooks from "../hooks/useHooks";

interface BtnControlsInt {
  rotateCube: (
    cube: CubeEnum,
    isClock: boolean,
    isPlayerInteract: boolean
  ) => void;
  setIsChanges: Dispatch<SetStateAction<boolean>>;
  setMoves: Dispatch<SetStateAction<number>>;
}

const BtnControls: FC<BtnControlsInt> = ({
  rotateCube,
  setIsChanges,
  setMoves,
}) => {
  const controlRefs = useRef<HTMLButtonElement[]>([]);
  const { playSfx } = useSfx();
  const { isDisableControls, setIsDisableControls, sfxVol } = useCubeContext();
  const { showCube } = useHooks();

  useEffect(() => {
    const controlEls = controlRefs.current;

    if (controlEls.length) {
      controlEls.forEach((el) => {
        el.onpointerdown = () => el.disabled || playSfx(clickSfx);

        el.onclick = (e: MouseEvent) => {
          const dir = (e.currentTarget as HTMLElement)?.dataset.dir;
          setIsDisableControls && setIsDisableControls(true);
          setIsChanges(true);
          setMoves((prev) => prev + 1);

          setTimeout(() => {
            setIsDisableControls && setIsDisableControls(false);
          }, 600);

          switch (dir) {
            case "right-clock":
              rotateCube(CubeEnum.r, true, true);
              showCube("v");
              break;
            case "right-aclock":
              rotateCube(CubeEnum.r, false, true);
              showCube("v");
              break;
            case "left-clock":
              rotateCube(CubeEnum.l, true, true);
              showCube("v");
              break;
            case "left-aclock":
              rotateCube(CubeEnum.l, false, true);
              showCube("v");
              break;
            case "top-clock":
              rotateCube(CubeEnum.t, true, true);
              showCube("h");
              break;
            case "top-aclock":
              rotateCube(CubeEnum.t, false, true);
              showCube("h");
              break;
            case "bottom-clock":
              rotateCube(CubeEnum.b, true, true);
              showCube("h");
              break;
            case "bottom-aclock":
              rotateCube(CubeEnum.b, false, true);
              showCube("h");
              break;
            default:
              console.error(`Direction ${dir} not found`);
              return;
          }
        };
      });
    }

    return () => {
      controlEls.forEach((el) => {
        el.onpointerdown = null;
        el.onclick = null;
      });
    };
  }, [sfxVol]);

  return (
    <div className="controls_wrapper">
      <div className="pos_wrapper top_right">
        <button
          disabled={isDisableControls}
          className="pos_btn top"
          ref={(el) => {
            el &&
              !controlRefs.current.some((rel) => rel === el) &&
              controlRefs.current.push(el);
          }}
          data-dir="right-clock"
        >
          <MdArrowUpward />
        </button>

        <button
          disabled={isDisableControls}
          className="pos_btn right"
          ref={(el) => {
            el &&
              !controlRefs.current.some((rel) => rel === el) &&
              controlRefs.current.push(el);
          }}
          data-dir="top-aclock"
        >
          <MdOutlineArrowForward />
        </button>
      </div>

      <div className="pos_wrapper top_left">
        <button
          disabled={isDisableControls}
          className="pos_btn top"
          ref={(el) => {
            el &&
              !controlRefs.current.some((rel) => rel === el) &&
              controlRefs.current.push(el);
          }}
          data-dir="left-clock"
        >
          <MdArrowUpward />
        </button>

        <button
          disabled={isDisableControls}
          className="pos_btn left"
          ref={(el) => {
            el &&
              !controlRefs.current.some((rel) => rel === el) &&
              controlRefs.current.push(el);
          }}
          data-dir="top-clock"
        >
          <MdOutlineArrowBack />
        </button>
      </div>

      <div className="pos_wrapper bottom_right">
        <button
          disabled={isDisableControls}
          className="pos_btn bottom"
          ref={(el) => {
            el &&
              !controlRefs.current.some((rel) => rel === el) &&
              controlRefs.current.push(el);
          }}
          data-dir="right-aclock"
        >
          <MdOutlineArrowDownward />
        </button>

        <button
          disabled={isDisableControls}
          className="pos_btn right"
          ref={(el) => {
            el &&
              !controlRefs.current.some((rel) => rel === el) &&
              controlRefs.current.push(el);
          }}
          data-dir="bottom-aclock"
        >
          <MdOutlineArrowForward />
        </button>
      </div>

      <div className="pos_wrapper bottom_left">
        <button
          disabled={isDisableControls}
          className="pos_btn bottom"
          ref={(el) => {
            el &&
              !controlRefs.current.some((rel) => rel === el) &&
              controlRefs.current.push(el);
          }}
          data-dir="left-aclock"
        >
          <MdOutlineArrowDownward />
        </button>

        <button
          disabled={isDisableControls}
          className="pos_btn left"
          ref={(el) => {
            el &&
              !controlRefs.current.some((rel) => rel === el) &&
              controlRefs.current.push(el);
          }}
          data-dir="bottom-clock"
        >
          <MdOutlineArrowBack />
        </button>
      </div>
    </div>
  );
};

export default BtnControls;
