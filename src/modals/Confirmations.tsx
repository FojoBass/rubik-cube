import { useMemo } from "react";
import { useCubeContext } from "../contexts/cubeContext";
import { ConfirmKeys, ModalKeys } from "../types";
import useSfx from "../hooks/useSfx";
import { acceptSfx, rejectSfx } from "../data";

const Confirmations = () => {
  const { confirmTarget, setIsReset, setOpenModal, setConfirmTarget } =
    useCubeContext();
  const action = useMemo<string>(() => {
    if (confirmTarget === ConfirmKeys.res) return "reset game?";
    return "";
  }, [confirmTarget]);
  const { playSfx } = useSfx();

  const handleConfirm = () => {
    switch (confirmTarget) {
      case ConfirmKeys.res:
        setIsReset && setIsReset(true);
        setConfirmTarget && setConfirmTarget("");
        break;
      default:
        console.error(`${confirmTarget} not valid`);
        return;
    }

    setOpenModal && setOpenModal({ key: "", state: false });
  };

  const handleCancel = () => {
    switch (confirmTarget) {
      case ConfirmKeys.res:
        setOpenModal &&
          setOpenModal((prev) => ({ ...prev, key: ModalKeys.pause }));
        setConfirmTarget && setConfirmTarget("");
        break;
      default:
        console.error(`${confirmTarget} not valid`);
        return;
    }
  };

  return (
    <div className="confirm_wrapper">
      <p className="question">Are you sure you want to {action}</p>
      <div className="btns_wrapper">
        <button
          className="affirm_btn"
          onPointerDown={() => playSfx(acceptSfx)}
          onClick={handleConfirm}
        >
          Yes
        </button>
        <button
          className="cancel_btn"
          onPointerDown={() => playSfx(rejectSfx)}
          onClick={handleCancel}
        >
          No
        </button>
      </div>
    </div>
  );
};

export default Confirmations;
