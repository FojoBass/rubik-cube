import { useEffect } from "react";
import applause from "../assets/audios/music/applause.wav";
import fireworks from "../assets/videos/fireworks.mp4";
import { useCubeContext } from "../contexts/cubeContext";
import { useCubeSelector } from "../app/store";
import { acceptSfx, rejectSfx } from "../data";
import useSfx from "../hooks/useSfx";
import { useNavigate } from "react-router-dom";

const GameComplete = () => {
  const { musicVol, isMute } = useCubeContext();
  const { isComplete } = useCubeSelector((state) => state.cube);
  const { playSfx } = useSfx();
  const navigate = useNavigate();
  const { setIsReset } = useCubeContext();

  const handleStart = () => {
    setIsReset && setIsReset(true);
  };

  const handleMenu = () => {
    navigate("/", { replace: true });
  };

  useEffect(() => {
    if (isComplete && musicVol !== undefined && isMute !== undefined) {
      const celeb = new Audio(applause);
      celeb.volume = musicVol / 100;
      celeb.muted = isMute;
      celeb.play();
    }
  }, [isMute, musicVol, isComplete]);

  return (
    <div className={`complete_wrapper ${isComplete ? "active" : ""}`}>
      <video src={fireworks} loop autoPlay />

      <div className="confirm_wrapper comp">
        <p className="question">Congratulations 🎊🍾🥳🎈🎇 Rubikcbue solved</p>
        <div className="btns_wrapper">
          <button
            className="affirm_btn"
            onPointerDown={() => playSfx(acceptSfx)}
            onClick={handleStart}
          >
            Start
          </button>
          <button
            className="cancel_btn"
            onPointerDown={() => playSfx(rejectSfx)}
            onClick={handleMenu}
          >
            Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameComplete;
