import { useCubeContext } from "../contexts/cubeContext";
import { ConfirmKeys, ModalKeys } from "../types";
import useSfx from "../hooks/useSfx";
import { acceptSfx, rejectSfx } from "../data";
import { useCubeDispatch } from "../app/store";
import { cubeSlice } from "../app/features/cubeSlice";
import { useNavigate } from "react-router-dom";

const Confirmations = () => {
  const { confirmTarget, setIsReset, setOpenModal, setConfirmTarget } =
    useCubeContext();
  const { playSfx } = useSfx();
  const dispatch = useCubeDispatch();
  const { resetNoActiveGame } = cubeSlice.actions;
  const navigate = useNavigate();

  const handleConfirm = () => {
    switch (confirmTarget) {
      case ConfirmKeys.res:
        setIsReset && setIsReset(true);
        setConfirmTarget && setConfirmTarget("");

        break;
      case ConfirmKeys.newGame:
        setIsReset && setIsReset(true);
        setConfirmTarget && setConfirmTarget("");
        dispatch(resetNoActiveGame());
        break;
      default:
        // console.error(`${confirmTarget} not valid`);
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
      case ConfirmKeys.newGame:
        setOpenModal && setOpenModal({ key: "", state: false });
        setConfirmTarget && setConfirmTarget("");
        dispatch(resetNoActiveGame());
        navigate("/");
        break;
      default:
        // console.error(`${confirmTarget} not valid`);
        return;
    }
  };

  return (
    <div className="confirm_wrapper">
      <p className="question">{confirmTarget}?</p>
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
