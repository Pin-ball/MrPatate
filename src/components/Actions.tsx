import { DownloadIcon, FavoriteIcon, ShareIcon } from "@src/assets/icons/index";
import Download from "@src/components/Download";
import Favorite from "@src/components/Favorite";
import Share from "@src/components/Share";
import useOutsideClick from "@src/components/useOutsideClick";
import clsx from "clsx";
import { useRef, useState } from "react";

enum ActionName {
  favorite = "favorite",
  download = "download",
  share = "share",
}

const actions = [
  { name: ActionName.favorite, icon: FavoriteIcon },
  { name: ActionName.download, icon: DownloadIcon },
  { name: ActionName.share, icon: ShareIcon },
];

export default function Actions() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<ActionName | null>(null);

  useOutsideClick(containerRef, () => {
    if (selected) setSelected(null);
  });

  const handleSelection = (name: ActionName) => {
    setSelected((prev) => (prev === name ? null : name));
  };

  return (
    <div
      ref={containerRef}
      className="relative flex ml-auto gap-2 px-4 py-2.5 rounded-lg border border-c-neutral-700 bg-c-neutral-800"
    >
      {actions.map(({ name, icon }) => (
        <Action
          key={name}
          name={name}
          icon={icon}
          selected={selected}
          onClick={handleSelection}
        />
      ))}

      {selected === ActionName.favorite && <Favorite />}
      {selected === ActionName.download && <Download />}
      {selected === ActionName.share && <Share />}
    </div>
  );
}

interface ActionProps {
  name: ActionName;
  icon: string;
  selected: ActionName;
  onClick: (name: ActionName) => void;
}

function Action({ name, icon, selected, onClick }: ActionProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(name)}
      className={clsx(
        "p-2 rounded-full transition-transform duration-150 active:scale-90",
        selected === name
          ? "bg-c-green-500"
          : "bg-c-neutral-700 hover:bg-c-neutral-600"
      )}
    >
      <img src={icon} alt={name} className="invert w-5 h-5" />
    </button>
  );
}
