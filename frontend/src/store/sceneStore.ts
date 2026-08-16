import { create } from "zustand";
import { SceneObject } from "../models/SceneObject";

interface SceneState {
    objects: SceneObject[];
    selected: string | null;
    addObject: (object: SceneObject) => void;
    removeObject: (id: string) => void;
    selectObject: (id: string | null) => void;
}

export const useSceneStore = create<SceneState>((set) => ({
    objects: [],
    selected: null,

    addObject: (object) =>
        set((state) => ({
            objects: [...state.objects, object],
        })),

    removeObject: (id) =>
        set((state) => ({
            objects: state.objects.filter((obj) => obj.id !== id),
            // Unselect if the deleted object was the selected one
            selected: state.selected === id ? null : state.selected, 
        })),

    selectObject: (id) =>
        set((state) => ({
            selected: id,
            //  FIX: Returns a brand new object reference for every item
            objects: state.objects.map((obj) => ({
                ...obj,
                selected: obj.id === id,
            })),
        })),
}));
