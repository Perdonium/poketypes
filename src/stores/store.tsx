import { create } from 'zustand'
import type {Pokedex} from "pokenode-ts";

export const usePokedex = create((set) => ({
    pokedex: undefined,
    setPokedex: (pkdx:Pokedex) => set({ pokedex : pkdx}),
}))