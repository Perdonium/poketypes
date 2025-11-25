import {useEffect, useState} from "react";
import type {Dictionary, Pokemon} from "@/pages/main-page/MainPage.tsx";
import PokemonCard from "@/components/PokemonCard.tsx";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";

function PokemonList({pokemons, types}:{pokemons:Dictionary<Pokemon>}) {

    return (
        <div className={"h-96 md:h-[90vh]"}>
            <ScrollArea className="rounded-md h-full border overflow-hidden">
            {pokemons && Object.values(pokemons).map((pokemon: Pokemon) => {
                return <PokemonCard pokemon={pokemon} types={types}/>;
            })}

            </ScrollArea>
        </div>
    )
}

export default PokemonList