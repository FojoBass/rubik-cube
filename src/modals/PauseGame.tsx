import { Link } from "react-router-dom";
import { acceptSfx, clickSfx, pauseMenu, rejectSfx } from "../data";
import useSfx from "../hooks/useSfx";
import { useCubeContext } from "../contexts/cubeContext";
import { MouseEventHandler, useEffect } from "react";
import { ConfirmKeys, ModalKeys } from "../types";
import { useCubeSelector } from "../app/store";

const PauseGame = () => {
  const { playSfx } = useSfx();
  const { setOpenModal, setIsPlay, isPlay, openModal, setConfirmTarget } =
    useCubeContext();
  const { playerInfo } = useCubeSelector((state) => state.cube);

  const handleClick: MouseEventHandler = (e) => {
    const text = e.currentTarget.textContent;

    switch (text) {
      case "Continue":
        setIsPlay && setIsPlay(true);
        setOpenModal && setOpenModal((prev) => ({ ...prev, state: false }));
        break;
      case "Reset":
        setConfirmTarget && setConfirmTarget(ConfirmKeys.res);
        setOpenModal &&
          setOpenModal((prev) => ({ ...prev, key: ModalKeys.confirm }));
        break;
      case "Settings":
        setOpenModal &&
          setOpenModal((prev) => ({ ...prev, key: ModalKeys.set }));
        break;
      default:
        // console.error(`${text} not found`);
        return;
    }
  };

  useEffect(() => {
    if (isPlay && openModal?.state) setIsPlay && setIsPlay(false);
  }, [isPlay, openModal]);

  return (
    <div className="modal_opts_wrapper">
      {pauseMenu.map(({ link, title }) =>
        link ? (
          <Link
            to={link}
            className="item"
            onPointerDown={() => playSfx(rejectSfx)}
            key={title}
          >
            {title}
          </Link>
        ) : (
          <button
            className="item"
            onPointerDown={() =>
              playSfx(title === "Continue" ? acceptSfx : clickSfx)
            }
            onClick={handleClick}
            key={title}
          >
            {title}
          </button>
        )
      )}
      <p className="id">ID: {playerInfo?.uid}</p>
    </div>
  );
};

export default PauseGame;
