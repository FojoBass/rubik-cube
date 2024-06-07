import { useCubeContext } from "../contexts/cubeContext";

const useSfx = () => {
  const { sfxVol, isMute } = useCubeContext();

  const playSfx = (path: string) => {
    if (sfxVol && !isMute) {
      const audio = new Audio(path);
      audio.volume = sfxVol / 100;
      audio.play();
    }
  };

  return { playSfx };
};

export default useSfx;
