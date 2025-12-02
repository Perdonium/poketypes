import { create } from 'zustand'
import type {Pokedex} from "@/pages/main-page/MainPage.tsx";

export const usePokedex = create((set) => ({
    pokedex: undefined,
    setPokedex: (pkdx:Pokedex) => set({ pokedex : pkdx}),
}))