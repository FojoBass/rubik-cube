import { music1, music2, music3 } from "../data";
import { SoundIds } from "../types";
import { useCubeContext } from "../contexts/cubeContext";

const Audio = () => {
  const { musicRefs } = useCubeContext();

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
    </div>
  );
};

export default Audio;
