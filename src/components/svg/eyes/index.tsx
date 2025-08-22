import { Part } from "@src/types/puppet";
import Basic from "./eyes_basic";
import Bottom from "./eyes_bottom";
import Crying from "./eyes_crying";
import Cyclope from "./eyes_cyclope";
import Hero from "./eyes_hero";
import Kawaii from "./eyes_kawaii";
import Mono from "./eyes_mono";
import Six from "./eyes_six";
import Top from "./eyes_top";

const part: Part = {
  key: "eyes",
  label: "Yeux",
  logo: "/assets/icons/eyes/Eyes_icon.svg",
  skins: [
    {
      id: 0,
      name: "Yeux standard",
      logo: "/assets/icons/eyes/Eyes_basic_icon.svg",
      elements: [{ z: 5, Element: Basic, shift: { x: 2, y: 1 } }],
    },
    {
      id: 1,
      name: "Yeux haut",
      logo: "/assets/icons/eyes/Eyes_top_icon.svg",
      elements: [{ z: 5, Element: Top, shift: { x: 2, y: 1 } }],
    },
    {
      id: 2,
      name: "Yeux bas",
      logo: "/assets/icons/eyes/Eyes_bottom_icon.svg",
      elements: [{ z: 5, Element: Bottom, shift: { x: 2, y: 1 } }],
    },
    {
      id: 3,
      name: "Yeux qui pleure",
      logo: "/assets/icons/eyes/Eyes_crying_icon.svg",
      elements: [{ z: 5, Element: Crying, shift: { x: 2, y: 1 } }],
    },
    {
      id: 4,
      name: "Yeux de cyclope",
      logo: "/assets/icons/eyes/Eyes_cyclope_icon.svg",
      elements: [{ z: 5, Element: Cyclope, shift: { x: 2, y: 1 } }],
    },
    {
      id: 5,
      name: "Yeux de hero",
      logo: "/assets/icons/eyes/Eyes_hero_icon.svg",
      elements: [{ z: 5, Element: Hero, shift: { x: 2, y: 1 } }],
    },
    {
      id: 6,
      name: "Yeux kawaii",
      logo: "/assets/icons/eyes/Eyes_kawaii_icon.svg",
      elements: [{ z: 5, Element: Kawaii, shift: { x: 2, y: 1 } }],
    },
    {
      id: 7,
      name: "Un oeil",
      logo: "/assets/icons/eyes/Eyes_mono_icon.svg",
      elements: [{ z: 5, Element: Mono, shift: { x: 2, y: 1 } }],
    },
    {
      id: 8,
      name: "Six yeux",
      logo: "/assets/icons/eyes/Eyes_six_icon.svg",
      elements: [{ z: 5, Element: Six, shift: { x: 2, y: 1 } }],
    },
  ],
};

export default part;
