import { useRef } from "react";
import {
  acceptSfx,
  clickSfx,
  cubeSfx,
  music1,
  music2,
  music3,
  rejectSfx,
} from "../data";
import { SoundIds } from "../types";
import { useCubeContext } from "../contexts/cubeContext";

const Audio = () => {
  const { musicRefs, sfxRefs } = useCubeContext();

  return (
    <div>
      <audio
        src={music1}
        ref={(el) => {
          el &&
            musicRefs &&
            !musicRefs.current.some((rel) => rel === el) &&
            musicRefs.current.push(el);
        }}
        id={SoundIds.mus1}
      />
      <audio
        src={music2}
        ref={(el) => {
          el &&
            musicRefs &&
            !musicRefs.current.some((rel) => rel === el) &&
            musicRefs.current.push(el);
        }}
        id={SoundIds.mus2}
      />
      <audio
        src={music3}
        ref={(el) => {
          el &&
            musicRefs &&
            !musicRefs.current.some((rel) => rel === el) &&
            musicRefs.current.push(el);
        }}
        id={SoundIds.mus3}
      />
      <audio
        src={acceptSfx}
        id={SoundIds.acpt}
        ref={(el) => {
          el &&
            sfxRefs &&
            !sfxRefs.current.some((rel) => rel === el) &&
            sfxRefs.current.push(el);
        }}
      />
      <audio
        src={clickSfx}
        id={SoundIds.click}
        ref={(el) => {
          el &&
            sfxRefs &&
            !sfxRefs.current.some((rel) => rel === el) &&
            sfxRefs.current.push(el);
        }}
      />
      <audio
        src={cubeSfx}
        id={SoundIds.cube}
        ref={(el) => {
          el &&
            sfxRefs &&
            !sfxRefs.current.some((rel) => rel === el) &&
            sfxRefs.current.push(el);
        }}
      />
      <audio
        src={rejectSfx}
        id={SoundIds.rej}
        ref={(el) => {
          el &&
            sfxRefs &&
            !sfxRefs.current.some((rel) => rel === el) &&
            sfxRefs.current.push(el);
        }}
      />
    </div>
  );
};

export default Audio;
