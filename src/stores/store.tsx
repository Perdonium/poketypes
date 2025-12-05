import { create } from 'zustand'
import type {Type, VersionGroup} from "@/assets/types.ts";

interface PokedexState {
    national: boolean,
    setNational: (n:boolean) => void,
    versionGroup: VersionGroup | undefined,
    setVersionGroup: (group:VersionGroup) => void,
    currentType: Type | undefined,
    setCurrentType: (type:Type) => void,
}
export const usePokedex = create<PokedexState>((set) => ({
    national: false,
    setNational: (n:boolean)=> set({ national : n}),
    versionGroup: undefined,
    setVersionGroup: (group:VersionGroup) => set({ versionGroup : group}),
    currentType: undefined,
    setCurrentType: (type:Type) => set({ currentType : type}),
}))