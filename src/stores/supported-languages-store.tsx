import { Language } from "@/types/entities/general-entities";
import { create } from "zustand";

type SupportedLanguagesStore = {
  supportedLanguages: Language[];
  setSupportedLanguages: (supportedLanguages: Language[]) => void;
};

export const useSupportedLanguagesStore = create<SupportedLanguagesStore>(
  (set) => ({
    supportedLanguages: [],
    setSupportedLanguages: (supportedLanguages) => set({ supportedLanguages })
  })
);
