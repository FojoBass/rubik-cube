import { useNavigate } from "react-router-dom";
import { useCubeContext } from "../contexts/cubeContext";
import StartGame from "../modals/StartGame";
import { ModalKeys } from "../types";
import { useCubeSelector } from "../app/store";

const ModalLayout = () => {
  const { openModal, setOpenModal, isNew, isContinue } = useCubeContext();
  const { playerInfo } = useCubeSelector((state) => state.cube);
  const navigate = useNavigate();

  return (
    <section
      id="modal_layout"
      className={`${openModal && openModal.state ? "active" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget && setOpenModal) {
          setOpenModal((prev) => ({ ...prev, state: false }));
          (isNew || isContinue) && !playerInfo && navigate("/");
        }
      }}
    >
      <div className="center">
        {openModal?.key === ModalKeys.start && <StartGame />}
      </div>
    </section>
  );
};

export default ModalLayout;
