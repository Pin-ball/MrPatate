import { getPartByKey, puppet } from "@src/components/svg";
import { defaultPreset, presets } from "@src/config/presets";
import { PresetSkins } from "@src/types/puppet";
import { random } from "@src/utils";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export type Colors = Record<string, string>;

const colors: Colors = {
  black: "#000",
  grey: "#353B3F",
  white: "#FFF",
  green: "#21C488",
  red: "#FF3A4B",
  pink: "#F4D0E9",
  yellow: "#FFD53F",
  blue: "#D5EEFF",
  brown: "#9E744D",
  shadow: "#10101033",
};

type SvgRef = SVGSVGElement | null;

interface StoreState {
  svgRef: SvgRef;
  activeSkins: PresetSkins;
  activeTab: number;
  colors: Colors;
}

interface StoreActions {
  setRef: (ref: SvgRef) => void;
  setTab: (tab: number) => void;
  resetSkins: () => void;
  resetSkin: (key: string) => void;
  setSkin: (part: string, id: number) => void;
  setSkins: (key: string) => void;
  randomSkin: (key: string) => void;
  randomSkins: () => void;
}

type Store = StoreState & StoreActions;

const initialState: StoreState = {
  svgRef: null,
  activeTab: 0,
  activeSkins: defaultPreset.skins,
  colors,
};

const useStore = create<Store>()(
  immer((set) => ({
    ...initialState,

    setRef: (ref) => set({ svgRef: ref }),

    setTab: (tab) => set({ activeTab: tab }),

    resetSkins: () => set({ activeSkins: defaultPreset.skins }),

    resetSkin: (key) =>
      set((state) => {
        const firstSkinId = getPartByKey(key)?.skins[0]?.id;
        if (firstSkinId != null) state.activeSkins[key] = firstSkinId;
      }),

    setSkin: (part, id) =>
      set((state) => {
        state.activeSkins[part] = id;
      }),

    setSkins: (key) => {
      const selectedPreset = presets.find((p) => p.key === key);

      set((state) => {
        state.activeSkins = { ...defaultPreset.skins, ...selectedPreset.skins };
      });
    },

    randomSkin: (key) =>
      set((state) => {
        const availableSkins = getPartByKey(key).skins.filter(
          (s) => s.id !== state.activeSkins[key]
        );

        if (availableSkins.length === 0) return;

        state.activeSkins[key] =
          availableSkins[random(0, availableSkins.length)].id;
      }),

    randomSkins: () =>
      set((state) => {
        puppet.forEach((part) => {
          state.activeSkins[part.key] =
            part.skins[random(0, part.skins.length)].id;
        });
      }),
  }))
);

export default useStore;
