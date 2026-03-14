import {Item, ItemActions, ItemContent} from "@/components/ui/item.tsx";
import TypeIcon from "@/components/TypeIcon.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import PokemonRelation from "@/components/PokemonRelation.tsx";
import {memo, useContext} from "react";
import type {Dictionary, Pokemon, Type} from "@/assets/types.ts";
import {PokemonContext} from "@/pages/MainPage.tsx";
import {Capitalize, cn, GetPokemonTypes} from "@/lib/utils.ts";

const pokemonSpritePrefix = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";

const colors: { [color: string] : string } = {
    "blue": "bg-gradient-to-t from-blue-300/20 to-blue-500/50",
    "red": "bg-gradient-to-t from-red-300/20 to-red-500/50",
    "green": "bg-gradient-to-t from-green-300/20 to-green-500/50",
    "yellow": "bg-gradient-to-t from-yellow-300/20 to-yellow-500/50",
    "purple": "bg-gradient-to-t from-purple-300/20 to-purple-500/50",
    "brown": "bg-gradient-to-t from-orange-300/20 to-orange-500/50", // Orange used as substitute for brown
    "black": "bg-gradient-to-t from-gray-800/20 to-gray-900/50",
    "white": "bg-gradient-to-t from-white/20 to-gray-100/50",
    "gray": "bg-gradient-to-t from-gray-400/20 to-gray-600/50",
    "pink": "bg-gradient-to-t from-pink-300/20 to-pink-500/50",
    "cyan": "bg-gradient-to-t from-cyan-300/20 to-cyan-500/50",
    "orange": "bg-gradient-to-t from-orange-300/20 to-orange-500/50",
    "beige": "bg-gradient-to-t from-yellow-100/20 to-yellow-200/50",
    "gold": "bg-gradient-to-t from-yellow-500/20 to-yellow-600/50",
    "silver": "bg-gradient-to-t from-gray-500/20 to-gray-600/50",
    "violet": "bg-gradient-to-t from-purple-500/20 to-purple-600/50",
    "indigo": "bg-gradient-to-t from-indigo-500/20 to-indigo-600/50",
    "fuchsia": "bg-gradient-to-t from-pink-500/20 to-pink-600/50",
    "lavender": "bg-gradient-to-t from-purple-200/20 to-purple-300/50",
    "lightblue": "bg-gradient-to-t from-blue-200/20 to-blue-400/50"
};

/*
const colorsB: { [color: string] : string } = {
    "blue": "bg-gradient-to-t from-blue-300/40 to-blue-500/70",
    "red": "bg-gradient-to-t from-red-300/40 to-red-500/70",
    "green": "bg-gradient-to-t from-green-300/40 to-green-500/70",
    "yellow": "bg-gradient-to-t from-yellow-300/40 to-yellow-500/70",
    "purple": "bg-gradient-to-t from-purple-300/40 to-purple-500/70",
    "brown": "bg-gradient-to-t from-orange-300/40 to-orange-500/70", // Orange used as substitute for brown
    "black": "bg-gradient-to-t from-gray-800/40 to-gray-900/70",
    "white": "bg-gradient-to-t from-white/40 to-gray-100/70",
    "gray": "bg-gradient-to-t from-gray-400/40 to-gray-600/70",
    "pink": "bg-gradient-to-t from-pink-300/40 to-pink-500/70",
    "cyan": "bg-gradient-to-t from-cyan-300/40 to-cyan-500/70",
    "orange": "bg-gradient-to-t from-orange-300/40 to-orange-500/70",
    "beige": "bg-gradient-to-t from-yellow-100/40 to-yellow-200/70",
    "gold": "bg-gradient-to-t from-yellow-500/40 to-yellow-600/70",
    "silver": "bg-gradient-to-t from-gray-500/40 to-gray-600/70",
    "violet": "bg-gradient-to-t from-purple-500/40 to-purple-600/70",
    "indigo": "bg-gradient-to-t from-indigo-500/40 to-indigo-600/70",
    "fuchsia": "bg-gradient-to-t from-pink-500/40 to-pink-600/70",
    "lavender": "bg-gradient-to-t from-purple-200/40 to-purple-300/70",
    "lightblue": "bg-gradient-to-t from-blue-200/40 to-blue-400/70"
};*/

function PokemonCard({pokemon, entry, onClick, onHoverStart, onHoverEnd, lang, generation}: { pokemon: Pokemon, entry: number, onClick: (p: Pokemon) => void, onHoverStart: (p: Pokemon) => void, onHoverEnd: (p: Pokemon) => void, lang:string, generation:string }) {
    const {types}: { types: Dictionary<Type> } = useContext(PokemonContext);

    return (
        <>
            <Item variant="outline"
                  className={cn("gap-0 py-2 my-2 h-[15rem] border-l-0 border-r-0 border-b-0 border-t border-white/50 mx-1 overflow-hidden",
                      "hover:scale-105 hover:cursor-pointer hover:z-50 transition-all",
                      pokemon.color in colors && colors[pokemon.color])}
                  onClick={() => onClick(pokemon)}
                  onMouseEnter={() => onHoverStart(pokemon)}
                  onMouseLeave={() => onHoverEnd(pokemon)}
            >

                <ItemContent className={"w-fit h-fit"}>

                    <div className={""}>
                        <div className={"relative flex justify-around"}>

                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                 className="pointer-events-none absolute blur-xl left-1/2 -translate-x-1/2 top-full -translate-y-1/2 w-[300px] opacity-80 -z-10">
                                <circle cx={"50%"} cy={"10%"} r="50"/>
                            </svg>

                            {
                                /*           
                                                 <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                                                 className="pointer-events-none absolute blur-xl left-0 -translate-x-1/2 -translate-y-1/2 w-[300px] opacity-60">
                                                                <circle cx={"50%"} cy={"10%"} r="100" fill={pokemon.color}/>
                                                            </svg>
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                                                 className="pointer-events-none absolute blur-xl left-full -translate-x-1/2 translate-y-full w-[300px] opacity-60">
                                                                <circle cx={"50%"} cy={"10%"} r="100" fill={pokemon.color}/>
                                                            </svg>
                                                            */
                            }
                            <div className={"w-1/3 my-auto"}>

                                <h1 className={"text-lg font-bold"}>{Capitalize(pokemon.names[lang])}</h1>
                                <h1 className={"text-lg font-bold"}>#{entry}</h1>
                            </div>
                            <img loading="lazy"
                                 src={pokemonSpritePrefix + pokemon.sprite}
                                 alt={pokemon.name}
                                 className={"w-24 h-24"}/>
                            <div className={"w-1/3 flex space-y-2"}>
                                <div className={"flex items-center mx-auto space-x-2"}>
                                    {
                                        Object.values(GetPokemonTypes(pokemon, generation)).map((type) => {
                                            return <TypeIcon key={type} type={type} additionalClass={"w-8"}/>
                                        })
                                    }
                                </div>
                            </div>
                        </div>

                        <Separator className={"bg-white/40"}/>

                        <div className={"flex justify-evenly [&>*:first-child]:hidden mt-4 -mx-2"}>
                            {pokemon.relations.none &&
                                <PokemonRelation title="0"
                                                 typeList={pokemon.relations.none.map(x => types[x.toString()].name)}
                                                 orientation={"vertical"}/>}
                            {pokemon.relations.quarter &&
                                <PokemonRelation title="0.25"
                                                 typeList={pokemon.relations.quarter.map(x => types[x.toString()].name)}
                                                 orientation={"vertical"}/>}
                            {pokemon.relations.half &&
                                <PokemonRelation title="0.5"
                                                 typeList={pokemon.relations.half.map(x => types[x.toString()].name)}
                                                 orientation={"vertical"}/>}
                            {pokemon.relations.double &&
                                <PokemonRelation title="2"
                                                 typeList={pokemon.relations.double.map(x => types[x.toString()].name)}
                                                 orientation={"vertical"}/>}
                            {pokemon.relations.quadruple &&
                                <PokemonRelation title="4"
                                                 typeList={pokemon.relations.quadruple.map(x => types[x.toString()].name)}
                                                 orientation={"vertical"}/>}


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
    prev.entry === next.entry &&
    prev.lang === next.lang &&
    prev.generation === next.generation
);