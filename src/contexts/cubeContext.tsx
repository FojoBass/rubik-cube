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
import {
  ConfirmKeys,
  ControlType,
  CubeView,
  ModalKeys,
  StorageKeys,
} from "../types";
import { storage } from "../helpers";

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
  isDisableControls?: boolean;
  setIsDisableControls?: Dispatch<SetStateAction<boolean>>;
  isPlay?: boolean;
  setIsPlay?: Dispatch<SetStateAction<boolean>>;
  isReset?: boolean;
  setIsReset?: Dispatch<SetStateAction<boolean>>;
  isMusic?: boolean;
  setIsMusic?: Dispatch<SetStateAction<boolean>>;
  confirmTarget?: ConfirmKeys | "";
  setConfirmTarget?: Dispatch<SetStateAction<ConfirmKeys | "">>;
  controlType?: ControlType;
  setControlType?: Dispatch<SetStateAction<ControlType>>;
  cubeView?: CubeView;
  setCubeView?: Dispatch<SetStateAction<CubeView>>;
}

const CubeContext = createContext<CubeContextInt>({});

const isChrome = navigator.userAgent.toLowerCase().includes("chrome");

export const CubeProvider = ({ children }: { children: ReactNode }) => {
  const musicRefs = useRef<HTMLAudioElement[]>([]);
  const [isMute, setIsMute] = useState(false);
  const [openModal, setOpenModal] = useState<{
    state: boolean;
    key: ModalKeys | "";
  }>({ state: false, key: "" });
  const [musicVol, setMusicVol] = useState(50);
  const [sfxVol, setSfxVol] = useState(50);
  const [isNew, setIsNew] = useState<boolean>(false);
  const [isContinue, setIsContinue] = useState<boolean>(false);
  const [isFormEntry, setIsFormEntry] = useState<boolean>(false);
  const [isDisableControls, setIsDisableControls] = useState<boolean>(false);
  const [isPlay, setIsPlay] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<ConfirmKeys | "">("");
  const [isMusic, setIsMusic] = useState(false);
  const [firstEntry, setFirstEntry] = useState(true);
  const [controlType, setControlType] = useState<ControlType>(
    navigator.maxTouchPoints > 1 ? ControlType.s : ControlType.bt
  );
  const [cubeView, setCubeView] = useState<CubeView>(CubeView.ufr);

  useEffect(() => {
    const musicEls = musicRefs.current;

    if (musicEls.length) {
      musicEls.forEach((el) => {
        el.volume = musicVol / 100;
        el.muted = isMute;
      });
    }
  }, [musicVol, isMute, musicRefs]);

  useEffect(() => {
    if (!firstEntry)
      storage.setter(StorageKeys.rcs, {
        sfxVol,
        musicVol,
        isMute,
        controlType,
      });
  }, [sfxVol, musicVol, isMute, firstEntry, controlType]);

  useEffect(() => {
    if (firstEntry) {
      const result = storage.getter<{
        sfxVol: number;
        musicVol: number;
        isMute: boolean;
        controlType: ControlType;
      }>(StorageKeys.rcs);
      if (result) {
        setSfxVol(result.sfxVol);
        setMusicVol(result.musicVol);
        setIsMute(result.isMute);
        setControlType(result.controlType);
      }
      setFirstEntry(false);
    }
  }, [firstEntry]);

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
    isDisableControls,
    setIsDisableControls,
    isPlay,
    setIsPlay,
    isReset,
    setIsReset,
    confirmTarget,
    setConfirmTarget,
    isMusic,
    setIsMusic,
    controlType,
    setControlType,
    cubeView,
    setCubeView,
  };

  return (
    <CubeContext.Provider value={sharedProps}>{children}</CubeContext.Provider>
  );
};

export const useCubeContext = () => useContext(CubeContext);
