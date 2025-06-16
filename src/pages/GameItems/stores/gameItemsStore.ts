import { create } from "zustand";
import type { ItemType } from "../../../types/ItemType";

interface GameItemsState {
  currentItem: ItemType | null;
  setCurrentItem: (item: ItemType | null) => void;
  isModalOpen: boolean;
  setModalOpen: (isOpen: boolean) => void;
  isDelete: boolean;
  setDelete: (isDelete: boolean) => void;
}

const useGameItemsStore = create<GameItemsState>((set) => ({
  currentItem: null,
  setCurrentItem: (item) => set({ currentItem: item }),
  isModalOpen: false,
  setModalOpen: (isOpen) => set({ isModalOpen: isOpen }),
  isDelete: false,
  setDelete: (isDelete) => set({ isDelete }),
}));

export default useGameItemsStore;
