import { create } from 'zustand'
import type {Pokedex} from "@/assets/types.ts";

interface PokedexState {
    pokedex: Pokedex | undefined,
    setPokedex: (pkdx:Pokedex) => void
}
export const usePokedex = create<PokedexState>((set) => ({
    pokedex: undefined,
    setPokedex: (pkdx:Pokedex) => set({ pokedex : pkdx}),
}))