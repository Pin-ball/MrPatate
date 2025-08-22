import { ReactNode, SVGProps } from "react";

export enum SkinEnum {
  body = "body",
  mouth = "mouth",
  eyes = "eyes",
  arms = "arms",
  legs = "legs",
  back = "back",
  background = "background",
}

export type PresetSkins = Partial<Record<SkinEnum, number>>;

export interface Preset {
  key: string;
  name: string;
  logo: string;
  skins: PresetSkins;
}

export interface Part {
  key: string;
  label: string;
  logo: string;
  skins: PartSkin[];
  active?: boolean;
}

export interface PartSkin {
  id: number;
  name: string;
  logo: string;
  elements: PartSkinElement[];
  active?: boolean;
}

export interface PartSkinElement {
  z: number;
  Element: (props: SVGProps<SVGGElement>) => ReactNode;
  shift?: { x: number; y: number };
}

export interface ActivePartSkinElement extends PartSkinElement {
  key: string;
}
