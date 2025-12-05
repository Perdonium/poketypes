import {createContext} from "react";
import TypesTable from "@/components/TypesTable.tsx";
import PokemonList from "@/components/PokemonList.tsx";
import VersionSelector from "@/components/VersionSelector.tsx";

import pokemons from "@/data/pokemons.json";
import pokedexes from "@/data/pokedexes.json";
import {versions, versionGroups} from "@/data/versions.json";
import types from "@/data/types.json";
import tips from "@/data/tips.json";
import type {PokemonContextType} from "@/assets/types.ts";
import TypeCard from "@/components/TypeCard.tsx";

export const PokemonContext = createContext<PokemonContextType>({
    pokemons,
    pokedexes,
    versions,
    versionGroups,
    types,
    tips
});

function MainPage() {

    return (
        <div className={"w-full"}>
            {/*<h1 className={"mb-16 text-4xl font-bold"}>PokeTypes.fr</h1>*/}
            <VersionSelector/>
            <div className={"flex flex-col lg:flex-row lg:gap-16 md:h-full justify-around max-w-7xl mx-auto"}>
                <div className={"flex flex-col justify-between"} id={"left-part"}>
                    <TypesTable/>
                    <TypeCard/>
                </div>
                <PokemonList/>
            </div>
        </div>
    )
}

export default MainPage