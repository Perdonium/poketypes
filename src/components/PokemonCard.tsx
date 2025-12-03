import {Item, ItemActions, ItemContent} from "@/components/ui/item.tsx";
import TypeIcon from "@/components/TypeIcon.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import PokemonRelation from "@/components/PokemonRelation.tsx";
import {memo, useContext} from "react";
import type {Dictionary, Pokemon, Type} from "@/assets/types.ts";
import {PokemonContext} from "@/pages/main-page/MainPage.tsx";
import {Capitalize} from "@/lib/utils.ts";
const pokemonSpritePrefix = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";

function PokemonCard({pokemon, entry}: { pokemon: Pokemon, entry:number }) {
    const {types}:{types:Dictionary<Type>} = useContext(PokemonContext);
    
    console.log(pokemon);
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
                                <PokemonRelation title="0" typeList={pokemon.relations.none.map(x => types[x.toString()].name)}/>}
                            {pokemon.relations.quarter &&
                                <PokemonRelation title="0.25" typeList={pokemon.relations.quarter.map(x =>  types[x.toString()].name)}/>}
                            {pokemon.relations.half &&
                                <PokemonRelation title="0.5" typeList={pokemon.relations.half.map(x =>  types[x.toString()].name)}/>}
                            {pokemon.relations.double &&
                                <PokemonRelation title="2" typeList={pokemon.relations.double.map(x =>  types[x.toString()].name)}/>}
                            {pokemon.relations.quadruple &&
                                <PokemonRelation title="4" typeList={pokemon.relations.quadruple.map(x =>  types[x.toString()].name)}/>}


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