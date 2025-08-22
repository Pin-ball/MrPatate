import { Part } from "@src/types/puppet";
import Basic from "./body_basic";

const part: Part = {
  key: "body",
  label: "Corps",
  logo: "/assets/icons/body/Body_icon.svg",
  skins: [
    {
      id: 0,
      name: "Corps standard",
      logo: "/assets/icons/body/Body_basic_icon.svg",
      elements: [{ z: 4, Element: Basic, shift: { x: 1, y: 1 } }],
    },
  ],
};

export default part;
