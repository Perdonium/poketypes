import {createContext, useState} from "react";
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
import {Tabs, TabsList} from "@/components/ui/tabs";
import {TabsTrigger} from "@/components/ui/tabs.tsx";
import {cn} from "@/lib/utils.ts";

export const PokemonContext = createContext<PokemonContextType>({
    pokemons,
    pokedexes,
    versions,
    versionGroups,
    types,
    tips
});

function MainPage() {
    const [tab, setTab] = useState("pokemons");

    const onTabChange = (value:string) => {
        setTab(value);
    }
    
    return (
        <div className={"w-full"}>
            {/*<h1 className={"mb-16 text-4xl font-bold"}>PokeTypes.fr</h1>*/}
            <VersionSelector/>
            <Tabs id={"tabs"} value={tab} onValueChange={onTabChange} className={"lg:hidden"}>
                <TabsList className={"mx-auto mb-4"}>
                    <TabsTrigger value="pokemons">Pokémons</TabsTrigger>
                    <TabsTrigger value="grid">Grille des types</TabsTrigger>
                </TabsList>
            </Tabs>
            <div className={"flex flex-col lg:flex-row lg:gap-16 md:h-full justify-around max-w-7xl mx-auto"}>
                <div className={cn("flex flex-col justify-between gap-4",
                    tab != "grid" && "hidden lg:inline")} id={"left-part"}>
                    <TypesTable/>
                    <TypeCard/>
                </div>
                <div className={cn(tab != "pokemons" && "hidden lg:inline")}>
                    <div className={"lg:hidden"}>
                        <TypeCard/>
                    </div>
                    <PokemonList/>
                </div>
            </div>
        </div>
    )
}

export default MainPage