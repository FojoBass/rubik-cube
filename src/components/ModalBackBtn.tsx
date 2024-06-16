import { FaArrowLeftLong } from "react-icons/fa6";
import { useCubeContext } from "../contexts/cubeContext";
import { clickSfx } from "../data";
import useSfx from "../hooks/useSfx";
import { ModalKeys } from "../types";

const ModalBackBtn = ({ mkey }: { mkey: ModalKeys }) => {
  const { playSfx } = useSfx();
  const { setOpenModal } = useCubeContext();

  return (
    <button
      className="back_btn"
      onPointerDown={() => playSfx(clickSfx)}
      onClick={() =>
        setOpenModal && setOpenModal((prev) => ({ ...prev, key: mkey }))
      }
    >
      <FaArrowLeftLong />
    </button>
  );
};

export default ModalBackBtn;
