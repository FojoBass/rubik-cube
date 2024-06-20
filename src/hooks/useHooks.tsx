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
  return { showCube };
};

export default useHooks;
