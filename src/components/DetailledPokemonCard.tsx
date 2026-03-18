import {Item, ItemActions, ItemContent} from "@/components/ui/item.tsx";
import TypeIcon from "@/components/TypeIcon.tsx";
import {memo, useContext} from "react";
import type {Dictionary, Pokemon, Type} from "@/assets/types.ts";
import {PokemonContext} from "@/pages/MainPage.tsx";
import {Capitalize, cn, GetPokemonRelations, GetPokemonTypes, GetTypesFromNames} from "@/lib/utils.ts";
import DetailledPokemonRelation from "@/components/DetailledPokemonRelation.tsx";
import {usePokedex} from "@/stores/store.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ArrowLeftIcon} from "lucide-react";

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
function DetailledPokemonCard({pokemon, entry, lang, closeFunction}: { pokemon: Pokemon, entry: number, lang:string, closeFunction:() => void }) {
    const {types}: { types: Dictionary<Type> } = useContext(PokemonContext);

    const versionGroup = usePokedex((state) => state.versionGroup);
    const relations = GetPokemonRelations(pokemon, versionGroup!.generation);
    
    return (
        <>
            {
                <Button
                    variant={"outline"}
                    size={"icon"}
                    className={"fixed !ring ring-border -top-12 left-0 bg-primary-foreground!"}
                    onClick={closeFunction}
                >
                    <ArrowLeftIcon/>
                </Button>

            }
            <Item variant="outline"
                  className={cn("gap-0 py-2 h-auto border-l-0 border-r-0 border-b-0 border-t border-white/50",
                  pokemon.color in colors && colors[pokemon.color])}>

                <ItemContent className={"w-fit h-full"}>

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

                                <h1 className={"text-lg font-bold w-fit mx-auto"}>{Capitalize(pokemon.names[lang])}</h1>
                                <h1 className={"text-lg font-bold w-fit mx-auto"}>#{entry}</h1>
                            </div>
                            <img loading="lazy"
                                 src={pokemonSpritePrefix + pokemon.sprite}
                                 alt={pokemon.name}
                                 className={"w-24 h-24"}/>
                            <div className={"w-1/3 flex space-y-2"}>
                                <div className={"flex items-center mx-auto space-x-2"}>
                                    {
                                        GetTypesFromNames(GetPokemonTypes(pokemon, versionGroup!.generation)).map((type, ind) => {
                                            return <TypeIcon key={ind} type={type} additionalClass={"w-8"} showName={true}/>
                                        })
                                    }
                                </div>
                            </div>
                        </div>

                        <Separator className={"bg-white/40"}/>
                        <div className={"scrollbar justify-evenly mt-2 -mx-2 [&>*:first-child]:hidden max-h-[50vh] xl:max-h-[75vh] overflow-y-auto"}>
                            {relations.none &&
                                <DetailledPokemonRelation title="0"
                                                 typeList={relations.none.map(x => types[x.toString()].name)}
                                                 orientation={"horizontal"}/>}
                            {relations.quarter &&
                                <DetailledPokemonRelation title="0.25"
                                                 typeList={relations.quarter.map(x => types[x.toString()].name)}
                                                 orientation={"horizontal"}/>}
                            {relations.half &&
                                <DetailledPokemonRelation title="0.5"
                                                 typeList={relations.half.map(x => types[x.toString()].name)}
                                                 orientation={"horizontal"}/>}
                            {relations.double &&
                                <DetailledPokemonRelation title="2"
                                                 typeList={relations.double.map(x => types[x.toString()].name)}
                                                 orientation={"horizontal"}/>}
                            {relations.quadruple &&
                                <DetailledPokemonRelation title="4"
                                                 typeList={relations.quadruple.map(x => types[x.toString()].name)}
                                                 orientation={"horizontal"}/>}


                        </div>
                    </div>

                </ItemContent>
                <ItemActions>
                </ItemActions>
            </Item>
        </>
    )
}

export default memo(DetailledPokemonCard, (prev, next) =>
    prev.pokemon.id === next.pokemon.id &&
    prev.entry === next.entry
);