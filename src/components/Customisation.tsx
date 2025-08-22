import { RandomIcon, ResetIcon } from "@src/assets/icons";
import { puppet } from "@src/components/svg";
import useStore from "@src/store/store";
import { Part, PartSkin, PresetSkins } from "@src/types/puppet";
import clsx from "clsx";
import { useState } from "react";

export default function Customisation() {
  const [tab, setTab] = useState<number>(0);
  const { activeSkins: skins, resetSkin, setSkin, randomSkin } = useStore();

  const selectedPart: Part = puppet[tab];
  const selectedSkinId: PresetSkins = skins[selectedPart.key];
  const selectedSkin = selectedPart.skins.find((s) => s.id === selectedSkinId);

  return (
    <div className="flex h-full">
      <div className="pr-4 mr-4 border-r shrink-0 border-c-neutral-700  overflow-auto ">
        {puppet.map((part: Part, i) => (
          <SidebarItem
            key={part.key}
            active={tab === i}
            part={part}
            onClick={() => setTab(i)}
          />
        ))}
      </div>

      <div className="flex flex-col grow">
        <div className="flex justify-between mb-4">
          <div>
            <p className="text-sm font-extralight text-c-neutral-600">
              {selectedPart.label}
            </p>
            <p>{selectedSkin.name || "Inconnu"}</p>
          </div>

          <div className="flex gap-2 my-auto shrink-0">
            <SkinAction
              icon={ResetIcon}
              alt="Reset"
              onClick={() => resetSkin(selectedPart.key)}
            />
            <SkinAction
              icon={RandomIcon}
              alt="Random"
              onClick={() => randomSkin(selectedPart.key)}
            />
          </div>
        </div>

        <ul className="flex flex-wrap content-start gap-2 overflow-auto grow">
          {selectedPart.skins.map((s, i) => (
            <SkinOption
              key={s.id + s.name}
              skin={s}
              active={s.id === selectedSkinId}
              onClick={() => setSkin(selectedPart.key, s.id)}
              index={i}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

interface SidebarItemProps {
  part: Part;
  active: boolean;
  onClick: () => void;
}

function SidebarItem({ part, active, onClick }: SidebarItemProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "mb-2 p-2 rounded-full cursor-pointer",
        active ? "bg-c-green-400" : "bg-c-neutral-700"
      )}
    >
      <img src={part.logo} alt={part.label} className="size-6" />
    </div>
  );
}

interface SkinActionProps {
  icon: string;
  alt: string;
  onClick: () => void;
}

function SkinAction({ icon, alt, onClick }: SkinActionProps) {
  return (
    <button
      onClick={onClick}
      className="p-2 transition-all rounded-full bg-c-neutral-700 hover:bg-c-green-500 active:scale-90"
    >
      <img src={icon} alt={alt} className="invert size-5" />
    </button>
  );
}

interface SkinOptionProps {
  index: number;
  skin: PartSkin;
  active: boolean;
  onClick: () => void;
}

function SkinOption({ index, skin, active, onClick }: SkinOptionProps) {
  return (
    <li
      onClick={onClick}
      className={clsx(
        "p-0 cursor-pointer rounded opacity-0 animate-skinOptionStagger",
        active ? "bg-c-green-400" : "hover:bg-c-neutral-700"
      )}
      style={{ animationDelay: `${(index + 1) * 50}ms` }}
    >
      <div className={clsx("p-2 ", active && "animate-skinOptionPop")}>
        <img className="size-12" src={skin.logo} alt={skin.name} />
      </div>
    </li>
  );
}
