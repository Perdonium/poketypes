import {createContext, useContext} from "react";
import TypesTable from "@/components/TypesTable.tsx";
import PokemonList from "@/components/PokemonList.tsx";
import VersionSelector from "@/components/VersionSelector.tsx";

import pokemons from "@/data/pokemons.json";
import pokedexes from "@/data/pokedexes.json";
import {versions, versionGroups} from "@/data/versions.json";
import types from "@/data/types.json";
import type {Dictionary, PokemonContextType, Type} from "@/assets/types.ts";
import TypeCard from "@/components/TypeCard.tsx";

export const PokemonContext = createContext<PokemonContextType>({
    pokemons,
    pokedexes,
    versions,
    versionGroups,
    types
});

function MainPage() {

    return (
        <div className={"w-full"}>
            {/*<h1 className={"mb-16 text-4xl font-bold"}>PokeTypes.fr</h1>*/}
            <VersionSelector/>
            <div className={"flex flex-col md:flex-row gap-16 md:h-full"}>
                <TypesTable/>
                <TypeCard type={types && Object.values(types)[0]}/>
                <PokemonList/>
            </div>
        </div>
    )
}

export default MainPage