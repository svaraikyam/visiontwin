import { create } from "zustand";
import { SceneObject } from "../models/SceneObject";

export interface SceneState {
    objects: SceneObject[];
    selected: string | null;
    addObject: (object: SceneObject) => void;
    removeObject: (id: string) => void;
    selectObject: (id: string | null) => void;
    updateObject: (
        id: string,
        updater: Partial<SceneObject> | ((obj: SceneObject) => void)
    ) => void;
    deleteSelectedObject: () => void;
}

export const useSceneStore = create<SceneState>((set) => ({
    objects: [],
    selected: null,

    addObject: (object) =>
        set((state) => ({
            objects: [...state.objects, object],
            selected: object.id,
        })),

    removeObject: (id) =>
        set((state) => ({
            objects: state.objects.filter((obj) => obj.id !== id),
            selected: state.selected === id ? null : state.selected,
        })),

    selectObject: (id) =>
        set((state) => ({
            selected: id,
            objects: state.objects.map((obj) => {
                const updated = Object.assign(
                    Object.create(Object.getPrototypeOf(obj)),
                    obj
                );
                updated.selected = obj.id === id;
                return updated;
            }),
        })),

    updateObject: (id, updater) =>
        set((state) => ({
            objects: state.objects.map((obj) => {
                if (obj.id !== id) return obj;
                const updatedObj = Object.assign(
                    Object.create(Object.getPrototypeOf(obj)),
                    obj
                );
                if (typeof updater === "function") {
                    updater(updatedObj);
                } else {
                    Object.assign(updatedObj, updater);
                }
                return updatedObj;
            }),
        })),

    deleteSelectedObject: () =>
        set((state) => {
            if (!state.selected) return state;
            return {
                objects: state.objects.filter((obj) => obj.id !== state.selected),
                selected: null,
            };
        }),
}));

