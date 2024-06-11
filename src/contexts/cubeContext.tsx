import {
  Dispatch,
  MutableRefObject,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ModalKeys } from "../types";

interface CubeContextInt {
  musicRefs?: MutableRefObject<HTMLAudioElement[]>;
  isChrome?: boolean;
  isMute?: boolean;
  setIsMute?: Dispatch<SetStateAction<boolean>>;
  openModal?: { state: boolean; key: ModalKeys | "" };
  setOpenModal?: Dispatch<
    SetStateAction<{ state: boolean; key: ModalKeys | "" }>
  >;
  musicVol?: number;
  setMusicVol?: Dispatch<SetStateAction<number>>;
  sfxVol?: number;
  setSfxVol?: Dispatch<SetStateAction<number>>;
  isNew?: boolean;
  setIsNew?: Dispatch<SetStateAction<boolean>>;
  isContinue?: boolean;
  setIsContinue?: Dispatch<SetStateAction<boolean>>;
  isFormEntry?: boolean;
  setIsFormEntry?: Dispatch<SetStateAction<boolean>>;
}

const CubeContext = createContext<CubeContextInt>({});

const isChrome = navigator.userAgent.toLowerCase().includes("chrome");

export const CubeProvider = ({ children }: { children: ReactNode }) => {
  const musicRefs = useRef<HTMLAudioElement[]>([]);
  const [isMute, setIsMute] = useState(true);
  const [openModal, setOpenModal] = useState<{
    state: boolean;
    key: ModalKeys | "";
  }>({ state: false, key: "" });
  const [musicVol, setMusicVol] = useState(50);
  const [sfxVol, setSfxVol] = useState(50);
  const [isNew, setIsNew] = useState<boolean>(false);
  const [isContinue, setIsContinue] = useState<boolean>(false);
  const [isFormEntry, setIsFormEntry] = useState<boolean>(false);

  useEffect(() => {
    const musicEls = musicRefs.current;

    if (musicEls.length) {
      musicEls.forEach((el) => {
        el.volume = musicVol / 100;
        el.muted = isMute;
      });
    }
  }, [musicVol, isMute, musicRefs]);

  const sharedProps: CubeContextInt = {
    musicRefs,
    isChrome,
    isMute,
    setIsMute,
    openModal,
    setOpenModal,
    musicVol,
    setMusicVol,
    sfxVol,
    setSfxVol,
    isNew,
    setIsNew,
    isContinue,
    setIsContinue,
    isFormEntry,
    setIsFormEntry,
  };

  return (
    <CubeContext.Provider value={sharedProps}>{children}</CubeContext.Provider>
  );
};

export const useCubeContext = () => useContext(CubeContext);
