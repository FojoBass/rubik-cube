import { useEffect, useRef, useState } from "react";
import About from "./pages/About";
import HallOfFame from "./pages/HallOfFame";
import Home from "./pages/Home";
import Scores from "./pages/Scores";
import bgImg from "./assets/images/bg.png";
import bgVid from "./assets/videos/rubik_bg.mp4";
import Audio from "./components/Audio";
import Cubes from "./components/Cubes";
import ModalLayout from "./layouts/ModalLayout";
import {
  Outlet,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  useLocation,
} from "react-router-dom";
import Error from "./pages/Error";
import MainGame from "./pages/MainGame";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />} errorElement={<Error />}>
        <Route index element={<Home />} />
        <Route path="/g/:id" element={<MainGame />} />
        <Route path="/halloffame" element={<HallOfFame />} />
        <Route path="/about" element={<About />} />
        <Route path="/scores" element={<Scores />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

const Root = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const vidRef = useRef<HTMLVideoElement>(null);
  const { pathname } = useLocation();

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
      {pathname.includes("/g/") || <Cubes />}
      <div className="bg">
        <video src={bgVid} autoPlay loop controls={false} muted ref={vidRef} />

        <div className={`img_wrapper ${isVideoLoaded ? "hide" : ""}`}>
          <img src={bgImg} alt="bg-img" />
        </div>
      </div>
      <ModalLayout />
      <Outlet />
    </section>
  );
};

export default App;
