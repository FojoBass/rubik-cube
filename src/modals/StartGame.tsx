import {
  FC,
  FormEventHandler,
  KeyboardEventHandler,
  MouseEventHandler,
  MutableRefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import avi1 from "../assets/images/avi1.jpg";
import avi3 from "../assets/images/avi3.jpg";
import avi2 from "../assets/images/avi2.jpg";
import { FaTimes } from "react-icons/fa";
import Lazyload from "../components/Lazyload";
import { acceptSfx, clickSfx, keyboardSfx, rejectSfx } from "../data";
import useSfx from "../hooks/useSfx";
import { useCubeContext } from "../contexts/cubeContext";
import { useNavigate, useParams } from "react-router-dom";
import { useCubeDispatch, useCubeSelector } from "../app/store";
import { createPlayer } from "../app/features/cubeAsyncThunk";
import { cubeSlice } from "../app/features/cubeSlice";

const StartGame = () => {
  const [playerName, setPlayerName] = useState("");
  const [aviUrl, setAviUrl] = useState("");
  const aviRefs = useRef<HTMLButtonElement[]>([]);
  const { playSfx } = useSfx();
  const { setOpenModal, isNew, isContinue, setIsContinue, setIsNew } =
    useCubeContext();
  const navigate = useNavigate();
  const { id } = useParams();
  const isDisabled = useMemo<boolean>(() => {
    return Boolean(id && playerName.length > 2 && aviUrl);
  }, [id, playerName, aviUrl]);
  const dispatch = useCubeDispatch();
  const { isCreateFailed, isCreateSuccess, error, loading } = useCubeSelector(
    (state) => state.cube
  );
  const { resetCreateFailed, resetCreateSuccess } = cubeSlice.actions;
  const [errMsg, setErrMsg] = useState("");
  const errRef = useRef<HTMLParagraphElement | null>(null);

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();

    if (playerName.length > 2 && aviUrl) {
      dispatch(createPlayer({ uid: id ?? "", aviUrl, playerName }));
    }
  };

  const handleAviClick: MouseEventHandler = (e) => {
    const el = e.currentTarget;
    aviRefs.current.forEach((el) => {
      el.classList.remove("selected");
    });
    el.classList.add("selected");
    const srcInd = (el.children[0] as HTMLImageElement).src.indexOf("src");
    const src = (el.children[0] as HTMLImageElement).src.slice(srcInd);

    setAviUrl(src);
  };

  const handleKeyDown: KeyboardEventHandler = (e) => {
    const isLetter = /^[a-zA-Z]$/.test(e.key) || e.key === "Backspace";
    if (isLetter) playSfx(keyboardSfx);
  };

  useEffect(() => {
    const errEl = errRef.current;
    if (errMsg && errEl) {
      errEl.classList.add("active");
      const timer = setTimeout(() => {
        errEl.classList.remove("active");
      }, 3000);

      const timer2 = setTimeout(() => {
        setErrMsg("");
      }, 3500);

      return () => {
        clearTimeout(timer);
        clearTimeout(timer2);
      };
    }
  }, [errMsg]);

  useEffect(() => {
    if (isCreateSuccess) {
      setOpenModal && setOpenModal((prev) => ({ ...prev, state: false }));
      setIsNew && setIsNew(false);
      setIsContinue && setIsContinue(false);
      dispatch(resetCreateSuccess());
    }
    if (isCreateFailed) {
      console.log(error);
      setErrMsg("initialization failed! Try again");
      dispatch(resetCreateFailed());
    }
  }, [isCreateFailed, isCreateSuccess]);

  return (
    <div className="start_game">
      <form onSubmit={handleSubmit}>
        <button
          className="close_btn"
          type="button"
          onPointerDown={() => playSfx(rejectSfx)}
          onClick={() => {
            setOpenModal && setOpenModal((prev) => ({ ...prev, state: false }));
            navigate("/");
          }}
        >
          <FaTimes />
        </button>
        {isNew ? (
          <>
            <div className="form_opt">
              <input type="text" readOnly value={id} />

              <p className="note">Do take note of this id!</p>
            </div>

            <div className="form_opt">
              <input
                type="text"
                placeholder="Player name"
                value={playerName}
                onChange={(e) => {
                  const isLetter =
                    /^[a-zA-Z]+$/.test(e.target.value) || !e.target.value;

                  isLetter && setPlayerName(e.target.value);
                }}
                onKeyDown={handleKeyDown}
              />
            </div>

            <div className="avatar_wrapper">
              <label>Choose avatar</label>
              <div className="avis">
                <Avi url={avi1} handler={handleAviClick} aviRefs={aviRefs} />

                <Avi url={avi2} handler={handleAviClick} aviRefs={aviRefs} />

                <Avi url={avi3} handler={handleAviClick} aviRefs={aviRefs} />
              </div>
            </div>
          </>
        ) : (
          isContinue && <>Form for continue</>
        )}

        <button
          className="start_btn"
          onPointerDown={(e) => e.currentTarget.disabled || playSfx(acceptSfx)}
          disabled={!isDisabled || loading}
        >
          {loading ? "Initializing..." : "Start"}
        </button>

        <p className="err_msg" ref={errRef}>
          {errMsg}
        </p>
      </form>
    </div>
  );
};

interface AviInt {
  url: string;
  handler: MouseEventHandler;
  aviRefs: MutableRefObject<HTMLButtonElement[]>;
}

const Avi: FC<AviInt> = ({ url, handler, aviRefs }) => {
  const { playSfx } = useSfx();

  return (
    <button
      type="button"
      className="img_btn"
      onClick={handler}
      ref={(el) => {
        el &&
          !aviRefs.current.some((rel) => rel === el) &&
          aviRefs.current.push(el);
      }}
      onPointerDown={() => playSfx(clickSfx)}
    >
      <Lazyload src={url} alt="avi" />
    </button>
  );
};

export default StartGame;
