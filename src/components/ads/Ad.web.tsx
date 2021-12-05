import React, { useEffect, useRef } from 'react';
import './Ad.css';

export const Ad = () => {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6949812709353975';
    script.async = true;
    script.crossOrigin = 'anonymous';
    const div = divRef.current;
    div?.appendChild(script);
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.log(e);
    }

    return () => {
      div?.removeChild(script);
    };
  }, []);

  return (
    <div ref={divRef}>
      <ins
        className="adsbygoogle"
        data-ad-format="fluid"
        data-ad-layout-key="-f9+6c+j-cw+l9"
        data-ad-client="ca-pub-6949812709353975"
        data-ad-slot="4347833804"
      ></ins>
    </div>
  );
};
