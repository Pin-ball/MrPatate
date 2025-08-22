import useParts from "@src/hooks/useParts";
import useStore from "@src/store/store";
import { useEffect, useRef, useState } from "react";

export default function Viewer() {
  const { setRef } = useStore();
  const svgRef = useRef<SVGSVGElement | null>();
  const [hoverElement, setHoverElement] = useState<string | null>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [target, setTarget] = useState({ x: 0, y: 0 });

  const { activeElements: elements } = useParts();

  useEffect(() => {
    setRef(svgRef.current);
    return () => setRef(null);
  }, []);

  useEffect(() => {
    const ease = 0.1;
    let animationFrame: number;

    const move = () => {
      setTarget((prev) => ({
        x: prev.x + (cursor.x - prev.x) * ease,
        y: prev.y + (cursor.y - prev.y) * ease,
      }));
      animationFrame = requestAnimationFrame(move);
    };

    move();

    return () => cancelAnimationFrame(animationFrame);
  }, [cursor]);

  const handleHover = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;

    const { x, y, height, width } = svgRef.current.getBoundingClientRect();
    const xShift = (e.clientX - x) / (width / 2) - 1;
    const yShift = (e.clientY - y) / (height / 2) - 1;

    setCursor({ x: -xShift, y: -yShift });
  };

  const handleLeave = () => {
    setCursor({ x: 0, y: 0 });
  };

  const getTransform = (shift?: { x?: number; y?: number }) => {
    const tx = target.x * (shift?.x ?? 0);
    const ty = target.y * ((shift?.y ?? 0) / 2);
    const rotateY = target.x * 25;
    const skewY = target.x * (shift?.x ?? 0);

    return `translate(${tx}rem, ${ty}rem) rotateY(${rotateY}deg) skewY(${skewY}deg)`;
  };

  return (
    <svg
      ref={svgRef}
      onMouseMove={handleHover}
      onMouseLeave={handleLeave}
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      x="0px"
      y="0px"
      width="80"
      height="100"
      viewBox="0 0 800 1000"
      fill="#000"
      enableBackground="new 0 0 800 1000"
      className="w-auto grow"
    >
      {elements.map(({ Element, shift, key }, i) => (
        <Element
          key={i}
          onClick={() => console.log("Click element: ", key)}
          onMouseOver={() => setHoverElement(key)}
          onMouseLeave={() => setHoverElement(null)}
          className="text-black animate-skinChange" // hover:text-slate-50
          style={{ transformOrigin: "50% 50%", transform: getTransform(shift) }}
        />
      ))}
    </svg>
  );
}
