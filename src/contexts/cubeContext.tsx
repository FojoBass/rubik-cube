import {
  Dispatch,
  MutableRefObject,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useRef,
  useState,
} from "react";
import { Section } from "../types";

interface CubeContextInt {
  currentSection?: Section;
  setCurrentSection?: Dispatch<SetStateAction<Section>>;
  musicRefs?: MutableRefObject<HTMLAudioElement[]>;
  sfxRefs?: MutableRefObject<HTMLAudioElement[]>;
  isChrome?: boolean;
  isMute?: boolean;
  setIsMute?: Dispatch<SetStateAction<boolean>>;
}

const CubeContext = createContext<CubeContextInt>({});

const isChrome = navigator.userAgent.toLowerCase().includes("chrome");

export const CubeProvider = ({ children }: { children: ReactNode }) => {
  const [currentSection, setCurrentSection] = useState<Section>(Section.home);
  const musicRefs = useRef<HTMLAudioElement[]>([]);
  const sfxRefs = useRef<HTMLAudioElement[]>([]);
  const [isMute, setIsMute] = useState(false);

  const sharedProps: CubeContextInt = {
    currentSection,
    setCurrentSection,
    musicRefs,
    sfxRefs,
    isChrome,
  };

  return (
    <CubeContext.Provider value={sharedProps}>{children}</CubeContext.Provider>
  );
};

export const useCubeContext = () => useContext(CubeContext);
