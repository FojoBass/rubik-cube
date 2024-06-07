import { useEffect, useRef } from "react";
import { genRandomNum } from "../helpers";

const Cubes = () => {
  return (
    <section className="sml_cubes_wrapper">
      <Cube />
      <Cube />
      <Cube />
      <Cube />
      <Cube />
      <Cube />
      <Cube />
    </section>
  );
};

export default Cubes;

const Cube = () => {
  const boxRef = useRef<HTMLSpanElement[]>([]);
  const colors: string[] = [
    "white",
    "yellow",
    "blue",
    "green",
    "red",
    "orange",
    "white",
    "yellow",
    "blue",
    "green",
    "red",
    "orange",
    "white",
    "yellow",
    "blue",
    "green",
    "red",
    "orange",
    "white",
    "yellow",
    "blue",
    "green",
    "red",
    "orange",
    "white",
    "yellow",
    "blue",
    "green",
    "red",
    "orange",
    "white",
    "yellow",
    "blue",
    "green",
    "red",
    "orange",
    "white",
    "yellow",
    "blue",
    "green",
    "red",
    "orange",
    "white",
    "yellow",
    "blue",
    "green",
    "red",
    "orange",
    "white",
    "yellow",
    "blue",
    "green",
    "red",
    "orange",
  ];

  const smlCubeRef = useRef<HTMLDivElement>(null);

  // todo Factor in height of boxes to prevent them entering the bounds

  const setCubePos = (el: HTMLDivElement, x: number, y: number) => {
    el.style.top = y + "%";
    el.style.left = x + "%";
  };

  useEffect(() => {
    const boxEls = boxRef.current;

    if (boxEls.length && colors.length) {
      boxEls.forEach((el) => {
        const randInd = genRandomNum(colors.length);
        const color = colors.splice(randInd, 1)[0];
        el.classList.add(color);
        el.style.backgroundColor = color;
      });
    }
  }, []);

  useEffect(() => {
    const cubeEl = smlCubeRef.current;

    if (cubeEl) {
      let xpos = genRandomNum(100);
      let ypos = genRandomNum(100);
      let speed = Math.random() * 0.4 + 0.1;
      let xNeg = false;
      let yNeg = false;
      const cubeWidthPercent =
        (cubeEl.getBoundingClientRect().width / innerWidth) * 100;

      const cubeHeightPercent =
        (cubeEl.getBoundingClientRect().height / innerHeight) * 100;

      setCubePos(cubeEl, xpos, ypos);

      const moveInterval = setInterval(() => {
        // ? Controls direction of sml cubes movement
        if (xNeg) xpos = xpos - speed;
        else xpos = xpos + speed;

        if (yNeg) ypos = ypos - speed;
        else ypos = ypos + speed;

        // ? Inverts movement direction at bounds
        if (xpos >= 100 - cubeWidthPercent && !xNeg) xNeg = true;
        if (xpos <= 0 && xNeg) xNeg = false;

        if (ypos >= 100 - cubeHeightPercent && !yNeg) yNeg = true;
        if (ypos <= 0 && yNeg) yNeg = false;

        setCubePos(cubeEl, xpos, ypos);
      }, 100);

      return () => clearInterval(moveInterval);
    }
  }, []);

  return (
    <div className="sml_cube" ref={smlCubeRef}>
      <div className="face sml_cube_sides">
        <span
          className="clr_box"
          ref={(el) => {
            el &&
              !boxRef.current.some((rel) => rel === el) &&
              boxRef.current.push(el);
          }}
        ></span>
        <span
          className="clr_box"
          ref={(el) => {
            el &&
              !boxRef.current.some((rel) => rel === el) &&
              boxRef.current.push(el);
          }}
        ></span>
        <span
          className="clr_box"
          ref={(el) => {
            el &&
              !boxRef.current.some((rel) => rel === el) &&
              boxRef.current.push(el);
          }}
        ></span>
        <span
          className="clr_box"
          ref={(el) => {
            el &&
              !boxRef.current.some((rel) => rel === el) &&
              boxRef.current.push(el);
          }}
        ></span>
        <span
          className="clr_box"
          ref={(el) => {
            el &&
              !boxRef.current.some((rel) => rel === el) &&
              boxRef.current.push(el);
          }}
        ></span>
        <span
          className="clr_box"
          ref={(el) => {
            el &&
              !boxRef.current.some((rel) => rel === el) &&
              boxRef.current.push(el);
          }}
        ></span>
        <span
          className="clr_box"
          ref={(el) => {
            el &&
              !boxRef.current.some((rel) => rel === el) &&
              boxRef.current.push(el);
          }}
        ></span>
        <span
          className="clr_box"
          ref={(el) => {
            el &&
              !boxRef.current.some((rel) => rel === el) &&
              boxRef.current.push(el);
          }}
        ></span>
        <span
          className="clr_box"
          ref={(el) => {
            el &&
              !boxRef.current.some((rel) => rel === el) &&
              boxRef.current.push(el);
          }}
        ></span>
      </div>
      <div className="back sml_cube_sides">
        <span
          className="clr_box"
          ref={(el) => {
            el &&
              !boxRef.current.some((rel) => rel === el) &&
              boxRef.current.push(el);
          }}
        ></span>
        <span
          className="clr_box"
          ref={(el) => {
            el &&
              !boxRef.current.some((rel) => rel === el) &&
              boxRef.current.push(el);
          }}
        ></span>
        <span
          className="clr_box"
          ref={(el) => {
            el &&
              !boxRef.current.some((rel) => rel === el) &&
              boxRef.current.push(el);
          }}
        ></span>
        <span
          className="clr_box"
          ref={(el) => {
            el &&
              !boxRef.current.some((rel) => rel === el) &&
              boxRef.current.push(el);
          }}
        ></span>
        <span
          className="clr_box"
          ref={(el) => {
            el &&
              !boxRef.current.some((rel) => rel === el) &&
              boxRef.current.push(el);
          }}
        ></span>
        <span
          className="clr_box"
          ref={(el) => {
            el &&
              !boxRef.current.some((rel) => rel === el) &&
              boxRef.current.push(el);
          }}
        ></span>
        <span
          className="clr_box"
          ref={(el) => {
            el &&
              !boxRef.current.some((rel) => rel === el) &&
              boxRef.current.push(el);
          }}
        ></span>
        <span
          className="clr_box"
          ref={(el) => {
            el &&
              !boxRef.current.some((rel) => rel === el) &&
              boxRef.current.push(el);
          }}
        ></span>
        <span
          className="clr_box"
          ref={(el) => {
            el &&
              !boxRef.current.some((rel) => rel === el) &&
              boxRef.current.push(el);
          }}
        ></span>
      </div>
      <div className="top sml_cube_sides">
        <span
          className="clr_box"
          ref={(el) => {
            el &&
              !boxRef.current.some((rel) => rel === el) &&
              boxRef.current.push(el);
          }}
        ></span>
        <span
          className="clr_box"
          ref={(el) => {
            el &&
              !boxRef.current.some((rel) => rel === el) &&
              boxRef.current.push(el);
          }}
        ></span>
        <span
          className="clr_box"
          ref={(el) => {
            el &&
              !boxRef.current.some((rel) => rel === el) &&
              boxRef.current.push(el);
          }}
        ></span>
        <span
          className="clr_box"
          ref={(el) => {
            el &&
              !boxRef.current.some((rel) => rel === el) &&
              boxRef.current.push(el);
          }}
        ></span>
        <span
          className="clr_box"
          ref={(el) => {
            el &&
              !boxRef.current.some((rel) => rel === el) &&
              boxRef.current.push(el);
          }}
        ></span>
        <span
          className="clr_box"
          ref={(el) => {
            el &&
              !boxRef.current.some((rel) => rel === el) &&
              boxRef.current.push(el);
          }}
        ></span>
        <span
          className="clr_box"
          ref={(el) => {
            el &&
              !boxRef.current.some((rel) => rel === el) &&
              boxRef.current.push(el);
          }}
        ></span>
        <span
          className="clr_box"
          ref={(el) => {
            el &&
              !boxRef.current.some((rel) => rel === el) &&
              boxRef.current.push(el);
          }}
        ></span>
        <span
          className="clr_box"
          ref={(el) => {
            el &&
              !boxRef.current.some((rel) => rel === el) &&
              boxRef.current.push(el);
          }}
        ></span>
      </div>
      <div className="bottom sml_cube_sides">
        <span
          className="clr_box"
          ref={(el) => {
            el &&
              !boxRef.current.some((rel) => rel === el) &&
              boxRef.current.push(el);
          }}
        ></span>
        <span
          className="clr_box"
          ref={(el) => {
            el &&
              !boxRef.current.some((rel) => rel === el) &&
              boxRef.current.push(el);
          }}
        ></span>
        <span
          className="clr_box"
          ref={(el) => {
            el &&
              !boxRef.current.some((rel) => rel === el) &&
              boxRef.current.push(el);
          }}
        ></span>
        <span
          className="clr_box"
          ref={(el) => {
            el &&
              !boxRef.current.some((rel) => rel === el) &&
              boxRef.current.push(el);
          }}
        ></span>
        <span
          className="clr_box"
          ref={(el) => {
            el &&
              !boxRef.current.some((rel) => rel === el) &&
              boxRef.current.push(el);
          }}
        ></span>
        <span
          className="clr_box"
          ref={(el) => {
            el &&
              !boxRef.current.some((rel) => rel === el) &&
              boxRef.current.push(el);
          }}
        ></span>
        <span
          className="clr_box"
          ref={(el) => {
            el &&
              !boxRef.current.some((rel) => rel === el) &&
              boxRef.current.push(el);
          }}
        ></span>
        <span
          className="clr_box"
          ref={(el) => {
            el &&
              !boxRef.current.some((rel) => rel === el) &&
              boxRef.current.push(el);
          }}
        ></span>
        <span
          className="clr_box"
          ref={(el) => {
            el &&
              !boxRef.current.some((rel) => rel === el) &&
              boxRef.current.push(el);
          }}
        ></span>
      </div>
      <div className="right sml_cube_sides">
        <span
          className="clr_box"
          ref={(el) => {
            el &&
              !boxRef.current.some((rel) => rel === el) &&
              boxRef.current.push(el);
          }}
        ></span>
        <span
          className="clr_box"
          ref={(el) => {
            el &&
              !boxRef.current.some((rel) => rel === el) &&
              boxRef.current.push(el);
          }}
        ></span>
        <span
          className="clr_box"
          ref={(el) => {
            el &&
              !boxRef.current.some((rel) => rel === el) &&
              boxRef.current.push(el);
          }}
        ></span>
        <span
          className="clr_box"
          ref={(el) => {
            el &&
              !boxRef.current.some((rel) => rel === el) &&
              boxRef.current.push(el);
          }}
        ></span>
        <span
          className="clr_box"
          ref={(el) => {
            el &&
              !boxRef.current.some((rel) => rel === el) &&
              boxRef.current.push(el);
          }}
        ></span>
        <span
          className="clr_box"
          ref={(el) => {
            el &&
              !boxRef.current.some((rel) => rel === el) &&
              boxRef.current.push(el);
          }}
        ></span>
        <span
          className="clr_box"
          ref={(el) => {
            el &&
              !boxRef.current.some((rel) => rel === el) &&
              boxRef.current.push(el);
          }}
        ></span>
        <span
          className="clr_box"
          ref={(el) => {
            el &&
              !boxRef.current.some((rel) => rel === el) &&
              boxRef.current.push(el);
          }}
        ></span>
        <span
          className="clr_box"
          ref={(el) => {
            el &&
              !boxRef.current.some((rel) => rel === el) &&
              boxRef.current.push(el);
          }}
        ></span>
      </div>
      <div className="left sml_cube_sides">
        <span
          className="clr_box"
          ref={(el) => {
            el &&
              !boxRef.current.some((rel) => rel === el) &&
              boxRef.current.push(el);
          }}
        ></span>
        <span
          className="clr_box"
          ref={(el) => {
            el &&
              !boxRef.current.some((rel) => rel === el) &&
              boxRef.current.push(el);
          }}
        ></span>
        <span
          className="clr_box"
          ref={(el) => {
            el &&
              !boxRef.current.some((rel) => rel === el) &&
              boxRef.current.push(el);
          }}
        ></span>
        <span
          className="clr_box"
          ref={(el) => {
            el &&
              !boxRef.current.some((rel) => rel === el) &&
              boxRef.current.push(el);
          }}
        ></span>
        <span
          className="clr_box"
          ref={(el) => {
            el &&
              !boxRef.current.some((rel) => rel === el) &&
              boxRef.current.push(el);
          }}
        ></span>
        <span
          className="clr_box"
          ref={(el) => {
            el &&
              !boxRef.current.some((rel) => rel === el) &&
              boxRef.current.push(el);
          }}
        ></span>
        <span
          className="clr_box"
          ref={(el) => {
            el &&
              !boxRef.current.some((rel) => rel === el) &&
              boxRef.current.push(el);
          }}
        ></span>
        <span
          className="clr_box"
          ref={(el) => {
            el &&
              !boxRef.current.some((rel) => rel === el) &&
              boxRef.current.push(el);
          }}
        ></span>
        <span
          className="clr_box"
          ref={(el) => {
            el &&
              !boxRef.current.some((rel) => rel === el) &&
              boxRef.current.push(el);
          }}
        ></span>
      </div>
    </div>
  );
};
