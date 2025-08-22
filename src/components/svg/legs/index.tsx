import { Part } from "@src/types/puppet";
import L_Basic from "./lLeg_basic";
import R_Basic from "./rLeg_basic";

const part: Part = {
  key: "legs",
  label: "Jambes",
  logo: "/assets/icons/legs/Legs_icon.svg",
  skins: [
    {
      id: 0,
      name: "Jambe standard",
      logo: "/assets/icons/legs/Legs_basic_icon.svg",
      elements: [
        {
          z: 3,
          Element: R_Basic,
          shift: { x: 1, y: 1 },
        },
        {
          z: 5,
          Element: L_Basic,
          shift: { x: 2, y: 1 },
        },
      ],
    },
  ],
};

export default part;
