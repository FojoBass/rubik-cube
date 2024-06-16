import { useCubeContext } from "../contexts/cubeContext";
import { clickSfx } from "../data";
import useSfx from "../hooks/useSfx";
import { ModalKeys } from "../types";
import ModalBackBtn from "../components/ModalBackBtn";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";

const SetSound = () => {
  const { sfxVol, setSfxVol, musicVol, setMusicVol, isMute, setIsMute } =
    useCubeContext();

  return (
    <div className="modal_opts_wrapper settings">
      <div className="item">
        <label htmlFor="music">Music</label>
        <Range id="music" setVal={setMusicVol} val={musicVol} />
      </div>

      <div className="item">
        <label htmlFor="sfx">Sfx</label>
        <Range id="sfx" setVal={setSfxVol} val={sfxVol} />
      </div>

      <div className="item">
        <label htmlFor="mute">No Sound</label>
        <input
          type="checkbox"
          id="mute"
          checked={isMute}
          onChange={(e) => setIsMute && setIsMute(e.target.checked)}
        />
      </div>
      <ModalBackBtn mkey={ModalKeys.set} />
    </div>
  );
};

export default SetSound;

const Range = ({
  val,
  setVal,
  id,
}: {
  val: number | undefined;
  setVal: Dispatch<SetStateAction<number>> | undefined;
  id: string;
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const el = inputRef.current;

    if (el && val !== undefined) {
      el.style.background = `linear-gradient(to right, #3e78dc ${val}%, #d5d5d5 ${val}%)`;
    }
  }, []);

  return (
    <input
      type="range"
      id={id}
      min={0}
      max={10}
      value={(val ?? 0) / 10}
      onChange={(e) => {
        setVal && setVal(Number(e.target.value) * 10);
        const valPercent = (Number(e.target.value) / 10) * 100;
        e.currentTarget.style.background = `linear-gradient(to right, #3e78dc ${valPercent}%, #d5d5d5 ${valPercent}%)`;
      }}
      className="range"
      ref={inputRef}
    />
  );
};
