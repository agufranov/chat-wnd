import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

const DRAFT_KEY_RGX = /$draft-(?<chatId>.+)/;

const getDraftKey = (chatId: string) => `draft-${chatId}`;

type DraftStore = {
  drafts: { [chatId: string]: string };
  setDraft: (chatId: string, text: string) => void;
  clearDraft: (chatId: string) => void;
};

export const useDraftStore = create<DraftStore>()(
  immer((set, get) => {
    const deserialize = () =>
      Object.fromEntries(
        Object.keys(localStorage)
          .filter(DRAFT_KEY_RGX.test)
          .map((key) => {
            const chatId = DRAFT_KEY_RGX.exec(key)?.groups?.chatId;
            return [chatId, localStorage[key]];
          })
      );

    set((state) => (state.drafts = deserialize()));

    return {
      drafts: {},

      setDraft: (chatId: string, text: string) => {
        localStorage.setItem(getDraftKey(chatId), text);
      },

      clearDraft: (chatId: string) => {
        localStorage.removeItem(getDraftKey(chatId));
      },
    };
  })
);
