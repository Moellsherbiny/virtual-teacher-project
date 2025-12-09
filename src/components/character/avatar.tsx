"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import { createAvatar } from "@dicebear/core";
import { thumbs } from "@dicebear/collection";
import Image from "next/image";
import { Hand } from "lucide-react";

export default function Avatar({text}:{text:string}) {
  const avatarRef = useRef<HTMLDivElement>(null);
 
  const [showWave, setShowWave] = useState(false);
  const [message, setMessage] = useState("");

  const avatar = useMemo(() => {
    return createAvatar(thumbs, {
      size: 96,
      radius: 30,
      mouth: ["variant1", "variant2"],
      faceRotation: [-50, 0],
      backgroundType:["gradientLinear"],
      
    }).toDataUri();
  }, []);


  useEffect(() => {
    const el = avatarRef.current;
    if (!el) return;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);

      const rotateX = y * -0.04;
      const rotateY = x * 0.04;

      el.style.transform = `
        perspective(800px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        scale(1.05)
      `;
    };

    const reset = () => {
      el.style.transform = "perspective(800px) rotateX(0) rotateY(0) scale(1)";
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseout", reset);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mousemove", reset);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowWave(true);

      let i = 0;
      setMessage("");

      const typing = setInterval(() => {
        setMessage(text.slice(0, i + 1));
        i++;
        if (i >= text.length) clearInterval(typing);
      }, 100);
      setTimeout(() => setShowWave(false), 2000);
    }, 5000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="avatar-interactive-wrapper">
      <div className="avatar-interactive" ref={avatarRef}>
        <Image
          src={avatar}
          alt="avatar"
          width={300}
          height={300}
          className="avatar-img"
        />

      
        {showWave && <div className="wave-hand"><Hand size={32} scale={100} className="text-primary text-3xl" /></div>}
        {showWave && (
          <div className="hello-text text-nowrap">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
