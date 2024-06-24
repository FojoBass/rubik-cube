const useHooks = () => {
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

    console.log({
      faceBoxes,
      backBoxes,
      topBoxes,
      bottomBoxes,
      rightBoxes,
      leftBoxes,
    });
  };

  return { showCube, checkCube };
};

export default useHooks;
