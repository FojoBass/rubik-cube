import { useLocation, useNavigate } from "react-router-dom";
import { useCubeContext } from "../contexts/cubeContext";
import StartGame from "../modals/StartGame";
import { ModalKeys } from "../types";
import { useCubeSelector } from "../app/store";
import PauseGame from "../modals/PauseGame";
import Confirmations from "../modals/Confirmations";
import Settings from "../modals/Settings";
import SetSound from "../modals/SetSound";
import SetControls from "../modals/SetControls";
import Tips from "../modals/Tips";
import { MouseEventHandler } from "react";

const ModalLayout = () => {
  const {
    openModal,
    setOpenModal,
    isNew,
    isContinue,
    setIsContinue,
    setIsNew,
    setIsPlay,
    setIsTips,
  } = useCubeContext();
  const { playerInfo } = useCubeSelector((state) => state.cube);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleClick: MouseEventHandler = (e) => {
    if (e.target === e.currentTarget && setOpenModal) {
      setOpenModal((prev) => ({ ...prev, state: false }));
      setIsNew && setIsNew(false);
      setIsContinue && setIsContinue(false);
      openModal?.key === ModalKeys.pause && setIsPlay && setIsPlay(true);
      openModal?.key === ModalKeys.tips && setIsTips && setIsTips(false);
      (isNew || isContinue || pathname.includes("/g/")) &&
        !playerInfo &&
        navigate("/");
    }
  };

  return (
    <section
      id="modal_layout"
      className={`${openModal && openModal.state ? "active" : ""}`}
      onClick={handleClick}
    >
      <div className="center">
        {openModal?.key === ModalKeys.start && <StartGame />}
        {openModal?.key === ModalKeys.pause && <PauseGame />}
        {openModal?.key === ModalKeys.confirm && <Confirmations />}
        {openModal?.key === ModalKeys.set && <Settings />}
        {openModal?.key === ModalKeys.setsou && <SetSound />}
        {openModal?.key === ModalKeys.setcon && <SetControls />}
        {openModal?.key === ModalKeys.tips && <Tips />}
      </div>
    </section>
  );
};

export default ModalLayout;
