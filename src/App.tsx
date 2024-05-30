import { useEffect, useRef, useState } from "react";
import About from "./components/About";
import HallOfFame from "./components/HallOfFame";
import Home from "./components/Home";
import Scores from "./components/Scores";
import Settings from "./components/Settings";
import bgImg from "./assets/images/bg.png";
import bgVid from "./assets/videos/rubik_bg.mp4";
import Audio from "./components/Audio";

const App = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const vidRef = useRef<HTMLVideoElement>(null);

  // todo Set a loading state, until img bg and audios are loaded before loading can be removed

  useEffect(() => {
    const vidEl = vidRef.current;

    if (vidEl) {
      vidEl.oncanplaythrough = () => setIsVideoLoaded(true);
    }
  }, []);

  return (
    <section id="main_layout">
      <Audio />
      <div className="bg">
        <video src={bgVid} autoPlay loop controls={false} muted ref={vidRef} />

        <div className={`img_wrapper ${isVideoLoaded ? "hide" : ""}`}>
          <img src={bgImg} alt="bg-img" />
        </div>
      </div>
      <Home />
      <HallOfFame />
      <About />
      <Scores />
      <Settings />
    </section>
  );
};

export default App;
