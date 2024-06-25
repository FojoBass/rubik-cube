import { cubeSlice } from "../app/features/cubeSlice";
import { useCubeDispatch } from "../app/store";

const useHooks = () => {
  const { setIsComplete } = cubeSlice.actions;
  const dispatch = useCubeDispatch();

  const showCube = (cube: "v" | "h") => {
    const vertCubeEl = document.querySelector(".vert_cube");
    const horCubeEl = document.querySelector(".hor_cube");

    if (vertCubeEl && horCubeEl) {
      if (cube === "v") {
        vertCubeEl.classList.add("active");
        horCubeEl.classList.remove("active");
      } else {
        vertCubeEl.classList.remove("active");
        horCubeEl.classList.add("active");
      }
    }
  };

  const runCheck = (
    boxes: HTMLElement[],
    side: "face" | "back" | "top" | "bottom" | "rside" | "lside"
  ): boolean => {
    const loopChk = (
      defClr: "white" | "blue" | "red" | "orange" | "yellow" | "green"
    ): boolean => {
      for (let i = 0; i < boxes.length; i++) {
        const clr = getComputedStyle(boxes[i]).getPropertyValue("--box_clr");
        if (clr !== defClr) return false;
      }

      return true;
    };

    switch (side) {
      case "face":
        return loopChk("white");
      case "back":
        return loopChk("yellow");
      case "bottom":
        return loopChk("orange");
      case "top":
        return loopChk("red");
      case "lside":
        return loopChk("blue");
      case "rside":
        return loopChk("green");
      default:
        throw new Error(`Invalid side: ${side}`);
    }
  };

  // * checkCube will only run for vertCube
  const checkCube = (allBoxes: HTMLElement[]) => {
    const getBoxes = (id: string): HTMLElement[] =>
      allBoxes.filter((box) => box.dataset.side === id);

    const faceBoxes = getBoxes("face");
    const backBoxes = getBoxes("back");
    const topBoxes = getBoxes("top");
    const bottomBoxes = getBoxes("bottom");
    const rightBoxes = getBoxes("rside");
    const leftBoxes = getBoxes("lside");

    if (
      runCheck(faceBoxes, "face") &&
      runCheck(backBoxes, "back") &&
      runCheck(topBoxes, "top") &&
      runCheck(bottomBoxes, "bottom") &&
      runCheck(rightBoxes, "rside") &&
      runCheck(leftBoxes, "lside")
    )
      setTimeout(() => {
        dispatch(setIsComplete(true));
      }, 500);
    else console.log("Not solved yet bro!");
  };

  return { showCube, checkCube };
};

export default useHooks;
