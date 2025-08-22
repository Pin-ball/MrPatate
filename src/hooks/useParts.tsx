import arms from "@src/components/svg/arms";
import back from "@src/components/svg/back";
import background from "@src/components/svg/background";
import body from "@src/components/svg/body";
import eyes from "@src/components/svg/eyes";
import legs from "@src/components/svg/legs";
import mouth from "@src/components/svg/mouth";
import useStore from "@src/store/store";
import { ActivePartSkinElement, Part } from "@src/types/puppet";
import { useMemo } from "react";

export const puppet = [body, mouth, eyes, arms, legs, back, background];

const useParts = () => {
  const { activeSkins: skins } = useStore();

  const activeElements = useMemo(() => {
    return puppet
      .reduce((acc: ActivePartSkinElement[], part: Part) => {
        const activeSkin = part.skins.find((s) => s.id === skins[part.key]);
        const activeSkinElements = activeSkin.elements.map((e) => ({
          ...e,
          key: part.key,
        }));

        acc.push(...activeSkinElements);
        return acc;
      }, [])
      .sort((a, b) => a.z - b.z);
  }, [skins]);

  return { activeElements };
};

export default useParts;
