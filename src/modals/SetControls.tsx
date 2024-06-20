import { useEffect, useRef, useState } from "react";
import ModalBackBtn from "../components/ModalBackBtn";
import { useCubeContext } from "../contexts/cubeContext";
import { ControlType, ModalKeys } from "../types";
import useSfx from "../hooks/useSfx";
import { clickSfx } from "../data";

const SetControls = () => {
  const { controlType, setControlType } = useCubeContext();
  const [sel, setSel] = useState(controlType ?? "");
  const inputRef = useRef<HTMLInputElement[]>([]);
  const { playSfx } = useSfx();

  useEffect(() => {
    const els = inputRef.current;

    if (els.length) {
      const el = els.find((e) => e.checked);
      if (el) {
        setControlType &&
          setControlType(
            el.value === ControlType.b
              ? ControlType.b
              : el.value === ControlType.s
              ? ControlType.s
              : ControlType.bt
          );
      }
    }
  }, [sel]);

  return (
    <div className="modal_opts_wrapper settings revert">
      <div className="item">
        <label htmlFor="button">Button</label>
        <input
          type="radio"
          name="controlType"
          id="button"
          value={ControlType.bt}
          onChange={(e) => {
            setSel(e.target.value), playSfx(clickSfx);
          }}
          checked={sel === ControlType.bt}
          ref={(el) =>
            el &&
            !inputRef.current.some((rel) => rel === el) &&
            inputRef.current.push(el)
          }
        />
      </div>

      <div className="item">
        <label htmlFor="swipe">Swipe</label>
        <input
          type="radio"
          name="controlType"
          id="swipe"
          value={ControlType.s}
          onChange={(e) => {
            setSel(e.target.value), playSfx(clickSfx);
          }}
          checked={sel === ControlType.s}
          ref={(el) =>
            el &&
            !inputRef.current.some((rel) => rel === el) &&
            inputRef.current.push(el)
          }
        />
      </div>

      <div className="item">
        <label htmlFor="both">Both</label>
        <input
          type="radio"
          name="controlType"
          id="both"
          value={ControlType.b}
          onChange={(e) => {
            setSel(e.target.value), playSfx(clickSfx);
          }}
          checked={sel === ControlType.b}
          ref={(el) =>
            el &&
            !inputRef.current.some((rel) => rel === el) &&
            inputRef.current.push(el)
          }
        />
      </div>

      <ModalBackBtn mkey={ModalKeys.set} />
    </div>
  );
};

export default SetControls;
