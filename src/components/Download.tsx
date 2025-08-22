import useStore from "@src/store/store";
import { downloadSvg } from "@src/utils/index";
import { saveSvgAsPng } from "save-svg-as-png";

export default function Download() {
  const { svgRef } = useStore();

  const getSvg = () => {
    if (svgRef) downloadSvg(svgRef, "Pierre.svg");
  };

  const getPng = () => {
    if (svgRef) saveSvgAsPng(svgRef, "Pierre.png");
  };

  return (
    <div className="absolute right-0 px-4 py-2 border rounded-lg top-16 border-c-neutral-700 bg-c-neutral-800">
      <div className="mb-4 text-sm font-extralight text-c-neutral-600">
        Téléchargement
      </div>
      <ul>
        <Item action={getSvg} title="SVG" description="Optimisé" />
        <Item action={getPng} title="PNG" description="1600&nbsp;x&nbsp;2000" />
      </ul>
    </div>
  );
}

const Item = ({ action, title, description }) => (
  <li
    onClick={action}
    className="flex items-center justify-between px-2 py-1 mb-1 -mx-2 transition-all rounded hover:bg-c-neutral-700 active:scale-95"
  >
    {title}
    <span className="ml-12 text-sm font-extralight text-c-neutral-600">
      {description}
    </span>
  </li>
);
