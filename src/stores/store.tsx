import {create} from 'zustand'
import type {Pokemon, Type, VersionGroup} from "@/assets/types.ts";
import {persist} from "zustand/middleware";

interface PokedexState {
    national: boolean,
    setNational: (n: boolean) => void,
    versionGroup: VersionGroup | undefined,
    setVersionGroup: (group: VersionGroup) => void,
    currentType: Type | undefined,
    setCurrentType: (type: Type) => void,
    lang: string,
    setLang: (lang: string) => void,
    highlightedPokemon: Pokemon | undefined,
    setHighlightedPokemon: (pokemon: Pokemon | undefined) => void,
}

export const usePokedex = create<PokedexState>()(
    persist(
        (set, get) => ({
            national: false,
            setNational: (n: boolean) => set({national: n}),
            versionGroup: undefined,
            setVersionGroup: (group: VersionGroup) => set({versionGroup: group}),
            currentType: undefined,
            setCurrentType: (type: Type) => set({currentType: type}),
            lang: "fr",
            setLang: (lang: string) => set({lang: lang}),
            highlightedPokemon: undefined,
            setHighlightedPokemon: (pokemon: Pokemon | undefined) => set({highlightedPokemon: pokemon}),

        }),
        {
            name: 'pokedex-storage', // name of the item in the storage (must be unique)
            partialize: (state) => ({
                national: state.national,
                versionGroup: state.versionGroup,
                lang: state.lang
            }),
        },
    ))