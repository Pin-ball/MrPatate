import { Preset } from "@src/types/puppet";

export const defaultPreset: Preset = {
  key: "basic",
  name: "Normal",
  logo: "/assets/icons/body/Body_basic_icon.svg",
  skins: {
    body: 0,
    mouth: 0,
    eyes: 0,
    arms: 0,
    legs: 0,
    back: 0,
    background: 0,
  },
};

export const presets: Preset[] = [
  defaultPreset,
  {
    key: "caveman",
    name: "Caveman",
    logo: "/assets/icons/arms/Arms_massue_icon.svg",
    skins: {
      mouth: 2,
      eyes: 2,
      arms: 1,
    },
  },
  {
    key: "superman",
    name: "Superman",
    logo: "/assets/icons/back/Back_hero_icon.svg",
    skins: {
      eyes: 5,
      back: 1,
    },
  },
];
