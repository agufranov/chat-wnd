import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

const DRAFT_KEY_RGX = /$draft-(?<chatId>.+)/;

const getDraftKey = (chatId: string) => `draft-${chatId}`;

type DraftStore = {
  drafts: { [chatId: string]: string };
  getDraft: (chatId: string) => string;
  setDraft: (chatId: string, text: string) => void;
  clearDraft: (chatId: string) => void;
};

export const useDraftStore = create<DraftStore>()(
  immer((set, get) => {
    const deserialize = () =>
      Object.fromEntries(
        Object.keys(localStorage)
          .filter((str) => DRAFT_KEY_RGX.test(str))
          .map((key) => {
            const chatId = DRAFT_KEY_RGX.exec(key)?.groups?.chatId;
            return [chatId, localStorage[key]];
          })
      );

    return {
      drafts: deserialize(),

      getDraft: (chatId: string) => localStorage.getItem(getDraftKey(chatId)),

      setDraft: (chatId: string, text: string) => {
        set((state) => {
          state.drafts[chatId] = text;
        });
        localStorage.setItem(getDraftKey(chatId), text);
      },

      clearDraft: (chatId: string) => {
        set((state) => {
          delete state.drafts[chatId];
        });
        localStorage.removeItem(getDraftKey(chatId));
      },
    };
  })
);
