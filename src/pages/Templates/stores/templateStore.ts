import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { TemplateFormData } from "../../../types/template.type";

interface TemplateStore {
  // Modal states
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  isPreviewDrawerOpen: boolean;

  // Selected template for edit/preview
  selectedTemplate: TemplateFormData | null;

  // Modal actions
  openCreateModal: () => void;
  closeCreateModal: () => void;
  openEditModal: (template: TemplateFormData) => void;
  closeEditModal: () => void;
  openPreviewDrawer: (template: TemplateFormData) => void;
  closePreviewDrawer: () => void;

  // Clear selected template
  clearSelectedTemplate: () => void;
}

export const useTemplateStore = create<TemplateStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      isCreateModalOpen: false,
      isEditModalOpen: false,
      isPreviewDrawerOpen: false,
      selectedTemplate: null,

      // Modal actions
      openCreateModal: () => {
        set({
          isCreateModalOpen: true,
          selectedTemplate: null,
        });
      },

      closeCreateModal: () => {
        set({
          isCreateModalOpen: false,
          selectedTemplate: null,
        });
      },

      openEditModal: (template) => {
        set({
          isEditModalOpen: true,
          selectedTemplate: template,
        });
      },

      closeEditModal: () => {
        set({
          isEditModalOpen: false,
          selectedTemplate: null,
        });
      },

      openPreviewDrawer: (template) => {
        set({
          isPreviewDrawerOpen: true,
          selectedTemplate: template,
        });
      },

      closePreviewDrawer: () => {
        set({
          isPreviewDrawerOpen: false,
          selectedTemplate: null,
        });
      },

      clearSelectedTemplate: () => {
        set({ selectedTemplate: null });
      },
    }),
    {
      name: "template-store",
    }
  )
);
