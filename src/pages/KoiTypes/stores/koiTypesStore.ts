import { create } from "zustand";
import type { KoiBreedType } from "../../../types/koi-breed.type";

interface KoiTypesState {
  currentKoiType: KoiBreedType | null;
  setCurrentKoiType: (koiType: KoiBreedType | null) => void;
  isModalOpen: boolean;
  setModalOpen: (isOpen: boolean) => void;
  isDelete: boolean;
  setDelete: (isDelete: boolean) => void;
}

const useKoiTypesStore = create<KoiTypesState>((set) => ({
  currentKoiType: null,
  setCurrentKoiType: (koiType) => set({ currentKoiType: koiType }),
  isModalOpen: false,
  setModalOpen: (isOpen) => set({ isModalOpen: isOpen }),
  isDelete: false,
  setDelete: (isDelete) => set({ isDelete }),
}));

export default useKoiTypesStore;
