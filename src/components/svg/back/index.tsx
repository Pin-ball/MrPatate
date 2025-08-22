import { Part } from "@src/types/puppet";
import Hero from "./back_hero";

const part: Part = {
  key: "back",
  label: "Dos",
  logo: "/assets/icons/back/Back_icon.svg",
  skins: [
    {
      id: 0,
      name: "Rien de spécial",
      logo: "/assets/icons/global/Empty.svg",
      elements: [{ z: 5, Element: () => null }],
    },
    {
      id: 1,
      name: "Cape de super héro",
      logo: "/assets/icons/back/Back_hero_icon.svg",
      elements: [{ z: 5, Element: Hero, shift: { x: 1, y: 1 } }],
    },
  ],
};

export default part;
