import { useState } from "react";
import { clickSfx, rejectSfx, tipsOpts } from "../data";
import useSfx from "../hooks/useSfx";
import { useCubeContext } from "../contexts/cubeContext";

const Tips = () => {
  const { playSfx } = useSfx();
  const [currInd, setCurrInd] = useState(0);
  const { setIsTips } = useCubeContext();

  const handleNext = () => {
    setCurrInd(currInd + 1 < tipsOpts.length ? currInd + 1 : 0);
  };

  const handleSkip = () => {
    setIsTips && setIsTips(false);
  };

  return (
    <div className="modal_opts_wrapper confirm_wrapper">
      <div className="tips_wrapper">
        {tipsOpts.map((tip, ind) => (
          <p key={tip} className={`${currInd === ind ? "active" : ""}`}>
            {tip}
          </p>
        ))}
      </div>

      <div className="btns_wrapper">
        <button
          className="skip_btn"
          onPointerDown={() => playSfx(rejectSfx)}
          onClick={handleSkip}
        >
          Skip
        </button>

        <button
          className="next_btn"
          onPointerDown={() => playSfx(clickSfx)}
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Tips;
