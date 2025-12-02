import type {Dictionary, Pokemon} from "@/pages/main-page/MainPage.tsx";
import {Item, ItemActions, ItemContent, ItemDescription, ItemTitle} from "@/components/ui/item.tsx";
import {Button} from "@/components/ui/button.tsx";
import type {Type} from "pokenode-ts";
import TypeIcon from "@/components/TypeIcon.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import PokemonRelation from "@/components/PokemonRelation.tsx";
import {cn} from "@/lib/utils.ts";
import {memo} from "react";

const pokemonSpritePrefix = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";

function PokemonCard({pokemon, types, entry}: { pokemon: Pokemon }) {

    function Capitalize(val) {
        return String(val).charAt(0).toUpperCase() + String(val).slice(1);
    }

    return (
        <>
            <Item variant="outline"
                  className={"gap-0 py-2 my-2 bg-card h-[15rem]"}>
                <ItemContent className={"w-fit h-fit"}>

                    <div className={""}>
                        <div className={"flex justify-around"}>

                            <div className={"w-1/3 my-auto"}>

                                <h1 className={"text-lg font-bold"}>{Capitalize(pokemon.name)}</h1>
                                <h1 className={"text-lg font-bold"}>#{entry}</h1>
                            </div>
                            <img loading="lazy"
                                 src={pokemonSpritePrefix+pokemon.sprite}
                                 alt={pokemon.name}
                                 className={"w-24 h-24"}/>

                            <div className={"w-1/3 flex space-y-2"}>
                                <div className={"flex items-center mx-auto space-x-2"}>
                                    {
                                        Object.values(pokemon.types).map((type) => {
                                            return <TypeIcon key={type} type={type} additionalClass={"w-6"}/>
                                        })
                                    }
                                </div>
                            </div>
                        </div>

                        <Separator className={""}/>

                        <div className={"flex justify-evenly"}>
                            {pokemon.relations.none &&
                                <PokemonRelation title="0" relations={pokemon.relations.none} types={types}/>}
                            {pokemon.relations.quarter &&
                                <PokemonRelation title="0.25" relations={pokemon.relations.quarter} types={types}/>}
                            {pokemon.relations.half &&
                                <PokemonRelation title="0.5" relations={pokemon.relations.half} types={types}/>}
                            {pokemon.relations.double &&
                                <PokemonRelation title="2" relations={pokemon.relations.double} types={types}/>}
                            {pokemon.relations.quadruple &&
                                <PokemonRelation title="4" relations={pokemon.relations.quadruple} types={types}/>}


                        </div>
                    </div>

                </ItemContent>
                <ItemActions>
                </ItemActions>
            </Item>
        </>
    )
}

export default memo(PokemonCard, (prev, next) =>
    prev.pokemon.id === next.pokemon.id &&
    prev.entry === next.entry
);