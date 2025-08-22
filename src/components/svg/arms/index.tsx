import { Part } from "@src/types/puppet";
import F_Basic from "./lArm_basic";
import F_Massue from "./lArm_massue";
import R_Basic from "./rArm_basic";

const part: Part = {
  key: "arms",
  label: "Bras",
  logo: "/assets/icons/arms/Arms_icon.svg",
  skins: [
    {
      id: 0,
      name: "Bras standard",
      logo: "/assets/icons/arms/Arms_basic_icon.svg",
      elements: [
        { z: 3, Element: R_Basic, shift: { x: 0.5, y: 1 } },
        { z: 5, Element: F_Basic, shift: { x: 2, y: 1 } },
      ],
    },
    {
      id: 1,
      name: "Bras massue",
      logo: "/assets/icons/arms/Arms_massue_icon.svg",
      elements: [
        { z: 3, Element: R_Basic, shift: { x: 0.5, y: 1 } },
        { z: 5, Element: F_Massue, shift: { x: 2, y: 1 } },
      ],
    },
  ],
};

export default part;
