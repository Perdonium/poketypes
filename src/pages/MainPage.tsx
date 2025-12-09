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

    const onTabChange = (value: string) => {
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
            <div className={"relative flex flex-col lg:flex-row lg:gap-16 md:h-full justify-around max-w-7xl mx-auto"}>
                {/*
                <svg id="visual" viewBox="0 0 960 540" width="960" height="540" xmlns="http://www.w3.org/2000/svg"
                     className={"absolute -z-10 scale-200  blur-2xl opacity-50"}>
                    <g transform="translate(429.3661266171773 199.57083853162754)">
                        <path
                            d="M198.6 138.5C163.4 175.7 -24 148.8 -82.4 98.2C-140.9 47.6 -70.4 -26.8 23.2 -13.4C116.9 0 233.8 101.2 198.6 138.5"
                            fill="#434cd7"></path>
                    </g>
                </svg>
                */}
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