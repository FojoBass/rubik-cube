import { useLocation } from "react-router-dom";
import { clickSfx, settingsOpts } from "../data";
import useSfx from "../hooks/useSfx";
import { useCubeContext } from "../contexts/cubeContext";
import { ModalKeys } from "../types";
import { MouseEventHandler } from "react";
import ModalBackBtn from "../components/ModalBackBtn";

const Settings = () => {
  const { playSfx } = useSfx();
  const { setOpenModal } = useCubeContext();
  const { pathname } = useLocation();

  const handleClick: MouseEventHandler = (e) => {
    const text = e.currentTarget.textContent;

    switch (text) {
      case "Sound":
        setOpenModal &&
          setOpenModal((prev) => ({ ...prev, key: ModalKeys.setsou }));
        break;
      case "Controls":
        setOpenModal &&
          setOpenModal((prev) => ({ ...prev, key: ModalKeys.setcon }));
        break;
      default:
        console.error(`${text} not found`);
        return;
    }
  };

  return (
    <div className="modal_opts_wrapper">
      {settingsOpts.map((opt) => (
        <button
          className="item"
          key={opt}
          onPointerDown={() => playSfx(clickSfx)}
          onClick={handleClick}
        >
          {opt}
        </button>
      ))}

      {pathname === "/" || <ModalBackBtn mkey={ModalKeys.pause} />}
    </div>
  );
};

export default Settings;
