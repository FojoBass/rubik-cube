import { FC, useEffect, useRef, useState } from "react";
import { TbFidgetSpinner } from "react-icons/tb";

interface LazyloadInt {
  src: string;
  alt: string;
}

const Lazyload: FC<LazyloadInt> = ({ src, alt }) => {
  const [isIntersects, setIsIntersects] = useState(false);
  const [isImgLoaded, setIsImgLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const spinRef = useRef<HTMLDivElement | null>(null);

  const callBack: IntersectionObserverCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setIsIntersects(true);
        observer.unobserve(entry.target);
      }
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(callBack);

    if (spinRef.current) {
      observer.observe(spinRef.current.parentElement!);
    }

    return () => {
      if (spinRef.current) observer.unobserve(spinRef.current.parentElement!);
    };
  }, []);

  useEffect(() => {
    if (isIntersects) {
      const imgEl = imgRef.current;

      if (imgEl) {
        if (imgEl.complete) setIsImgLoaded(true);
        else {
          imgEl.onload = () => {
            setIsImgLoaded(true);
          };
        }
      }
    }
  }, [isIntersects]);

  return (
    <>
      {isIntersects ? (
        <>
          <img src={src} alt={alt} ref={imgRef} />
          {isImgLoaded || (
            <div className="media_loading">
              <TbFidgetSpinner />
            </div>
          )}
        </>
      ) : (
        <div className="media_loading" ref={spinRef}>
          <TbFidgetSpinner />
        </div>
      )}
    </>
  );
};

export default Lazyload;
