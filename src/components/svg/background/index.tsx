import { Part } from "@src/types/puppet";

const part: Part = {
  key: "background",
  label: "Background",
  logo: "/assets/icons/body/Body_icon.svg",
  skins: [
    {
      id: 0,
      name: "Montagne",
      logo: "/assets/icons/global/Empty.svg",
      elements: [{ z: 0, Element: () => null }],
    },
    {
      id: 1,
      name: "Montagne",
      active: false,
      logo: "/assets/icons/body/Body_basic_icon.svg",
      elements: [
        { z: 0, Element: () => null /* Montain */, shift: { x: 10, y: 1 } },
      ],
    },
  ],
};

export default part;
