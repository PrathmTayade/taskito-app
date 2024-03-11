import { useQueryClient } from "@tanstack/react-query";
import { create } from "zustand";

type CardModalStore = {
  id: string | undefined;
  isOpen: boolean;
  onOpen: (id: string) => void;
  onClose: () => void;
};

export const useCardModal = create<CardModalStore>((set) => ({
  id: undefined,
  isOpen: false,
  onClose: () => {
    set({ isOpen: false, id: undefined });
  },
  onOpen: (id) => set({ isOpen: true, id: id }),
}));
