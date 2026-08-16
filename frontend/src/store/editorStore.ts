import { create } from "zustand";

export type TransformMode = "translate" | "rotate" | "scale";

export interface EditorState {
    transformMode: TransformMode;
    setTransformMode: (mode: TransformMode) => void;
    activeCameraId: string | null;
    setActiveCameraId: (id: string | null) => void;
    showGrid: boolean;
    toggleGrid: () => void;
    showAxes: boolean;
    toggleAxes: () => void;
    showCameraFrustum: boolean;
    toggleCameraFrustum: () => void;
    showInspector: boolean;
    toggleInspector: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
    transformMode: "translate",
    setTransformMode: (mode) => set({ transformMode: mode }),
    activeCameraId: null,
    setActiveCameraId: (id) => set({ activeCameraId: id }),
    showGrid: true,
    toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
    showAxes: true,
    toggleAxes: () => set((state) => ({ showAxes: !state.showAxes })),
    showCameraFrustum: false,
    toggleCameraFrustum: () => set((state) => ({ showCameraFrustum: !state.showCameraFrustum })),
    showInspector: true,
    toggleInspector: () => set((state) => ({ showInspector: !state.showInspector })),
}));
