import { Language } from "@/types/entities/general-entities";
import { create } from "zustand";

type SupportedLanguagesStore = {
  supportedLanguages: Language[];
  setSupportedLanguages: (supportedLanguages: Language[]) => void;
  getLanguageNameByUUID: (languageUUID: string) => string;
};

export const useSupportedLanguagesStore = create<SupportedLanguagesStore>(
  (set, get) => ({
    supportedLanguages: [],
    setSupportedLanguages: (supportedLanguages) => set({ supportedLanguages }),
    getLanguageNameByUUID: (languageUUID) => {
      const { supportedLanguages } = get();
      const language = supportedLanguages.find(
        (language) => language.uuid === languageUUID
      );
      return language?.name ?? "";
    }
  })
);
