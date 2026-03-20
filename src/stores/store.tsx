import {create} from 'zustand'
import type {Pokemon, Type, VersionGroup} from "@/assets/types.ts";
import {persist} from "zustand/middleware";

const possibleLanguages: string[] = ["en","fr","es","de"];

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

function GetDefaultLang(){
    const defaultLang = "en";
    const navLang = navigator.language;
    console.log(navLang);
    let navCode = defaultLang;
    if(navLang.split("-").length != 2)
        navCode = navLang;
    else 
        navCode = navLang.split("-")[0];
    if(possibleLanguages.includes(navCode))
        return navCode;
    else
        return defaultLang;
}
export const usePokedex = create<PokedexState>()(
    persist(
        (set) => ({
            national: true,
            setNational: (n: boolean) => set({national: n}),
            versionGroup: undefined,
            setVersionGroup: (group: VersionGroup) => set({versionGroup: group}),
            currentType: undefined,
            setCurrentType: (type: Type) => set({currentType: type}),
            lang: GetDefaultLang(),
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